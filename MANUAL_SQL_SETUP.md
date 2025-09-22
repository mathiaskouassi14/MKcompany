# 🗄️ Configuration manuelle Supabase pour MK COMPANY

## 📋 Instructions

1. **Allez dans votre dashboard Supabase**
2. **Cliquez sur "SQL Editor"**
3. **Exécutez les requêtes suivantes dans l'ordre**

---

## 1️⃣ CRÉATION DES TABLES

```sql
-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super_admin')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des demandes de création LLC
CREATE TABLE IF NOT EXISTS llc_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('starter', 'professional', 'premium')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'documents_required', 'under_review', 'approved', 'completed', 'rejected')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  state text DEFAULT 'delaware',
  business_type text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  llc_application_id uuid REFERENCES llc_applications(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  category text NOT NULL CHECK (category IN ('identity', 'business', 'legal', 'financial')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  file_url text,
  admin_notes text,
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  llc_application_id uuid REFERENCES llc_applications(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Table des actions administrateur
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
```

---

## 2️⃣ ACTIVATION RLS ET POLITIQUES

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE llc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour llc_applications
CREATE POLICY "Users can view own applications" ON llc_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON llc_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON llc_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour documents
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour admin_actions
CREATE POLICY "Admins can view admin actions" ON admin_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can create admin actions" ON admin_actions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
```

---

## 3️⃣ FONCTIONS UTILITAIRES

```sql
-- Fonction pour promouvoir un utilisateur en admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Utilisateur avec email % non trouvé', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_users', (SELECT COUNT(*) FROM profiles WHERE status = 'active'),
    'new_users_today', (SELECT COUNT(*) FROM profiles WHERE created_at::date = CURRENT_DATE),
    'total_applications', (SELECT COUNT(*) FROM llc_applications),
    'pending_applications', (SELECT COUNT(*) FROM llc_applications WHERE status IN ('pending', 'in_progress')),
    'completed_applications', (SELECT COUNT(*) FROM llc_applications WHERE status = 'completed'),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'),
    'pending_documents', (SELECT COUNT(*) FROM documents WHERE status = 'pending')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4️⃣ PROMOUVOIR VOTRE EMAIL EN ADMIN

```sql
-- Promouvoir monpaypal68@gmail.com en admin
-- ATTENTION: Exécutez ceci APRÈS avoir créé votre compte via l'interface
DO $$
BEGIN
  -- Vérifier si le profil existe, sinon le créer
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'monpaypal68@gmail.com') THEN
    -- Si l'utilisateur n'existe pas encore, cette requête échouera
    -- Vous devez d'abord créer votre compte via /auth
    RAISE NOTICE 'Utilisateur non trouvé. Créez d''abord votre compte via l''interface.';
  ELSE
    -- Promouvoir en admin
    UPDATE profiles 
    SET role = 'admin', updated_at = now()
    WHERE email = 'monpaypal68@gmail.com';
    RAISE NOTICE 'Utilisateur promu en admin avec succès!';
  END IF;
END $$;
```

---

## 5️⃣ DONNÉES DE TEST (OPTIONNEL)

```sql
-- Insérer des données de test UNIQUEMENT si vous voulez des exemples
-- ATTENTION: Ces UUIDs sont fictifs, adaptez selon vos besoins

-- Clients de test (vous devez d'abord créer ces comptes via l'interface)
-- INSERT INTO profiles (id, email, full_name, role, status) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'client1@test.com', 'Jean Dupont', 'user', 'active'),
-- ('22222222-2222-2222-2222-222222222222', 'client2@test.com', 'Marie Martin', 'user', 'active');

-- Applications LLC de test
-- INSERT INTO llc_applications (user_id, company_name, plan, status, progress) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'Tech Solutions LLC', 'professional', 'in_progress', 75),
-- ('22222222-2222-2222-2222-222222222222', 'Marketing Pro LLC', 'premium', 'completed', 100);
```

---

## 📋 ÉTAPES À SUIVRE

### 1. **Exécuter le SQL**
- Copiez et exécutez chaque section dans l'ordre dans l'éditeur SQL Supabase

### 2. **Créer votre compte**
- Allez sur `/auth` dans votre application
- Inscrivez-vous avec `monpaypal68@gmail.com`

### 3. **Vous promouvoir en admin**
- Retournez dans l'éditeur SQL Supabase
- Exécutez la section 4️⃣ pour vous promouvoir en admin

### 4. **Vérifier**
- Reconnectez-vous à votre application
- Vous devriez voir le lien "Admin" dans la navbar
- Accédez à `/admin` pour tester

---

## ✅ VÉRIFICATION

Après avoir tout exécuté, vous devriez avoir :
- ✅ 6 tables créées avec RLS
- ✅ Toutes les politiques de sécurité
- ✅ Fonctions utilitaires
- ✅ Votre compte admin configuré

🚀 **Votre système admin sera alors pleinement opérationnel !**