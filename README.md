# Product Description AI 🚀

> Un tableau de bord SaaS moderne et performant pour générer des descriptions de produits optimisées pour le SEO grâce à l'intelligence artificielle de Google Gemini.

Ce projet transforme la création de fiches produits e-commerce en un processus automatisé, rapide et hautement personnalisable. Conçu avec une esthétique moderne haut de gamme (bento grid, effet frosted glass, animations fluides), il offre une expérience utilisateur exceptionnelle digne des meilleurs outils professionnels.

---

## ✨ Fonctionnalités clés

- 📊 **Tableau de Bord Style Bento Grid** : Une mise en page responsive et dynamique qui organise le formulaire de génération, le résultat en temps réel et l'historique de manière optimale.
- ⚙️ **Paramètres de Génération Avancés** :
  - Choix du **ton** (professionnel, persuasif, décontracté, luxueux, humoristique, etc.).
  - **Longueur du texte** (court, moyen, long).
  - **Plateforme cible** (Shopify, Amazon, WooCommerce, Réseaux sociaux).
  - **Langue de génération** (Français, Anglais, Espagnol, Allemand, Italien).
  - **Optimisation SEO** : Ajout de mots-clés stratégiques pour un référencement naturel optimal.
- 🕒 **Historique et Persistance** : Sauvegarde locale automatique (dans le `localStorage`) de vos générations précédentes, avec possibilité de les rechercher et de les charger instantanément depuis la barre latérale.
- 📈 **Statistiques en Temps Réel** : Visualisez vos statistiques de production (nombre total de fiches générées, nombre total de mots générés, statut opérationnel du moteur Gemini).
- 🎨 **Design & UX Premium** :
  - Thème sombre et moderne avec dégradés soignés.
  - Micro-animations, transitions fluides et effets de survol réactifs.
  - Effet de confettis festif (`canvas-confetti`) lors de chaque génération réussie.
  - Modale de configuration intégrée pour l'API Key.

---

## 🛠️ Stack Technique

- **Framework** : React 19 (avec TypeScript)
- **Outil de Build** : Vite
- **Stylisation** : CSS Moderne (variables CSS, Flexbox, Grid, Glassmorphism, animations personnalisées)
- **Icônes** : Lucide React
- **Effets** : Canvas Confetti
- **API d'Intelligence Artificielle** : Google Gemini API (`@google/generative-ai`)

---

## 🚀 Démarrage Rapide

### Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée) et `npm`.

### Installation

1. **Cloner le dépôt** :
   ```bash
   git clone <url-du-depot-github>
   cd "Product Description AI"
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer la clé API Gemini** :
   Pour utiliser la génération, vous aurez besoin d'une clé API Gemini. Vous pouvez l'obtenir gratuitement sur [Google AI Studio](https://aistudio.google.com/).
   Deux manières de la configurer :
   - **Dans le fichier d'environnement** : Créez un fichier `.env` à la racine du projet et ajoutez votre clé :
     ```env
     VITE_GEMINI_API_KEY=votre_cle_api_ici
     ```
   - **Depuis l'interface** : Cliquez sur le bouton "Paramètres" (icône engrenage) directement dans le tableau de bord pour saisir et sauvegarder votre clé de manière sécurisée dans votre navigateur.

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible par défaut à l'adresse [http://localhost:5173](http://localhost:5173).

---

## 📦 Construction pour la Production

Pour compiler l'application de manière optimisée pour la production :

```bash
npm run build
```

Les fichiers statiques générés seront placés dans le dossier `/dist`, prêts à être déployés sur des plateformes d'hébergement comme Vercel, Netlify, ou GitHub Pages.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
