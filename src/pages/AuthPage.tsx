import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthForm } from '../components/auth/AuthForm'
import { Button } from '../components/ui/Button'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Bienvenue
        </h1>
        
        <AuthForm mode={mode} />
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' 
              ? "Pas de compte ? S'inscrire" 
              : 'Déjà un compte ? Se connecter'
            }
          </Button>
        </div>
      </div>
    </div>
  )
}