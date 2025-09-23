import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthForm } from '../components/auth/AuthForm'
import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Simple loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-slate-400">
            {mode === 'signin' 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte'
            }
          </p>
        </div>
        
        <AuthForm mode={mode} onSuccess={() => navigate('/dashboard')} />
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' 
              ? "Pas de compte ? S'inscrire" 
              : 'Déjà un compte ? Se connecter'
            }
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}