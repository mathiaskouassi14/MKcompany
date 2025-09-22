# Documentation Frontend - Application Supabase

## Vue d'ensemble

Cette application utilise React avec TypeScript, Vite comme bundler, et Supabase comme backend. Elle comprend un système d'authentification et des interfaces utilisateur et administrateur distinctes.

## Architecture du Projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages principales de l'application
├── hooks/              # Hooks personnalisés
├── utils/              # Utilitaires et helpers
├── types/              # Définitions TypeScript
└── lib/                # Configuration des services externes
```

## Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Supabase** pour l'authentification et la base de données
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation

## Installation et Configuration

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Installation
```bash
npm install
```

### Variables d'environnement
Créer un fichier `.env` avec :
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Démarrage
```bash
npm run dev
```

## Pages Principales

### 1. Page Utilisateur (User Dashboard)

#### Fonctionnalités
- **Authentification** : Connexion/Inscription via email/mot de passe
- **Profil utilisateur** : Gestion des informations personnelles
- **Dashboard personnalisé** : Interface adaptée aux besoins utilisateur
- **Gestion des données** : CRUD sur les ressources utilisateur

#### Composants Clés

##### AuthForm Component
```typescript
interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}
```
- Gère l'authentification utilisateur
- Validation des formulaires
- Gestion des erreurs
- Redirection après connexion

##### UserProfile Component
```typescript
interface UserProfileProps {
  user: User;
  onUpdate: (data: UserUpdateData) => void;
}
```
- Affichage et modification du profil
- Upload d'avatar
- Mise à jour des informations

##### UserDashboard Component
- Vue d'ensemble des données utilisateur
- Navigation vers les différentes sections
- Statistiques personnalisées

#### Routes Utilisateur
```typescript
// Routes protégées pour les utilisateurs authentifiés
/dashboard          // Dashboard principal
/profile           // Gestion du profil
/settings          // Paramètres utilisateur
/data              // Gestion des données
```

#### Hooks Personnalisés

##### useAuth
```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Méthodes d'authentification
  const signIn = async (email: string, password: string) => { ... };
  const signUp = async (email: string, password: string) => { ... };
  const signOut = async () => { ... };
  
  return { user, loading, signIn, signUp, signOut };
};
```

##### useUserData
```typescript
const useUserData = () => {
  // Gestion des données utilisateur
  // CRUD operations
  // Cache et synchronisation
};
```

#### Sécurité
- **Row Level Security (RLS)** activé sur toutes les tables
- **Politiques Supabase** pour l'accès aux données
- **Validation côté client et serveur**
- **Protection des routes** via middleware d'authentification

### 2. Page Admin (Admin Dashboard)

#### Fonctionnalités
- **Gestion des utilisateurs** : CRUD complet sur les comptes
- **Modération du contenu** : Validation et suppression
- **Statistiques globales** : Analytics et métriques
- **Configuration système** : Paramètres de l'application
- **Logs et monitoring** : Suivi des activités

#### Composants Clés

##### AdminLayout Component
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}
```
- Layout principal de l'interface admin
- Navigation latérale
- Header avec actions rapides
- Breadcrumb navigation

##### UserManagement Component
```typescript
interface UserManagementProps {
  users: User[];
  onUserUpdate: (userId: string, data: UserUpdateData) => void;
  onUserDelete: (userId: string) => void;
}
```
- Table des utilisateurs avec pagination
- Filtres et recherche
- Actions en lot
- Modals de confirmation

##### AdminStats Component
- Graphiques et métriques
- KPIs en temps réel
- Exports de données
- Alertes système

##### ContentModeration Component
- Queue de modération
- Outils de validation
- Historique des actions
- Règles automatiques

#### Routes Admin
```typescript
// Routes protégées pour les administrateurs
/admin                    // Dashboard admin
/admin/users             // Gestion utilisateurs
/admin/content           // Modération contenu
/admin/analytics         // Statistiques
/admin/settings          // Configuration
/admin/logs              // Logs système
```

#### Permissions et Rôles

##### Système de Rôles
```typescript
enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

##### Middleware de Protection
```typescript
const requireAdmin = (component: React.ComponentType) => {
  return (props: any) => {
    const { user } = useAuth();
    
    if (!user || user.role !== 'admin') {
      return <Navigate to="/unauthorized" />;
    }
    
    return <Component {...props} />;
  };
};
```

#### Hooks Admin

##### useAdminData
```typescript
const useAdminData = () => {
  // Gestion des données administratives
  // Statistiques globales
  // Opérations privilégiées
};
```

##### useUserManagement
```typescript
const useUserManagement = () => {
  // CRUD utilisateurs
  // Gestion des rôles
  // Actions en lot
};
```

## Base de Données Supabase

### Tables Principales

#### users (via auth.users)
```sql
-- Profil utilisateur étendu
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### user_data
```sql
-- Données spécifiques utilisateur
CREATE TABLE user_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  data jsonb,
  created_at timestamptz DEFAULT now()
);
```

### Politiques RLS

#### Utilisateurs
```sql
-- Les utilisateurs ne peuvent voir que leurs propres données
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

#### Administrateurs
```sql
-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
```

## Gestion des États

### Context Providers

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

#### AdminContext
```typescript
interface AdminContextType {
  users: User[];
  stats: AdminStats;
  refreshData: () => Promise<void>;
  updateUser: (userId: string, data: UserUpdateData) => Promise<void>;
}
```

## Styling et UI

### Design System
- **Couleurs** : Palette cohérente avec variables CSS
- **Typography** : Hiérarchie claire avec Tailwind
- **Composants** : Bibliothèque de composants réutilisables
- **Responsive** : Mobile-first approach

### Composants UI Réutilisables
- Button variants
- Form components
- Modal system
- Toast notifications
- Loading states
- Error boundaries

## Performance et Optimisation

### Stratégies Implémentées
- **Code splitting** par route
- **Lazy loading** des composants
- **Memoization** des calculs coûteux
- **Pagination** des listes longues
- **Cache** des requêtes fréquentes

### Monitoring
- Error tracking
- Performance metrics
- User analytics
- Real-time monitoring

## Tests

### Structure des Tests
```
src/
├── __tests__/          # Tests unitaires
├── components/
│   └── __tests__/      # Tests de composants
└── pages/
    └── __tests__/      # Tests d'intégration
```

### Types de Tests
- **Unit tests** : Composants isolés
- **Integration tests** : Flux utilisateur
- **E2E tests** : Parcours complets

## Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement Production
- Configuration Supabase production
- URLs et clés API
- Paramètres de sécurité

### CI/CD
- Tests automatiques
- Build et déploiement
- Monitoring post-déploiement

## Maintenance et Évolution

### Bonnes Pratiques
- Code review obligatoire
- Documentation à jour
- Tests avant merge
- Monitoring continu

### Roadmap
- Nouvelles fonctionnalités
- Améliorations UX
- Optimisations performance
- Sécurité renforcée