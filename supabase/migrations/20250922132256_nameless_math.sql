/*
  # Schéma complet MK COMPANY - Gestion LLC

  1. Tables principales
    - profiles - Profils utilisateurs étendus
    - llc_applications - Demandes de création LLC
    - documents - Documents clients
    - payments - Paiements et factures
    - notifications - Notifications système
    - admin_actions - Actions administrateur

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
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des demandes de création LLC
CREATE TABLE IF NOT EXISTS llc_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('starter', 'professional', 'premium')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  state text DEFAULT 'delaware',
  business_type text,
  description text,
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
  category text NOT NULL CHECK (category IN ('identity', 'llc', 'banking', 'other')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  file_url text,
  file_size integer,
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
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_id text,
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
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Table des actions administrateur
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE llc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Politiques pour llc_applications
CREATE POLICY "Users can view own applications" ON llc_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON llc_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON llc_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON llc_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Politiques pour documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Politiques pour payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Politiques pour notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Politiques pour admin_actions
CREATE POLICY "Admins can view admin actions" ON admin_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can create admin actions" ON admin_actions
  FOR INSERT WITH CHECK (
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
  SET role = 'admin', updated_at = now()
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

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_llc_applications_updated_at BEFORE UPDATE ON llc_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer la réplication temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE llc_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;

-- Insérer des données de test
INSERT INTO profiles (id, email, full_name, role, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'monpaypal68@gmail.com', 'Admin Principal', 'admin', 'active'),
  ('550e8400-e29b-41d4-a716-446655440001', 'client1@example.com', 'Ahmed Benali', 'user', 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'client2@example.com', 'Sarah Martin', 'user', 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'client3@example.com', 'Marc Dubois', 'user', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insérer des demandes LLC de test
INSERT INTO llc_applications (id, user_id, company_name, plan, status, progress) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Benali E-commerce LLC', 'professional', 'in_progress', 75),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Martin Consulting LLC', 'premium', 'completed', 100),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Dubois Tech LLC', 'starter', 'pending', 25)
ON CONFLICT (id) DO NOTHING;

-- Insérer des documents de test
INSERT INTO documents (id, user_id, llc_application_id, name, type, category, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Piece identite', 'PDF', 'identity', 'approved'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Articles of Organization', 'PDF', 'llc', 'pending'),
  ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'EIN Confirmation', 'PDF', 'llc', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Insérer des paiements de test
INSERT INTO payments (id, user_id, llc_application_id, amount, description, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1800.00, 'Plan Professional - Création LLC', 'completed'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 2500.00, 'Plan Premium - Création LLC', 'completed'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 1200.00, 'Plan Starter - Création LLC', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insérer des notifications de test
INSERT INTO notifications (id, user_id, title, message, type, read) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Document approuve', 'Votre piece identite a ete approuvee', 'success', false),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Action requise', 'Veuillez fournir un justificatif adresse', 'warning', false),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'LLC finalisee', 'Votre LLC a ete creee avec succes', 'success', true)
ON CONFLICT (id) DO NOTHING;