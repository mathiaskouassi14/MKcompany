# 🔧 Correction - Créer votre profil admin manuellement

## 🚨 **Problème identifié**
Votre compte existe dans `auth.users` mais pas dans `profiles`. On va le créer manuellement.

## 📋 **Solution étape par étape**

### **1️⃣ D'abord, vérifiez votre ID utilisateur :**
```sql
SELECT id, email FROM auth.users WHERE email = 'monpaypal68@gmail.com';
```
**Copiez l'ID qui s'affiche** (quelque chose comme `12345678-1234-1234-1234-123456789012`)

### **2️⃣ Créez votre profil manuellement :**
```sql
-- Remplacez 'VOTRE_ID_ICI' par l'ID obtenu à l'étape 1
INSERT INTO profiles (id, email, full_name, role, status)
VALUES (
  'VOTRE_ID_ICI',  -- Remplacez par votre vrai ID
  'monpaypal68@gmail.com',
  'Admin MK Company',
  'admin',
  'active'
);
```

### **3️⃣ Vérifiez que ça a marché :**
```sql
SELECT * FROM profiles WHERE email = 'monpaypal68@gmail.com';
```

## 🎯 **Alternative plus simple**

Si vous préférez, voici une requête qui fait tout automatiquement :

```sql
-- Cette requête crée automatiquement votre profil admin
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Récupérer votre ID depuis auth.users
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'monpaypal68@gmail.com';
  
  -- Si l'utilisateur existe dans auth.users
  IF user_uuid IS NOT NULL THEN
    -- Créer ou mettre à jour le profil
    INSERT INTO profiles (id, email, full_name, role, status)
    VALUES (user_uuid, 'monpaypal68@gmail.com', 'Admin MK Company', 'admin', 'active')
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'admin',
      status = 'active',
      updated_at = now();
    
    RAISE NOTICE 'Profil admin créé avec succès pour %', 'monpaypal68@gmail.com';
  ELSE
    RAISE EXCEPTION 'Utilisateur % non trouvé dans auth.users. Inscrivez-vous d''abord sur /auth', 'monpaypal68@gmail.com';
  END IF;
END $$;
```

## ✅ **Après avoir exécuté une de ces solutions :**

1. **Reconnectez-vous** sur votre application
2. **Allez sur** `/admin` 
3. **Vous devriez voir** le dashboard admin avec toutes les fonctionnalités

## 🚀 **Test final**
```sql
-- Vérifiez que tout fonctionne
SELECT get_admin_stats();
```

Cette requête devrait retourner vos statistiques admin !