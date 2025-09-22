/*
  # Promouvoir monpaypal68@gmail.com en administrateur

  1. Mise à jour du rôle
    - Change le rôle de l'utilisateur monpaypal68@gmail.com en 'admin'
    - Met à jour la date de modification
  
  2. Sécurité
    - Vérifie que l'utilisateur existe avant la mise à jour
    - Log de l'opération pour traçabilité
*/

-- Promouvoir l'utilisateur spécifique en admin
UPDATE profiles 
SET 
  role = 'admin',
  updated_at = now()
WHERE email = 'monpaypal68@gmail.com';

-- Vérifier que la mise à jour a fonctionné
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE email = 'monpaypal68@gmail.com' 
    AND role = 'admin'
  ) THEN
    RAISE NOTICE 'Utilisateur monpaypal68@gmail.com promu en administrateur avec succès';
  ELSE
    RAISE NOTICE 'Attention: Utilisateur monpaypal68@gmail.com non trouvé ou promotion échouée';
  END IF;
END $$;