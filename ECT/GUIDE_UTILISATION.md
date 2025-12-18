# Guide d'utilisation - EnergyTransition Dashboard

## Démarrage rapide

### 1. Installation et lancement

```bash
# Installation des dépendances
npm install

# Démarrer Ollama (dans un terminal séparé)
ollama serve

# Démarrer l'application
npm run dev
```

Accédez à l'application sur `http://localhost:5173`

### 2. Navigation

L'application comporte 3 onglets principaux :

#### Vue d'ensemble
Visualisez les données énergétiques nationales :
- Consommation électrique actuelle
- Pourcentage d'énergies renouvelables
- Émissions de CO2
- Mix énergétique en temps réel (graphique empilé)
- Évolution de la consommation sur 24h

#### Régions
Comparez les performances énergétiques par région :
- Graphique en barres des 6 meilleures régions
- Tri par consommation ou % d'énergies renouvelables
- Statistiques détaillées par région
- Carte interactive de France avec visualisation géographique
- Clic sur une région pour voir ses données énergétiques complètes

#### Assistant IA
Interagissez avec le chatbot IA :
- Posez vos questions sur l'énergie
- Obtenez des explications pédagogiques
- Utilisez les questions rapides suggérées

## Exemples de questions pour l'Assistant IA

### Questions sur le mix énergétique

- "Quelle est la part du nucléaire dans la production française ?"
- "Pourquoi la France utilise-t-elle autant de nucléaire ?"
- "Quelles sont les différentes sources d'énergie renouvelable ?"
- "C'est quoi la différence entre éolien terrestre et offshore ?"
- "Comment fonctionne l'énergie hydraulique ?"

### Questions sur la consommation

- "Quand consomme-t-on le plus d'électricité ?"
- "Pourquoi y a-t-il des pics de consommation ?"
- "Comment réduire ma consommation électrique ?"
- "Quelle est la différence entre puissance et énergie ?"
- "C'est quoi un mégawatt ?"

### Questions sur la transition énergétique

- "C'est quoi la transition énergétique ?"
- "Quels sont les objectifs de la France pour 2030 ?"
- "Pourquoi développer les énergies renouvelables ?"
- "Quels sont les avantages et inconvénients du solaire ?"
- "Est-ce qu'on peut remplacer le nucléaire par du renouvelable ?"

### Questions techniques

- "C'est quoi RTE et ENEDIS ?"
- "Comment fonctionne le réseau électrique français ?"
- "Qu'est-ce qu'un effacement de consommation ?"
- "C'est quoi le foisonnement en énergie ?"
- "Comment stocke-t-on l'électricité ?"

### Questions environnementales

- "Quel est l'impact carbone de l'électricité française ?"
- "Pourquoi l'électricité française est-elle peu carbonée ?"
- "Quelles énergies émettent le plus de CO2 ?"
- "C'est quoi le cycle de vie d'un panneau solaire ?"
- "Les éoliennes sont-elles recyclables ?"

## Fonctionnalités détaillées

### Graphique du Mix Énergétique

**Type** : Graphique en aires empilées (Stacked Area Chart)

**Données affichées** :
- Nucléaire (violet)
- Hydraulique (bleu)
- Éolien (cyan)
- Solaire (jaune)
- Bioénergie (vert)
- Thermique (rouge)

**Interactions** :
- Survol pour voir les valeurs exactes
- Zoom sur la timeline
- Légende cliquable pour masquer/afficher des sources

**Informations** :
- Pourcentage d'énergies renouvelables en temps réel
- Mise à jour toutes les 5 minutes

### Graphique de Consommation

**Type** : Graphique en lignes (Line Chart)

**Données affichées** :
- Consommation réelle (orange)
- Prévision de consommation (gris pointillé)

**Interactions** :
- Survol pour voir consommation exacte
- Évolution sur 24h glissantes

**Informations** :
- Consommation actuelle en GW
- Variation par rapport à l'heure précédente (%)

### Statistiques Régionales

**Type** : Graphique en barres horizontales (Horizontal Bar Chart)

**Données affichées** :
- Consommation (orange)
- Production (bleu)
- % Renouvelable (vert)

**Interactions** :
- Tri par consommation ou % renouvelable
- Top 6 régions
- Cartes de statistiques détaillées

**Régions** : Les 12 régions métropolitaines

### Carte Interactive

**Type** : Carte SVG interactive de la France

**Données affichées** :
- Visualisation géographique des 13 régions françaises (métropole + Corse)
- Code couleur par niveau de consommation :
  - Vert : < 4000 MW (consommation faible)
  - Jaune : 4000-6000 MW (consommation moyenne)
  - Orange : 6000-8000 MW (consommation élevée)
  - Rouge : > 8000 MW (consommation très élevée)

