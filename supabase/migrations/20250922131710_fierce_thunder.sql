/*
  # Schéma complet MK COMPANY - Gestion LLC

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `llc_applications` - Demandes de création LLC
    - `documents` - Documents clients
    - `payments` - Paiements et factures
    - `notifications` - Notifications système
    - `admin_actions` - Actions administrateur

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour utilisateurs et admins
    - Fonctions de gestion admin

  3. Temps réel
    - Réplication activée pour toutes les tables
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super_admin')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des demandes LLC
CREATE TABLE IF NOT EXISTS llc_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  business_type text,
  state text DEFAULT 'Delaware',
  plan text NOT NULL CHECK (plan IN ('starter', 'professional', 'premium')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'documents_required', 'submitted', 'approved', 'completed', 'rejected')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  ein text,
  formation_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  llc_application_id uuid REFERENCES llc_applications(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  category text CHECK (category IN ('identity', 'articles', 'ein', 'operating_agreement', 'bank_docs', 'other')),
  file_url text,
  file_size bigint,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  admin_notes text,
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  llc_application_id uuid REFERENCES llc_applications(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_id text,
  paypal_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Table des actions admin
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  target_user_id uuid REFERENCES profiles(id),
  action_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_llc_applications_updated_at BEFORE UPDATE ON llc_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE llc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs normaux
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own LLC applications" ON llc_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create LLC applications" ON llc_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own LLC applications" ON llc_applications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les administrateurs
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can manage all LLC applications" ON llc_applications FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can manage all documents" ON documents FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can view admin actions" ON admin_actions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can create admin actions" ON admin_actions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Fonction pour promouvoir un utilisateur en admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
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
    'pending_applications', (SELECT COUNT(*) FROM llc_applications WHERE status = 'pending'),
    'completed_applications', (SELECT COUNT(*) FROM llc_applications WHERE status = 'completed'),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'),
    'pending_documents', (SELECT COUNT(*) FROM documents WHERE status = 'pending')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insérer des données de test
INSERT INTO profiles (id, email, full_name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'monpaypal68@gmail.com', 'Admin Principal', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'client1@example.com', 'Ahmed Benali', 'user'),
  ('550e8400-e29b-41d4-a716-446655440003', 'client2@example.com', 'Sarah Martin', 'user'),
  ('550e8400-e29b-41d4-a716-446655440004', 'client3@example.com', 'Marc Dubois', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insérer des demandes LLC de test
INSERT INTO llc_applications (id, user_id, company_name, plan, status, progress) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Benali E-commerce LLC', 'professional', 'in_progress', 75),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Martin Consulting LLC', 'premium', 'completed', 100),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Dubois Tech LLC', 'starter', 'pending', 25)
ON CONFLICT (id) DO NOTHING;

-- Insérer des documents de test
INSERT INTO documents (user_id, llc_application_id, name, type, category, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Pièce d\'identité', 'PDF', 'identity', 'approved'),
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Articles of Organization', 'PDF', 'articles', 'pending'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'EIN Confirmation', 'PDF', 'ein', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Insérer des paiements de test
INSERT INTO payments (user_id, llc_application_id, amount, description, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 1800.00, 'Plan Professional - Création LLC', 'completed'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 2500.00, 'Plan Premium - Création LLC', 'completed'),
  ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 1200.00, 'Plan Starter - Création LLC', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insérer des notifications de test
INSERT INTO notifications (user_id, title, message, type) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'Document approuvé', 'Votre pièce d\'identité a été validée', 'success'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Action requise', 'Veuillez fournir des documents supplémentaires', 'warning'),
  ('550e8400-e29b-41d4-a716-446655440003', 'LLC créée', 'Votre LLC a été créée avec succès !', 'success')
ON CONFLICT (id) DO NOTHING;