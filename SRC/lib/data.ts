export type MasteryLevel = 'weak' | 'progress' | 'mastered'

export interface KnowledgePoint {
  id: number
  title: string
  description: string
  mastery: MasteryLevel
  notes?: string
  videoLink?: string
}

export interface Category {
  id: number
  name: string
  description: string
  color: string
  icon: string
  pointIds: number[]
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Fondamentaux',
    description: 'Les concepts de base essentiels de React',
    color: 'oklch(0.60 0.20 300)',
    icon: 'book',
    pointIds: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: 2,
    name: 'Hooks Avancés',
    description: 'Maîtriser les hooks React pour une gestion d\'état optimale',
    color: 'oklch(0.65 0.17 155)',
    icon: 'lightning',
    pointIds: [9, 10, 11, 12, 13, 27, 28, 29, 30, 34, 35, 36, 37]
  },
  {
    id: 3,
    name: 'Patterns & Architecture',
    description: 'Patterns de conception et organisation du code',
    color: 'oklch(0.70 0.15 60)',
    icon: 'squares',
    pointIds: [14, 15, 16, 41, 68]
  },
  {
    id: 4,
    name: 'Performance',
    description: 'Optimisation et amélioration des performances',
    color: 'oklch(0.65 0.19 25)',
    icon: 'rocket',
    pointIds: [17, 19, 26, 31, 32, 33, 54, 61]
  },
  {
    id: 5,
    name: 'Styling',
    description: 'Solutions de style CSS pour React',
    color: 'oklch(0.55 0.18 280)',
    icon: 'palette',
    pointIds: [42, 43, 44]
  },
  {
    id: 6,
    name: 'Testing',
    description: 'Tests unitaires et d\'intégration',
    color: 'oklch(0.50 0.15 200)',
    icon: 'flask',
    pointIds: [45, 46, 47, 48]
  },
  {
    id: 7,
    name: 'TypeScript',
    description: 'Typage statique avec TypeScript',
    color: 'oklch(0.45 0.15 240)',
    icon: 'code',
    pointIds: [49, 50]
  },
  {
    id: 8,
    name: 'Tooling',
    description: 'Outils de développement et configuration',
    color: 'oklch(0.60 0.12 140)',
    icon: 'wrench',
    pointIds: [51, 52, 53]
  },
  {
    id: 9,
    name: 'Routing',
    description: 'Navigation et gestion des routes',
    color: 'oklch(0.58 0.16 340)',
    icon: 'navigation',
    pointIds: [55, 56, 57]
  },
  {
    id: 10,
    name: 'State Management',
    description: 'Gestion d\'état global et local',
    color: 'oklch(0.52 0.20 260)',
    icon: 'database',
    pointIds: [58, 59, 60]
  },
  {
    id: 11,
    name: 'Data Fetching',
    description: 'Récupération et gestion des données',
    color: 'oklch(0.62 0.18 180)',
    icon: 'cloud',
    pointIds: [39, 40]
  },
  {
    id: 12,
    name: 'Formulaires',
    description: 'Gestion et validation des formulaires',
    color: 'oklch(0.56 0.16 80)',
    icon: 'forms',
    pointIds: [65, 66]
  },
  {
    id: 13,
    name: 'Production',
    description: 'SEO, accessibilité, PWA et déploiement',
    color: 'oklch(0.48 0.14 320)',
    icon: 'globe',
    pointIds: [62, 63, 69, 70]
  },
  {
    id: 14,
    name: 'Fonctionnalités Avancées',
    description: 'Features React modernes et avancées',
    color: 'oklch(0.54 0.22 40)',
    icon: 'star',
    pointIds: [18, 20, 21, 22, 23, 24, 25, 38, 64, 67]
  }
]

