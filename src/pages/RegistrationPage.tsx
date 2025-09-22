import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MultiStepRegistration } from '../components/registration/MultiStepRegistration'

export function RegistrationPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="loading-spinner h-16 w-16 mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <MultiStepRegistration />
}