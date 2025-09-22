import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signIn, signUp } = useAuth()

  const getErrorMessage = (error: any) => {
    if (error.message?.includes('Invalid login credentials')) {
      return mode === 'signin' 
        ? 'Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte.'
        : 'Erreur lors de la création du compte. Vérifiez vos informations.'
    }
    if (error.message?.includes('Email not confirmed')) {
      return 'Votre email n\'a pas encore été confirmé. Vérifiez votre boîte mail et cliquez sur le lien de confirmation.'
    }
    if (error.message?.includes('User already registered')) {
      return 'Un compte existe déjà avec cette adresse email. Essayez de vous connecter.'
    }
    if (error.message?.includes('Password should be at least')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.'
    }
    return error.message || 'Une erreur est survenue. Veuillez réessayer.'
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
      }
      onSuccess?.()
    } catch (err: any) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'signin' ? 'Connexion' : 'Inscription'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        
        {success && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">
            {success}
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
        </Button>
      </form>
      
      {mode === 'signin' && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Pas encore de compte ? Utilisez le bouton ci-dessous pour vous inscrire.</p>
        </div>
      )}
    </div>
  )
}