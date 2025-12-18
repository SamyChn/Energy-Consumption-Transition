# Configuration Ollama pour EnergyTransition Dashboard

Ce guide vous explique comment installer et configurer Ollama pour utiliser l'assistant IA du dashboard.

## Installation d'Ollama

### Sur macOS
```bash
brew install ollama
```

### Sur Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Sur Windows
Téléchargez l'installateur depuis [ollama.ai](https://ollama.ai/download)

## Configuration

### 1. Démarrer le serveur Ollama

```bash
ollama serve
```

Le serveur démarre sur `http://localhost:11434`

### 2. Télécharger le modèle llama3.2

```bash
ollama pull llama3.2
```

Ce téléchargement peut prendre quelques minutes selon votre connexion internet.

### 3. Tester le modèle

```bash
ollama run llama3.2
```

Vous pouvez interagir avec le modèle en ligne de commande pour vérifier qu'il fonctionne correctement.

## Utilisation avec l'application

### Démarrage complet

1. **Terminal 1** : Démarrer Ollama
```bash
ollama serve
```

2. **Terminal 2** : Démarrer l'application
```bash
npm run dev
```

3. Ouvrir votre navigateur sur `http://localhost:5173`

4. Naviguer vers l'onglet "Assistant IA"

5. Poser vos questions sur l'énergie !

## Modèles alternatifs

Vous pouvez utiliser d'autres modèles si vous le souhaitez :

### Mistral (plus léger)
```bash
ollama pull mistral
```
Modifier dans `supabase/functions/energy-chat/index.ts` :
```typescript
model: 'mistral'
```

### DeepSeek Coder (spécialisé code/données)
```bash
ollama pull deepseek-coder
```

### Llama 3.1 (plus puissant)
```bash
ollama pull llama3.1
```

## Dépannage

### Le chatbot ne répond pas

1. Vérifier qu'Ollama est en cours d'exécution :
```bash
curl http://localhost:11434
```
Devrait retourner "Ollama is running"

2. Vérifier que le modèle est téléchargé :
```bash
ollama list
```
Devrait afficher `llama3.2`

3. Vérifier les logs de l'Edge Function dans la console du navigateur

### Ollama est lent

- Assurez-vous d'avoir au moins 8GB de RAM disponible
- Les premiers appels sont plus lents (chargement du modèle en mémoire)
- Utilisez un modèle plus léger comme `mistral` ou `llama3.2:1b`

### Erreur de connexion

Si l'Edge Function ne peut pas se connecter à Ollama :

1. Vérifier que le port 11434 n'est pas bloqué par un firewall
2. Sur certains systèmes, vous devrez peut-être configurer CORS dans Ollama
3. Assurez-vous que `http://localhost:11434` est accessible

## Configuration avancée

### Personnaliser le prompt système

Modifiez le prompt dans `supabase/functions/energy-chat/index.ts` pour adapter les réponses du chatbot :

```typescript
const systemPrompt = `Votre prompt personnalisé...`;
```

### Ajuster les paramètres du modèle

Dans la même fonction, vous pouvez modifier :
```typescript
options: {
  temperature: 0.7,  // Créativité (0-1)
  top_p: 0.9,        // Diversité des réponses
  num_predict: 500   // Longueur max de réponse
}
```

## Ressources

- [Documentation Ollama](https://github.com/ollama/ollama)
- [Liste des modèles disponibles](https://ollama.ai/library)
- [API Ollama](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Alternative : Utiliser un service cloud

Si vous ne pouvez pas exécuter Ollama localement, vous pouvez modifier l'Edge Function pour utiliser :
- OpenAI GPT
- Anthropic Claude
- Google Gemini
- Mistral AI

Modifiez simplement le code de l'Edge Function et ajoutez vos clés API dans les variables d'environnement Supabase.
