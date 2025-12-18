# Guide d'intégration des APIs RTE, ENEDIS et ODRE

Ce document explique comment intégrer les vraies APIs de données énergétiques dans l'application.

## APIs disponibles

### 1. RTE - Réseau de Transport d'Électricité

**Base URL** : `https://digital.iservices.rte-france.com/open_api`

**Documentation** : [https://data.rte-france.com/](https://data.rte-france.com/)

#### Inscription et authentification

1. Créer un compte sur [https://data.rte-france.com/](https://data.rte-france.com/)
2. Créer une application pour obtenir vos identifiants OAuth2
3. Obtenir un access token via OAuth2

#### Endpoints principaux

**Consommation en temps réel**
```
GET /consumption/v1/short_term
```

**Production par filière**
```
GET /generation_mix/v1/actual_generations_per_production_type
```

**Prévisions de consommation**
```
GET /consumption/v1/short_term_forecasts
```

#### Exemple de requête

```typescript
const getRTEAccessToken = async () => {
  const response = await fetch('https://digital.iservices.rte-france.com/token/oauth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
};

const getConsumption = async (token: string) => {
  const response = await fetch(
    'https://digital.iservices.rte-france.com/open_api/consumption/v1/short_term',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
};
```

### 2. ODRE - Open Data Réseaux Énergies

**Base URL** : `https://odre.opendatasoft.com/api/explore/v2.1`

**Documentation** : [https://odre.opendatasoft.com/](https://odre.opendatasoft.com/)

**Pas d'authentification requise** - API publique

#### Datasets disponibles

**Production régionale**
```
/catalog/datasets/production-electrique-par-filiere-a-la-maille-region
```

**Consommation régionale**
```
/catalog/datasets/consommation-electrique-par-secteur-dactivite-region
```

**Installation solaire et éolienne**
```
/catalog/datasets/registre-national-installation-production-stockage-electricite-agrege
```

#### Exemple de requête

```typescript
const getRegionalProduction = async () => {
  const response = await fetch(
    'https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/production-electrique-par-filiere-a-la-maille-region/records?limit=100',
    {
      headers: {
        'Accept': 'application/json'
      }
    }
  );
  return response.json();
};
```

### 3. ENEDIS - Données de distribution

**Portal** : [https://data.enedis.fr/](https://data.enedis.fr/)

**Note** : ENEDIS fournit principalement des datasets téléchargeables plutôt qu'une API temps réel.

#### Datasets disponibles

- Consommation annuelle par commune
- Production injection par commune
- Données de compteurs Linky (agrégées)

## Intégration dans l'application

### Étape 1 : Créer un service API

Créer `src/services/realEnergyApi.ts` :

```typescript
const RTE_CLIENT_ID = import.meta.env.VITE_RTE_CLIENT_ID;
const RTE_CLIENT_SECRET = import.meta.env.VITE_RTE_CLIENT_SECRET;

let rteToken: string | null = null;
let tokenExpiry: number = 0;

const getRTEToken = async (): Promise<string> => {
  if (rteToken && Date.now() < tokenExpiry) {
    return rteToken;
  }

  const response = await fetch(
    'https://digital.iservices.rte-france.com/token/oauth/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${RTE_CLIENT_ID}:${RTE_CLIENT_SECRET}`)
      },
      body: 'grant_type=client_credentials'
    }
  );

  const data = await response.json();
  rteToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;

  return rteToken;
};

export const fetchRealEnergyMix = async () => {
  const token = await getRTEToken();

  const response = await fetch(
    'https://digital.iservices.rte-france.com/open_api/actual_generation/v1/actual_generations_per_production_type',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );

  const data = await response.json();

  // Transformer les données au format de votre application
  return transformRTEData(data);
};

