/*
  # Système d'inscription multi-étapes pour clients LLC

  1. Nouvelles Tables
    - `client_registrations` - Informations complètes d'inscription
    - `client_documents` - Documents uploadés par les clients
    - `us_states` - Liste des états américains disponibles

  2. Sécurité
    - Enable RLS sur toutes les nouvelles tables
    - Politiques pour clients et admins
    - Stockage sécurisé des documents

  3. Fonctionnalités
    - Inscription en 3 étapes
    - Upload de documents
    - Validation des données
    - Dashboard admin complet
*/

-- Table des états américains disponibles
CREATE TABLE IF NOT EXISTS us_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insérer les états par défaut
INSERT INTO us_states (name, code) VALUES
('New Mexico', 'NM'),
('Delaware', 'DE'),
('Wyoming', 'WY'),
('Nevada', 'NV'),
('Florida', 'FL')
ON CONFLICT (name) DO NOTHING;

-- Table principale des inscriptions clients
CREATE TABLE IF NOT EXISTS client_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Étape 1: Informations personnelles
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  
  -- Étape 2: Informations société
  company_name text NOT NULL,
  number_of_partners integer NOT NULL CHECK (number_of_partners >= 1),
  state_id uuid REFERENCES us_states(id),
  business_type text NOT NULL,
  business_description text,
  
  -- Statut et métadonnées
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_documents', 'pending_review', 'approved', 'rejected')),
  current_step integer DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 4),
  completed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents clients
CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES client_registrations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations du document
  document_type text NOT NULL CHECK (document_type IN ('passport', 'identity_card', 'other')),
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  
  -- Statut de validation
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  
  -- Timestamps
  uploaded_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE us_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Politiques pour us_states (lecture publique)
CREATE POLICY "Anyone can view active states" ON us_states FOR SELECT USING (is_active = true);

-- Politiques pour client_registrations
CREATE POLICY "Users can view own registration" ON client_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registration" ON client_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registration" ON client_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all registrations" ON client_registrations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Politiques pour client_documents
CREATE POLICY "Users can view own documents" ON client_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload own documents" ON client_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all documents" ON client_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour client_registrations
CREATE OR REPLACE TRIGGER update_client_registrations_updated_at
  BEFORE UPDATE ON client_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour obtenir les statistiques d'inscription
CREATE OR REPLACE FUNCTION get_registration_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_registrations', (SELECT COUNT(*) FROM client_registrations),
    'pending_registrations', (SELECT COUNT(*) FROM client_registrations WHERE status IN ('draft', 'pending_documents', 'pending_review')),
    'approved_registrations', (SELECT COUNT(*) FROM client_registrations WHERE status = 'approved'),
    'pending_documents', (SELECT COUNT(*) FROM client_documents WHERE status = 'pending'),
    'registrations_today', (SELECT COUNT(*) FROM client_registrations WHERE created_at::date = CURRENT_DATE)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;