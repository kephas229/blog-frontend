# BlogFlow — Frontend

Interface web de la plateforme de blog **BlogFlow**, construite avec React 19, TypeScript et Tailwind CSS v4. Connectée à l'API backend Laravel via des tokens Bearer (Sanctum).

- **URL de production** : *à définir après déploiement Vercel*
- **API backend** : `https://blog-api-service-fbnq.onrender.com`
- **Dépôt API** : [kephas229/Blog-api](https://github.com/kephas229/Blog-api)

---

## Sommaire

- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Routes et pages](#routes-et-pages)
- [Architecture](#architecture)
  - [Authentification](#authentification)
  - [Services API](#services-api)
  - [Types TypeScript](#types-typescript)
- [Composants UI](#composants-ui)
- [Déploiement sur Vercel](#déploiement-sur-vercel)

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| React | 19 | Bibliothèque UI |
| TypeScript | 5.8 | Typage statique |
| Vite | 6 | Bundler et serveur de dev |
| Tailwind CSS | 4 | Styles utilitaires (config CSS-native) |
| React Router DOM | 7 | Routing côté client |
| Axios | 1.18 | Client HTTP |
| React Hook Form | 7 | Gestion des formulaires |
| Motion (Framer) | 12 | Animations |
| Recharts | 3 | Graphiques (analytics) |
| Lucide React | 0.546 | Icônes |

---

## Structure du projet

```
blog-frontend/
├── public/
├── src/
│   ├── App.tsx                    # Racine : AuthProvider + BrowserRouter
│   ├── main.tsx                   # Point d'entrée
│   ├── index.css                  # Tailwind v4 + tokens Material Design 3
│   ├── vite-env.d.ts
│   │
│   ├── routes/
│   │   └── index.tsx              # Toutes les routes de l'application
│   │
│   ├── layouts/
│   │   ├── PublicLayout.tsx       # Navbar + Footer sombre
│   │   ├── AdminLayout.tsx        # Sidebar + Top bar (protégé)
│   │   └── AuthLayout.tsx         # Split-screen fond image / formulaire
│   │
│   ├── context/
│   │   └── AuthContext.tsx        # État auth global (user, token, login, logout)
│   │
│   ├── services/
│   │   └── api.ts                 # Instance Axios + services typés
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.tsx           # Accueil : articles paginés + filtres catégories
│   │   │   ├── ArticleDetail.tsx  # Détail article + commentaires
│   │   │   ├── SearchResults.tsx  # Recherche en temps réel (debounce 350ms)
│   │   │   ├── NotFound.tsx       # Page 404
│   │   │   └── ComingSoon.tsx     # Page placeholder
│   │   ├── auth/
│   │   │   ├── Login.tsx          # Connexion (POST /api/login)
│   │   │   └── Register.tsx       # Inscription (POST /api/register)
│   │   └── admin/
│   │       ├── Dashboard.tsx      # Stats + derniers articles
│   │       ├── Articles.tsx       # Liste paginée + recherche + suppression
│   │       ├── CreateArticle.tsx  # Formulaire création avec éditeur markdown
│   │       ├── Comments.tsx       # Modération des commentaires
│   │       ├── Analytics.tsx      # Métriques de trafic
│   │       ├── Media.tsx          # Bibliothèque multimédia (Cloudinary)
│   │       └── Settings.tsx       # Paramètres du compte
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Barre de navigation publique + recherche live
│   │   │   └── Sidebar.tsx        # Navigation admin (fond sombre)
│   │   └── ui/
│   │       ├── Button.tsx         # Bouton avec variantes et état de chargement
│   │       ├── Card.tsx           # Card / CardHeader / CardContent / CardTitle
│   │       └── Input.tsx          # Input avec icône, label et message d'erreur
│   │
│   ├── data/
│   │   └── mockArticles.ts        # Données mockées (non utilisées en production)
│   └── lib/
│       └── utils.ts               # Utilitaire cn() (classnames)
│
├── .env                           # Variables locales (gitignored)
├── .env.example                   # Template des variables d'environnement
├── vercel.json                    # Config déploiement Vercel (rewrites SPA)
├── vite.config.ts                 # Config Vite + Tailwind + alias
├── tsconfig.json                  # Config TypeScript
└── package.json
```

---

## Installation locale

**Prérequis** : Node.js 20+ et npm

```bash
# 1. Cloner le dépôt
git clone https://github.com/kephas229/blog-frontend.git
cd blog-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditez .env si vous utilisez une API locale

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

**Autres commandes**

```bash
npm run build    # Build de production dans dist/
npm run preview  # Prévisualiser le build local
npm run lint     # Vérification TypeScript (tsc --noEmit)
```

---

## Variables d'environnement

| Variable | Requis | Description | Valeur par défaut |
|---|---|---|---|
| `VITE_API_URL` | Non | URL de l'API backend | `https://blog-api-service-fbnq.onrender.com/api` |

> **Important** : Toute variable exposée au navigateur doit commencer par `VITE_`. Ne jamais y mettre de secrets.

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=https://blog-api-service-fbnq.onrender.com/api
```

Pour le développement local avec l'API en local :

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Routes et pages

### Routes publiques — `PublicLayout`

| URL | Composant | Description |
|---|---|---|
| `/` | `Home` | Accueil avec articles paginés, filtres par catégorie, article vedette |
| `/search?q=...` | `SearchResults` | Résultats de recherche en temps réel (debounce 350ms) |
| `/article/:id` | `ArticleDetail` | Détail d'un article avec commentaires |
| `*` | `NotFound` | Page 404 |

### Routes d'authentification — `AuthLayout`

| URL | Composant | Description |
|---|---|---|
| `/login` | `Login` | Connexion — redirige vers `/admin/dashboard` |
| `/register` | `Register` | Inscription — redirige vers `/admin/dashboard` |

### Routes admin — `AdminLayout` (protégé)

Toutes ces routes nécessitent d'être authentifié. Une redirection automatique vers `/login` se produit si le token est absent ou expiré.

| URL | Composant | Description |
|---|---|---|
| `/admin` | `Dashboard` | Tableau de bord (stats + derniers articles) |
| `/admin/dashboard` | `Dashboard` | Idem |
| `/admin/articles` | `Articles` | Liste paginée avec recherche et suppression |
| `/admin/articles/create` | `CreateArticle` | Formulaire de création d'article |
| `/admin/comments` | `Comments` | Modération des commentaires |
| `/admin/analytics` | `Analytics` | Métriques de trafic |
| `/admin/media` | `Media` | Bibliothèque multimédia |
| `/admin/settings` | `Settings` | Paramètres du compte |

---

## Architecture

### Authentification

L'authentification est gérée par `AuthContext` (`src/context/AuthContext.tsx`).

**Persistance** : le token Bearer et les données utilisateur sont stockés dans `localStorage`.

```typescript
// Utilisation dans n'importe quel composant
const { user, isAuthenticated, login, logout, isLoading } = useAuth();
```

**Flux de connexion :**
1. `Login.tsx` appelle `login(email, password)`
2. `AuthContext` appelle `authService.login()` → `POST /api/login`
3. La réponse contient `{ access_token, user }` — stockés dans `localStorage`
4. Redirection vers `/admin/dashboard`

**Protection des routes admin :**
`AdminLayout` vérifie `isAuthenticated`. Si `false`, redirige vers `/login` via `<Navigate>`.

**Déconnexion automatique (401) :**
L'intercepteur Axios détecte les erreurs 401 (token expiré) et redirige automatiquement vers `/login` en nettoyant le `localStorage`.

---

### Services API

Tous les appels HTTP sont centralisés dans `src/services/api.ts`.

**Instance Axios**

```typescript
import { api } from '../services/api';

// L'instance injecte automatiquement le token Bearer si présent
```

**Services disponibles**

#### `articleService`

```typescript
// Lister les articles (paginés)
articleService.getAll(page?: number, search?: string)
// → Promise<AxiosResponse<PaginatedResponse<Article>>>

// Détail d'un article (avec category, user, comments)
articleService.getOne(id: number | string)
// → Promise<AxiosResponse<Article>>

// Créer un article (multipart/form-data pour l'image)
articleService.create(formData: FormData)
// → Promise<AxiosResponse<{ message: string; article: Article }>>

// Modifier un article (POST + _method=PUT pour le multipart)
articleService.update(id: number, formData: FormData)
// → Promise<AxiosResponse<{ message: string; article: Article }>>

// Supprimer un article
articleService.delete(id: number)
// → Promise<AxiosResponse<{ message: string }>>
```

#### `commentService`

```typescript
// Poster un commentaire (authentifié)
commentService.create({ visitor_name, visitor_email, message, article_id })
// → Promise<AxiosResponse<{ message: string; comment: Comment }>>

// Supprimer un commentaire (authentifié + propriétaire)
commentService.delete(id: number)
// → Promise<AxiosResponse<{ message: string }>>
```

#### `authService`

```typescript
// Connexion
authService.login(email: string, password: string)
// → Promise<AxiosResponse<{ message, user, access_token, token_type }>>

// Inscription
authService.register(name, email, password, password_confirmation)
// → Promise<AxiosResponse<{ message, user, access_token, token_type }>>

// Déconnexion (révoque le token côté serveur)
authService.logout()
// → Promise<AxiosResponse<{ message: string }>>
```

#### `dashboardService`

```typescript
// Statistiques globales + derniers articles
dashboardService.getStats()
// → Promise<AxiosResponse<DashboardStats>>
```

---

### Types TypeScript

Définis dans `src/services/api.ts` :

```typescript
interface Article {
  id: number;
  title: string;
  short_description: string;
  content: string;
  image: string | null;        // URL Cloudinary ou Unsplash
  user_id: number;
  category_id: number | null;
  created_at: string;          // ISO 8601
  updated_at: string;
  category?: { id: number; name: string } | null;
  user?: { id: number; name: string } | null;
  comments?: Comment[];
}

interface Comment {
  id: number;
  visitor_name: string;
  visitor_email: string;
  message: string;
  article_id: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;            // 10 par défaut
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface DashboardStats {
  stats: {
    total_articles: number;
    total_users: number;
    total_comments: number;
  };
  latest_articles: Article[];
}
```

---

## Composants UI

### `Button`

```tsx
import { Button } from '../components/ui/Button';

<Button variant="primary" size="md" isLoading={false}>
  Texte
</Button>
```

| Prop | Type | Valeurs | Défaut |
|---|---|---|---|
| `variant` | string | `primary` `secondary` `outline` `ghost` `danger` | `primary` |
| `size` | string | `sm` `md` `lg` | `md` |
| `isLoading` | boolean | — | `false` |

### `Input`

```tsx
import { Input } from '../components/ui/Input';
import { Mail } from 'lucide-react';

<Input
  label="Adresse Email"
  icon={<Mail className="w-5 h-5" />}
  type="email"
  placeholder="nom@exemple.fr"
  error="Email invalide"
/>
```

| Prop | Type | Description |
|---|---|---|
| `label` | string | Texte affiché au-dessus |
| `icon` | ReactNode | Icône dans le champ (gauche) |
| `error` | string | Message d'erreur (rouge) |

### `Card`

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```

---

## Déploiement sur Vercel

### Prérequis

- Compte Vercel et CLI optionnel
- Repo GitHub `kephas229/blog-frontend`

### Étapes

1. Aller sur [vercel.com](https://vercel.com) → **New Project**
2. Importer le dépôt `kephas229/blog-frontend`
3. Framework détecté automatiquement : **Vite**
4. **Environment Variables** → ajouter :

| Clé | Valeur |
|---|---|
| `VITE_API_URL` | `https://blog-api-service-fbnq.onrender.com/api` |

5. Cliquer sur **Deploy**

Le fichier `vercel.json` est déjà configuré pour :
- Rediriger toutes les URLs vers `index.html` (SPA routing)
- Mettre en cache immutable les assets buildés
- Appliquer les headers de sécurité (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

### Redéploiement automatique

Chaque push sur la branche `main` déclenche automatiquement un redéploiement sur Vercel.

---

## Comptes de test

Ces comptes sont disponibles sur l'API de production.

| Nom | Email | Mot de passe |
|---|---|---|
| Sophie Marchand | `admin@blogflow.fr` | `Admin@2024!` |
| Thomas Leroy | `thomas.leroy@blogflow.fr` | `Thomas@2024!` |
| Camille Dubois | `camille.dubois@blogflow.fr` | `Camille@2024!` |
| Lucas Martin | `lucas.martin@blogflow.fr` | `Lucas@2024!` |
| Elodie Bernard | `elodie.bernard@blogflow.fr` | `Elodie@2024!` |