const transformRTEData = (rteData: any) => {
  // Adapter le format RTE vers votre format EnergyMixData
  return rteData.actual_generations_per_production_type.map((item: any) => ({
    timestamp: item.start_date,
    nuclear: item.values.find((v: any) => v.production_type === 'NUCLEAR')?.value || 0,
    solar: item.values.find((v: any) => v.production_type === 'SOLAR')?.value || 0,
    wind: item.values.find((v: any) => v.production_type === 'WIND')?.value || 0,
    hydro: item.values.find((v: any) => v.production_type === 'HYDRO')?.value || 0,
    thermal: item.values.find((v: any) => v.production_type === 'THERMAL')?.value || 0,
    bioenergy: item.values.find((v: any) => v.production_type === 'BIOENERGY')?.value || 0,
    total: item.values.reduce((sum: number, v: any) => sum + v.value, 0)
  }));
};
```

### Étape 2 : Ajouter les variables d'environnement

Modifier `.env` :
```
VITE_RTE_CLIENT_ID=votre_client_id
VITE_RTE_CLIENT_SECRET=votre_client_secret
```

### Étape 3 : Utiliser le service dans les composants

Modifier `src/services/energyApi.ts` :

```typescript
import { fetchRealEnergyMix } from './realEnergyApi';

export const fetchEnergyMix = async (): Promise<EnergyMixData[]> => {
  try {
    // Essayer d'utiliser les vraies données
    return await fetchRealEnergyMix();
  } catch (error) {
    console.warn('Falling back to mock data:', error);
    // Fallback vers les données mockées
    return generateMockEnergyMix();
  }
};
```

## Gestion du cache

Pour éviter de surcharger les APIs, implémentez un système de cache :

```typescript
const cache = new Map<string, { data: any, expiry: number }>();

const fetchWithCache = async (key: string, fetcher: () => Promise<any>, ttl: number = 300000) => {
  const cached = cache.get(key);

  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttl });

  return data;
};
```

## Limites des APIs

### RTE
- Limite : 500 requêtes/jour (compte gratuit)
- Données actualisées : toutes les 15 minutes
- Historique : jusqu'à 3 ans

### ODRE
- Pas de limite stricte
- Données actualisées : quotidiennement ou mensuellement selon le dataset
- Données ouvertes sous licence ODbL

### ENEDIS
- Datasets statiques (téléchargement)
- Pas d'API temps réel publique
- Données agrégées pour protection des données personnelles

## Bonnes pratiques

1. **Rate Limiting** : Respectez les limites de requêtes
2. **Cache** : Mettez en cache les données pour 5-15 minutes
3. **Fallback** : Gardez les données mockées en fallback
4. **Error Handling** : Gérez les erreurs réseau gracieusement
5. **Loading States** : Affichez des indicateurs de chargement
6. **Retry Logic** : Implémentez une logique de retry pour les erreurs temporaires

## Exemple complet d'intégration

Voir le fichier `src/services/realEnergyApi.example.ts` pour un exemple complet d'intégration avec gestion d'erreurs, cache et retry.

## Questions fréquentes

**Q: Les APIs sont-elles gratuites ?**
R: RTE et ODRE sont gratuits avec des limites. RTE nécessite une inscription.

**Q: Les données sont-elles vraiment en temps réel ?**
R: RTE fournit des données avec ~15 minutes de latence. ODRE est mis à jour quotidiennement.

**Q: Puis-je utiliser ces APIs en production ?**
R: Oui, mais respectez les conditions d'utilisation et les limites de taux.

**Q: Comment obtenir des données historiques ?**
R: Utilisez les paramètres de date dans les requêtes API. RTE permet jusqu'à 3 ans d'historique.

## Ressources supplémentaires

- [Guide RTE API](https://data.rte-france.com/catalog)
- [Catalogue ODRE](https://odre.opendatasoft.com/explore/)
- [Portail ENEDIS](https://data.enedis.fr/)
- [Open Data Energie](https://opendata.reseaux-energies.fr/)

## Support

Pour toute question sur l'intégration des APIs, consultez :
- La documentation officielle des APIs
- Les forums des communautés open data
- Le support technique des fournisseurs d'API
