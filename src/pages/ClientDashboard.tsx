import { useAuth } from '../hooks/useAuth'

export function ClientDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      padding: '20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Dashboard
            </h1>
            <p style={{ color: '#cbd5e1' }}>
              Bienvenue {user?.email}
            </p>
          </div>
          <button
            onClick={signOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>

        <div style={{
          padding: '40px',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            🎉 Connexion réussie !
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>
            Votre authentification Supabase fonctionne parfaitement.
          </p>
        </div>
      </div>
    </div>
  )
}