**Interactions** :
- Survol d'une région : affichage du nom
- Clic sur une région : panneau de détails avec :
  - Consommation en temps réel
  - Production d'électricité
  - Bilan énergétique (excédent/déficit)
  - Mix énergétique détaillé par source

**Fonctionnalités** :
- Mise en évidence visuelle au survol
- Légende de couleurs pour l'interprétation rapide
- Panneau latéral avec statistiques complètes
- Animation fluide lors des transitions

**Utilisation** :
1. Survolez les régions pour voir leur nom
2. Cliquez sur une région pour afficher ses données
3. Consultez le panneau de droite pour les statistiques détaillées
4. Utilisez la légende des couleurs pour comparer visuellement les régions

### Chatbot IA

**Modèle** : Llama 3.2 via Ollama

**Fonctionnalités** :
- Historique de conversation
- Questions rapides suggérées
- Réponses contextuelles
- Interface conversationnelle

**Limitations** :
- Nécessite Ollama en local
- Réponses basées sur les connaissances du modèle
- Pas d'accès aux données en temps réel (à venir)

## Comprendre les données

### Unités de mesure

- **MW** (Mégawatt) : Puissance instantanée (1 MW = 1000 kW)
- **GW** (Gigawatt) : 1000 MW
- **MWh** (Mégawattheure) : Énergie produite/consommée
- **gCO2/kWh** : Grammes de CO2 par kilowattheure

### Ordres de grandeur

- **Consommation française** : ~50-70 GW (selon l'heure)
- **Pic hivernal** : ~90-100 GW
- **Creux estival** : ~35-45 GW
- **Nucléaire** : ~60-70% du mix
- **Renouvelables** : ~25-30% du mix

### Sources d'énergie

**Pilotables** (on/off contrôlable) :
- Nucléaire
- Hydraulique (barrages)
- Thermique (gaz, charbon)

**Intermittentes** (dépendent de la météo) :
- Solaire
- Éolien

**Semi-pilotables** :
- Bioénergie
- Hydraulique au fil de l'eau

## Personnalisation

### Modifier les couleurs des graphiques

Éditez `src/components/EnergyMixChart.tsx` :

```typescript
// Modifier les couleurs des gradients
<linearGradient id="nuclear" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
  {/* Changez #8b5cf6 pour votre couleur */}
</linearGradient>
```

### Modifier le prompt du chatbot

Éditez `supabase/functions/energy-chat/index.ts` :

```typescript
const systemPrompt = `Votre prompt personnalisé...`;
```

### Changer le modèle Ollama

Dans le même fichier :

```typescript
model: 'llama3.2'  // Remplacez par 'mistral', 'llama3.1', etc.
```

## Dépannage

### Le graphique ne s'affiche pas

- Vérifiez la console du navigateur pour les erreurs
- Rechargez la page (F5)
- Vérifiez que recharts est installé (`npm list recharts`)

### Le chatbot ne répond pas

1. Vérifiez qu'Ollama est lancé : `curl http://localhost:11434`
2. Vérifiez que le modèle est disponible : `ollama list`
3. Regardez les logs dans la console du navigateur

### Les données ne se mettent pas à jour

- Les données sont actuellement simulées
- Référez-vous à `API_INTEGRATION.md` pour intégrer les vraies APIs

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance

### Optimisation du build

Le bundle est volumineux (>500KB) car il inclut Recharts et Supabase.

Pour optimiser :
1. Utiliser le code splitting avec React.lazy
2. Charger Recharts à la demande
3. Optimiser les images et assets

### Temps de chargement

- **Première visite** : ~2-3 secondes
- **Visites suivantes** : <1 seconde (cache)
- **Requête chatbot** : 2-10 secondes selon le modèle Ollama

## Développement futur

### Fonctionnalités à ajouter

- [ ] Intégration APIs réelles RTE/ENEDIS/ODRE
- [x] Carte de France interactive
- [ ] Export de données (CSV, PDF)
- [ ] Alertes sur pics de consommation
- [ ] Comparaison historique multi-années
- [ ] Mode sombre
- [ ] Favoris et signets
- [ ] Partage de visualisations

### Améliorations techniques

- [ ] Tests unitaires (Jest, React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring avec Sentry
- [ ] Analytics avec Plausible
- [ ] Progressive Web App (PWA)

## Contribution

Pour contribuer au projet :

1. Forkez le repository
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Support

Pour toute question ou problème :
- Consultez les issues GitHub
- Référez-vous à la documentation
- Contactez l'équipe du projet

## Ressources d'apprentissage

### Sur l'énergie
- [RTE Éco2mix](https://www.rte-france.com/eco2mix)
- [ADEME](https://www.ademe.fr/)
- [Ministère de la Transition Énergétique](https://www.ecologie.gouv.fr/)

### Techniques
- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Ollama Documentation](https://github.com/ollama/ollama)

Bon développement !
