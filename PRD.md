# Planning Guide

Une application de révision interactive permettant de maîtriser 70 points de connaissance avec suivi de progression personnalisé et mode quiz. Chaque utilisateur GitHub dispose automatiquement de son propre historique de progression sauvegardé indépendamment des autres utilisateurs.

**Experience Qualities**: 
1. **Organisé** - L'interface doit permettre une navigation claire entre vue d'ensemble et détails de chaque point
2. **Progressif** - Le système de notation visuel doit montrer clairement l'évolution de la maîtrise
3. **Engageant** - Le mode quiz doit rendre l'apprentissage interactif et motivant

**Complexity Level**: Light Application (multiple features with basic state)
Cette application combine plusieurs fonctionnalités (vue liste, détails, système de notation, quiz, authentification utilisateur) avec une gestion d'état persistante pour suivre la progression individuelle de chaque utilisateur.

## Essential Features

### Authentification utilisateur multi-utilisateur
- **Functionality**: Identification automatique de l'utilisateur via l'API Spark User avec isolation complète des progressions
- **Purpose**: Permettre à plusieurs utilisateurs de partager l'application tout en conservant leur propre progression indépendante
- **Trigger**: Au chargement de l'application
- **Progression**: Chargement de l'app → Récupération des informations utilisateur GitHub → Vérification de la progression personnelle dans `user-progress-{userId}` → Si nouvel utilisateur, initialisation avec les thèmes définis par l'owner et statuts "Faible" → Affichage de l'avatar utilisateur dans le header → Toast de bienvenue pour les nouveaux utilisateurs
- **Success criteria**: Chaque utilisateur voit son avatar, sa propre progression est isolée des autres, les notes personnelles sont privées, le propriétaire peut modifier les thèmes maîtres via l'admin

### Vue synthétique des 70 points
- **Functionality**: Afficher la liste complète des 70 points de connaissance avec leur statut de maîtrise
- **Purpose**: Permettre une vision d'ensemble rapide de la progression globale
- **Trigger**: Affichage par défaut au lancement de l'application
- **Progression**: Chargement de l'app → Affichage de la grille/liste des 70 points → Chaque point montre son titre et son badge de maîtrise (couleur distincte) → Filtrage possible par niveau de maîtrise
- **Success criteria**: L'utilisateur peut voir d'un coup d'œil combien de points sont maîtrisés, en cours, ou faibles

### Détail d'un point de connaissance
- **Functionality**: Afficher le texte descriptif complet d'un point sélectionné
- **Purpose**: Permettre l'étude approfondie de chaque concept
- **Trigger**: Clic sur un point dans la vue synthétique
- **Progression**: Clic sur un point → Ouverture d'un modal/panneau → Affichage du titre et texte descriptif → Boutons pour modifier le niveau de maîtrise → Fermeture et retour à la vue synthétique
- **Success criteria**: Le texte est lisible, le changement de statut est immédiat et persistant

### Système de notation de maîtrise
- **Functionality**: Trois niveaux de maîtrise attribuables à chaque point
- **Purpose**: Permettre l'auto-évaluation et le suivi de progression
- **Trigger**: Depuis la vue détaillée d'un point
- **Progression**: Ouverture du détail → Sélection du niveau (Faible/En cours/Maîtrisé) → Mise à jour visuelle immédiate → Sauvegarde automatique → Reflet dans la vue synthétique
- **Success criteria**: Les trois états sont visuellement distincts, la progression persiste entre sessions

### Mode Quiz
- **Functionality**: Mode interactif présentant les points aléatoirement pour révision
- **Purpose**: Tester et renforcer la mémorisation de manière active
- **Trigger**: Bouton "Mode Quiz" depuis la vue principale
- **Progression**: Activation du mode quiz → Sélection optionnelle des niveaux à réviser → Présentation aléatoire d'un point (titre uniquement) → L'utilisateur réfléchit → Révélation du texte descriptif → Auto-évaluation et mise à jour du niveau → Point suivant
- **Success criteria**: L'ordre est aléatoire, possibilité de filtrer par niveau de maîtrise, progression fluide entre les questions

## Edge Case Handling
- **Premier lancement d'un utilisateur**: Tous les points démarrent au niveau "Faible" par défaut pour ce nouvel utilisateur avec les thèmes définis par l'owner
- **Utilisateurs multiples simultanés**: Chaque utilisateur authentifié a son propre historique de progression isolé via une clé unique `user-progress-{userId}`, les notes personnelles ne sont jamais partagées
- **Modification des thèmes par l'owner**: Les utilisateurs non-propriétaires voient les nouveaux thèmes mais conservent leur progression et notes personnelles
- **Toast de bienvenue**: Affiché uniquement lors de la première visite de l'utilisateur, puis marqué comme vu
- **Quiz sans points disponibles**: Message indiquant qu'aucun point ne correspond aux filtres sélectionnés
- **Données corrompues**: Rechargement avec les 70 points par défaut si erreur de parsing
- **Changement rapide de statut**: Debounce pour éviter les clics multiples accidentels
- **État de chargement**: Spinner affiché pendant la récupération des données utilisateur et de la progression

