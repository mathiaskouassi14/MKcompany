/*
  # Créer un utilisateur administrateur par défaut

  1. Fonction pour promouvoir un utilisateur en admin
  2. Instructions pour créer un admin
  
  Note: Vous devez d'abord créer un compte via l'interface, puis exécuter cette fonction
*/

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

-- Exemple d'utilisation (décommentez et remplacez par votre email) :
-- SELECT promote_user_to_admin('votre-email@example.com');