export const INITIAL_KNOWLEDGE_POINTS: KnowledgePoint[] = [
  {
    id: 1,
    title: "Les fondamentaux de React",
    description: "React est une bibliothèque JavaScript pour créer des interfaces utilisateur. Elle utilise un paradigme déclaratif et component-based qui permet de composer des UIs complexes à partir de petits composants isolés.",
    mastery: 'weak'
  },
  {
    id: 2,
    title: "Les hooks useState et useEffect",
    description: "useState permet de gérer l'état local d'un composant. useEffect permet d'exécuter des effets de bord comme les appels API ou les abonnements, avec gestion du cycle de vie via les dépendances.",
    mastery: 'weak'
  },
  {
    id: 3,
    title: "Props et composition de composants",
    description: "Les props sont des données passées d'un composant parent à un enfant. La composition permet de construire des interfaces complexes en imbriquant des composants, favorisant la réutilisabilité.",
    mastery: 'weak'
  },
  {
    id: 4,
    title: "Le Virtual DOM",
    description: "Le Virtual DOM est une représentation en mémoire du DOM réel. React l'utilise pour optimiser les mises à jour en calculant les différences et en appliquant uniquement les changements nécessaires.",
    mastery: 'weak'
  },
  {
    id: 5,
    title: "Les événements en React",
    description: "React utilise un système d'événements synthétiques qui normalise les événements entre navigateurs. Les gestionnaires d'événements suivent la convention camelCase et reçoivent des objets SyntheticEvent.",
    mastery: 'weak'
  },
  {
    id: 6,
    title: "Le rendu conditionnel",
    description: "Le rendu conditionnel permet d'afficher différents composants ou éléments selon des conditions. On utilise des opérateurs JavaScript comme &&, ternaire, ou if/else pour contrôler ce qui est rendu.",
    mastery: 'weak'
  },
  {
    id: 7,
    title: "Les listes et keys",
    description: "Pour rendre des listes, on utilise map() sur un tableau. Chaque élément doit avoir une prop 'key' unique et stable pour que React puisse optimiser les mises à jour de la liste.",
    mastery: 'weak'
  },
  {
    id: 8,
    title: "Les formulaires contrôlés",
    description: "Un formulaire contrôlé est un formulaire dont les valeurs sont gérées par l'état React. Chaque changement dans un input déclenche une mise à jour d'état, créant une source unique de vérité.",
    mastery: 'weak'
  },
  {
    id: 9,
    title: "useContext pour le state global",
    description: "useContext permet d'accéder à des données globales sans passer de props à travers chaque niveau. On crée un Context avec createContext et on y accède avec useContext dans les composants enfants.",
    mastery: 'weak'
  },
  {
    id: 10,
    title: "useReducer pour la logique complexe",
    description: "useReducer est une alternative à useState pour gérer des états complexes. Il utilise le pattern reducer (state, action) => newState, similaire à Redux, permettant une logique d'état plus prévisible.",
    mastery: 'weak'
  },
  {
    id: 11,
    title: "Les refs avec useRef",
    description: "useRef permet de créer une référence mutable qui persiste entre les rendus. Utilisé pour accéder directement aux éléments DOM ou stocker des valeurs sans déclencher de re-render.",
    mastery: 'weak'
  },
  {
    id: 12,
    title: "useMemo pour l'optimisation",
    description: "useMemo mémorise le résultat d'un calcul coûteux et ne le recalcule que si ses dépendances changent. Utile pour optimiser les performances en évitant des calculs inutiles.",
    mastery: 'weak'
  },
  {
    id: 13,
    title: "useCallback pour les fonctions",
    description: "useCallback mémorise une fonction et retourne la même instance entre les rendus si les dépendances n'ont pas changé. Essentiel pour optimiser les composants qui reçoivent des callbacks en props.",
    mastery: 'weak'
  },
  {
    id: 14,
    title: "Les composants Higher-Order (HOC)",
    description: "Un HOC est une fonction qui prend un composant et retourne un nouveau composant avec des fonctionnalités supplémentaires. Pattern de réutilisation de logique avant l'arrivée des hooks.",
    mastery: 'weak'
  },
  {
    id: 15,
    title: "Les Render Props",
    description: "Pattern où un composant utilise une prop qui est une fonction retournant des éléments React. Permet de partager du code entre composants de manière flexible.",
    mastery: 'weak'
  },
  {
    id: 16,
    title: "Error Boundaries",
    description: "Les Error Boundaries sont des composants qui capturent les erreurs JavaScript dans leur arbre de composants enfants. Ils permettent d'afficher une UI de fallback et de logger les erreurs.",
    mastery: 'weak'
  },
  {
    id: 17,
    title: "React.lazy et Suspense",
    description: "React.lazy permet le code-splitting en chargeant des composants de manière asynchrone. Suspense affiche un fallback pendant le chargement, améliorant les performances initiales.",
    mastery: 'weak'
  },
  {
    id: 18,
    title: "Les Portals",
    description: "Les Portals permettent de rendre des composants enfants dans un nœud DOM différent de celui du parent. Utile pour les modals, tooltips, et overlays qui doivent sortir du flux normal.",
    mastery: 'weak'
  },
  {
    id: 19,
    title: "Le reconciliation algorithm",
    description: "L'algorithme de réconciliation détermine quelles parties du DOM doivent être mises à jour. React compare le nouveau Virtual DOM avec le précédent et applique les changements minimaux nécessaires.",
    mastery: 'weak'
  },
  {
    id: 20,
    title: "Les fragments",
    description: "Les fragments (<></> ou <Fragment>) permettent de grouper plusieurs éléments sans ajouter de nœud supplémentaire au DOM. Utile pour respecter la contrainte de retour unique d'un composant.",
    mastery: 'weak'
  },
  {
    id: 21,
    title: "StrictMode",
    description: "StrictMode est un outil de développement qui active des vérifications et avertissements supplémentaires. Il aide à identifier les problèmes potentiels comme les effets de bord non intentionnels.",
    mastery: 'weak'
  },
  {
    id: 22,
    title: "Les PropTypes",
    description: "PropTypes est un système de validation des props au runtime. Bien que TypeScript soit préféré aujourd'hui, PropTypes aide à documenter les types attendus et détecter les erreurs.",
    mastery: 'weak'
  },
  {
    id: 23,
    title: "DefaultProps",
    description: "defaultProps permet de définir des valeurs par défaut pour les props. Si une prop n'est pas fournie, la valeur par défaut est utilisée, rendant les composants plus robustes.",
    mastery: 'weak'
  },
  {
    id: 24,
    title: "Les composants contrôlés vs non-contrôlés",
    description: "Un composant contrôlé a son état géré par React. Un composant non-contrôlé gère son propre état via le DOM. Les composants contrôlés offrent plus de contrôle et sont recommandés.",
    mastery: 'weak'
  },
  {
    id: 25,
    title: "Le lifecycle des composants",
    description: "Les composants passent par montage, mise à jour et démontage. Avec les hooks, useEffect remplace componentDidMount, componentDidUpdate, et componentWillUnmount selon ses dépendances.",
    mastery: 'weak'
  },
  {
    id: 26,
    title: "React.memo pour les performances",
    description: "React.memo est un HOC qui mémorise un composant et ne le re-render que si ses props changent. Utile pour optimiser les composants qui reçoivent souvent les mêmes props.",
    mastery: 'weak'
  },
  {
    id: 27,
    title: "Les Custom Hooks",
    description: "Les custom hooks sont des fonctions réutilisables qui utilisent les hooks React. Ils permettent d'extraire et partager de la logique entre composants, suivant la convention use*.",
    mastery: 'weak'
  },
  {
    id: 28,
    title: "useLayoutEffect",
    description: "useLayoutEffect fonctionne comme useEffect mais s'exécute de manière synchrone après les mutations DOM et avant le paint. Utilisé pour des mesures DOM ou des mutations qui doivent être visibles immédiatement.",
    mastery: 'weak'
  },
  {
    id: 29,
    title: "useImperativeHandle",
    description: "useImperativeHandle personnalise la valeur d'instance exposée au parent via ref. Utilisé avec forwardRef pour contrôler quelles méthodes/propriétés sont accessibles depuis le parent.",
    mastery: 'weak'
  },
  {
    id: 30,
    title: "useDebugValue",
    description: "useDebugValue affiche une étiquette dans React DevTools pour les custom hooks. Aide au débogage en rendant l'état interne des hooks personnalisés plus visible.",
    mastery: 'weak'
  },
  {
    id: 31,
    title: "Le batching des mises à jour",
    description: "React groupe plusieurs mises à jour d'état en un seul re-render pour optimiser les performances. Dans React 18+, le batching automatique s'applique même dans les callbacks asynchrones.",
    mastery: 'weak'
  },
  {
    id: 32,
    title: "Les Concurrent Features",
    description: "Les fonctionnalités concurrentes de React 18 permettent d'interrompre le rendu pour garder l'interface responsive. Inclut useTransition, useDeferredValue pour prioriser les mises à jour.",
    mastery: 'weak'
  },
  {
    id: 33,
    title: "Server Components",
    description: "Les Server Components s'exécutent uniquement côté serveur, réduisant le bundle JavaScript client. Ils peuvent accéder directement aux bases de données et aux APIs backend.",
    mastery: 'weak'
  },
  {
    id: 34,
    title: "useTransition",
    description: "useTransition permet de marquer certaines mises à jour comme non urgentes. React peut les interrompre pour garder l'interface responsive, utile pour les listes ou recherches lourdes.",
    mastery: 'weak'
  },
  {
    id: 35,
    title: "useDeferredValue",
    description: "useDeferredValue permet de différer la mise à jour d'une valeur. Utile pour garder l'interface responsive en retardant les mises à jour coûteuses pendant que l'utilisateur tape.",
    mastery: 'weak'
  },
  {
    id: 36,
    title: "useId pour l'accessibilité",
    description: "useId génère des IDs uniques stables entre le serveur et le client. Essentiel pour l'accessibilité des formulaires avec les attributs htmlFor, aria-describedby, etc.",
    mastery: 'weak'
  },
  {
    id: 37,
    title: "useSyncExternalStore",
    description: "useSyncExternalStore permet de s'abonner à des stores externes de manière thread-safe. Utilisé par les bibliothèques d'état comme Redux pour être compatibles avec Concurrent Mode.",
    mastery: 'weak'
  },
  {
    id: 38,
    title: "Les clés de réconciliation",
    description: "Les clés aident React à identifier quels éléments ont changé dans une liste. Elles doivent être stables, prévisibles et uniques parmi les siblings pour optimiser les performances.",
    mastery: 'weak'
  },
  {
    id: 39,
    title: "Le data fetching avec useEffect",
    description: "Utiliser useEffect pour fetcher des données nécessite de gérer le loading, les erreurs, et le cleanup. Il faut aussi gérer les race conditions avec des flags ou AbortController.",
    mastery: 'weak'
  },
  {
    id: 40,
    title: "React Query / TanStack Query",
    description: "React Query simplifie le data fetching, le caching, et la synchronisation. Il gère automatiquement le loading, les erreurs, le refetching, et fournit des hooks comme useQuery et useMutation.",
    mastery: 'weak'
  },
  {
    id: 41,
    title: "Le pattern Container/Presenter",
    description: "Sépare la logique (container) de la présentation (presenter). Les containers gèrent l'état et la logique, les presenters reçoivent des props et s'occupent du rendu, favorisant la testabilité.",
    mastery: 'weak'
  },
  {
    id: 42,
    title: "Les CSS Modules",
    description: "CSS Modules génèrent des noms de classe uniques automatiquement, évitant les conflits. Les styles sont scopés au composant, combinant les avantages du CSS traditionnel et de l'encapsulation.",
    mastery: 'weak'
  },
  {
    id: 43,
    title: "CSS-in-JS avec styled-components",
    description: "styled-components permet d'écrire du CSS dans le JavaScript avec tagged templates. Offre le theming, le scoping automatique, et les styles dynamiques basés sur les props.",
    mastery: 'weak'
  },
  {
    id: 44,
    title: "Tailwind CSS avec React",
    description: "Tailwind est un framework CSS utility-first qui s'intègre bien avec React. Il permet de styler rapidement avec des classes utilitaires, réduisant le CSS personnalisé.",
    mastery: 'weak'
  },
  {
    id: 45,
    title: "Les tests unitaires avec Jest",
    description: "Jest est un framework de test JavaScript. Pour React, on teste les composants en vérifiant leur rendu, leur comportement, et leurs interactions avec des matchers et des mocks.",
    mastery: 'weak'
  },
  {
    id: 46,
    title: "React Testing Library",
    description: "RTL encourage les tests qui ressemblent à l'utilisation réelle. On interroge le DOM comme le ferait un utilisateur (par rôle, label, texte) plutôt que par des détails d'implémentation.",
    mastery: 'weak'
  },
  {
    id: 47,
    title: "Les tests d'intégration",
    description: "Les tests d'intégration vérifient que plusieurs composants fonctionnent ensemble correctement. Ils testent les interactions, les flux de données, et les effets de bord dans un contexte réaliste.",
    mastery: 'weak'
  },
  {
    id: 48,
    title: "Le debugging avec React DevTools",
    description: "React DevTools est une extension navigateur pour inspecter l'arbre de composants, les props, l'état, et les hooks. Il permet aussi de profiler les performances et identifier les re-renders.",
    mastery: 'weak'
  },
  {
    id: 49,
    title: "TypeScript avec React",
    description: "TypeScript ajoute le typage statique à React. On type les props, l'état, les événements, et les refs pour détecter les erreurs à la compilation et améliorer l'autocomplétion.",
    mastery: 'weak'
  },
  {
    id: 50,
    title: "Les types génériques en React",
    description: "Les génériques permettent de créer des composants réutilisables et type-safe. Par exemple, un composant List<T> peut être typé pour différents types d'items tout en gardant la sécurité des types.",
    mastery: 'weak'
  },
  {
    id: 51,
    title: "ESLint pour React",
    description: "ESLint avec les plugins react et react-hooks détecte les erreurs courantes et fait respecter les bonnes pratiques. Les rules des hooks empêchent les bugs liés aux dépendances.",
    mastery: 'weak'
  },
  {
    id: 52,
    title: "Prettier pour le formatage",
    description: "Prettier formate automatiquement le code selon des règles cohérentes. Intégré avec ESLint, il élimine les débats de style et garantit une base de code uniforme.",
    mastery: 'weak'
  },
  {
    id: 53,
    title: "Vite comme bundler",
    description: "Vite est un build tool moderne qui offre un démarrage instantané et un HMR ultra-rapide grâce aux ES modules natifs. Plus rapide que Webpack pour le développement React.",
    mastery: 'weak'
  },
  {
    id: 54,
    title: "Le code-splitting",
    description: "Le code-splitting divise l'application en plusieurs bundles chargés à la demande. Réduit le temps de chargement initial en ne chargeant que le code nécessaire pour la page actuelle.",
    mastery: 'weak'
  },
  {
    id: 55,
    title: "Les routes avec React Router",
    description: "React Router gère la navigation côté client. Il utilise des composants comme BrowserRouter, Routes, Route, et Link pour créer des SPAs avec URLs et navigation fluides.",
    mastery: 'weak'
  },
  {
    id: 56,
    title: "Les routes dynamiques",
    description: "Les routes dynamiques utilisent des paramètres (/:id) pour créer des pages basées sur des données. useParams permet d'accéder aux paramètres de l'URL dans les composants.",
    mastery: 'weak'
  },
  {
    id: 57,
    title: "Les routes protégées",
    description: "Les routes protégées nécessitent une authentification. On crée un composant wrapper qui vérifie l'auth et redirige vers login si nécessaire, protégeant les pages privées.",
    mastery: 'weak'
  },
  {
    id: 58,
    title: "La gestion d'état avec Redux",
    description: "Redux est une bibliothèque de gestion d'état prévisible. Elle utilise un store unique, des actions, et des reducers. Les composants s'y connectent avec useSelector et useDispatch.",
    mastery: 'weak'
  },
  {
    id: 59,
    title: "Redux Toolkit (RTK)",
    description: "RTK simplifie Redux avec des APIs modernes. createSlice combine actions et reducers, configureStore configure le store, et RTK Query gère le data fetching et le caching.",
    mastery: 'weak'
  },
  {
    id: 60,
    title: "Zustand pour l'état global",
    description: "Zustand est une alternative légère à Redux. Il utilise des hooks et un store simple sans boilerplate. Idéal pour les apps petites à moyennes nécessitant un état global minimal.",
    mastery: 'weak'
  },
  {
    id: 61,
    title: "L'optimisation des images",
    description: "Optimiser les images inclut lazy loading, formats modernes (WebP, AVIF), responsive images avec srcset, et compression. Les bibliothèques comme react-lazy-load-image-component aident.",
    mastery: 'weak'
  },
  {
    id: 62,
    title: "Le SEO avec React",
    description: "Le SEO en React nécessite le SSR ou SSG pour que les crawlers voient le contenu. On gère aussi les meta tags avec react-helmet, les URLs propres, et le sitemap.",
    mastery: 'weak'
  },
  {
    id: 63,
    title: "L'accessibilité (a11y)",
    description: "L'accessibilité rend les apps utilisables par tous. On utilise les attributs ARIA, les rôles sémantiques, la navigation au clavier, et les alternatives textuelles pour les images.",
    mastery: 'weak'
  },
  {
    id: 64,
    title: "Les animations avec Framer Motion",
    description: "Framer Motion est une bibliothèque d'animation pour React. Elle offre des APIs déclaratives pour les animations, transitions, gestures, et variants avec une performance optimale.",
    mastery: 'weak'
  },
  {
    id: 65,
    title: "La gestion des formulaires avec React Hook Form",
    description: "React Hook Form optimise les performances des formulaires en minimisant les re-renders. Il offre une validation, gestion d'erreurs, et intégration avec Yup ou Zod pour la validation de schéma.",
    mastery: 'weak'
  },
  {
    id: 66,
    title: "La validation avec Zod",
    description: "Zod est une bibliothèque de validation de schéma TypeScript-first. Elle permet de définir des schémas type-safe et de valider les données avec d'excellents messages d'erreur.",
    mastery: 'weak'
  },
  {
    id: 67,
    title: "Les Web APIs dans React",
    description: "React peut utiliser les Web APIs modernes : localStorage, sessionStorage, Geolocation, Intersection Observer, etc. useEffect est souvent nécessaire pour s'abonner aux événements.",
    mastery: 'weak'
  },
  {
    id: 68,
    title: "Le pattern de Compound Components",
    description: "Les Compound Components partagent un état implicite entre parent et enfants. Utilisé pour créer des APIs flexibles comme <Tabs><TabList><Tab>, où les enfants accèdent au contexte du parent.",
    mastery: 'weak'
  },
  {
    id: 69,
    title: "Les Progressive Web Apps (PWA)",
    description: "Les PWAs sont des web apps qui fonctionnent offline et peuvent être installées. Elles utilisent Service Workers, manifests, et stratégies de cache pour une expérience app-like.",
    mastery: 'weak'
  },
  {
    id: 70,
    title: "Le déploiement de React apps",
    description: "Le déploiement implique le build de production (optimisé et minifié), l'hébergement sur des plateformes comme Vercel, Netlify, ou AWS, et la configuration des variables d'environnement.",
    mastery: 'weak'
  }
]