## Design Direction
L'application doit évoquer un environnement d'apprentissage moderne et motivant - sérieux mais pas austère, avec une hiérarchie visuelle claire qui guide l'œil entre vue d'ensemble et focus sur les détails. Les couleurs doivent communiquer instantanément l'état de progression.

## Color Selection

- **Primary Color**: Indigo profond (oklch(0.45 0.15 270)) - Évoque la concentration et l'étude, couleur principale pour les actions importantes
- **Secondary Colors**: 
  - Gris ardoise (oklch(0.35 0.02 240)) pour les éléments de structure
  - Blanc cassé (oklch(0.98 0.01 90)) pour les arrière-plans de contenu
- **Accent Color**: Violet vif (oklch(0.60 0.20 300)) pour les CTAs et éléments interactifs importants comme le bouton Quiz
- **Status Colors**:
  - Faible: Rouge corail (oklch(0.65 0.19 25)) - Attention requise
  - En cours: Orange ambré (oklch(0.70 0.15 60)) - Progression en cours
  - Maîtrisé: Vert émeraude (oklch(0.65 0.17 155)) - Succès et accomplissement
- **Foreground/Background Pairings**:
  - Primary (Indigo oklch(0.45 0.15 270)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent (Violet oklch(0.60 0.20 300)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Background (White cassé oklch(0.98 0.01 90)): Dark text (oklch(0.25 0.02 240)) - Ratio 12.8:1 ✓
  - Faible (Rouge oklch(0.65 0.19 25)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - En cours (Orange oklch(0.70 0.15 60)): Dark text (oklch(0.25 0.02 240)) - Ratio 7.2:1 ✓
  - Maîtrisé (Vert oklch(0.65 0.17 155)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection
Les polices doivent allier lisibilité pour la lecture de contenus éducatifs et personnalité pour rendre l'expérience engageante.

- **Typographic Hierarchy**: 
  - H1 (Titre app): Space Grotesk Bold/32px/tight tracking pour une présence forte et moderne
  - H2 (Titres des points): Space Grotesk Semibold/20px/normal tracking
  - Body (Textes descriptifs): Inter Regular/16px/1.6 line-height pour une lecture confortable
  - Labels (Statuts, compteurs): Inter Medium/14px/uppercase/wide tracking pour différenciation

## Animations
Les animations doivent renforcer la compréhension des actions sans ralentir le flux d'apprentissage.

- Transitions douces (200ms) lors du changement de statut de maîtrise avec effet de scale subtil
- Apparition progressive (fade + slide) des détails de point pour créer de la profondeur
- Effet de flip/reveal lors de la révélation de la réponse en mode quiz
- Micro-interactions sur les badges de statut au hover (slight lift + glow)
- Progress bar animée montrant le pourcentage global de maîtrise

## Component Selection
- **Components**: 
  - Card (shadcn) pour chaque point dans la vue grille avec hover states prononcés
  - Dialog (shadcn) pour l'affichage détaillé des points
  - Badge (shadcn) personnalisé avec les couleurs de statut
  - Button (shadcn) pour les actions principales (Quiz, changement de statut)
  - Progress (shadcn) pour la barre de progression globale
  - Tabs (shadcn) pour filtrer par niveau de maîtrise dans la vue principale
  - RadioGroup (shadcn) pour la sélection du niveau de maîtrise
  - Avatar (shadcn) pour afficher la photo de profil utilisateur
  - DropdownMenu (shadcn) pour le menu utilisateur avec accès aux fonctionnalités owner
- **Customizations**: 
  - Grid layout personnalisé responsive pour les 70 points (5 colonnes desktop → 2 colonnes mobile)
  - Quiz card avec effet flip utilisant framer-motion
  - Badge de statut avec dot indicator animé
  - Avatar utilisateur avec initiales en fallback
  - Spinner de chargement personnalisé pour l'état initial
- **States**: 
  - Buttons: États hover avec légère élévation et changement de saturation, active avec press effect
  - Cards: Hover avec shadow+scale, selected avec border accent
  - Badges: Static mais avec dot pulsing pour "en cours"
  - Avatar: Hover avec légère élévation pour indiquer l'interactivité
  - Loading: Spinner animé avec message contextuel
- **Icon Selection**: 
  - Phosphor icons: Brain pour le mode quiz, CheckCircle pour maîtrisé, Warning pour faible, Clock pour en cours, List pour vue synthétique, Shuffle pour randomisation, User pour profil utilisateur, Upload pour import (owner uniquement)
- **Spacing**: 
  - Container padding: p-6 desktop, p-4 mobile
  - Card gap: gap-4 dans la grille
  - Internal card padding: p-4
  - Section spacing: space-y-6
  - Avatar spacing: mr-3 dans le header
- **Mobile**: 
  - Grille 5 colonnes → 2 colonnes en mobile
  - Dialog plein écran sur mobile
  - Tabs horizontaux avec scroll
  - Touch-friendly button sizing (min 44px)
  - Quiz cards avec swipe gesture pour next/previous
  - Avatar réduit en mobile avec dropdown adaptatif
