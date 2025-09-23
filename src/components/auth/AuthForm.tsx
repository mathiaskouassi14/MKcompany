import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { motion } from 'framer-motion'
import { Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'

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
    const message = error?.message || error || 'Une erreur est survenue'
    
    if (message.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect'
    }
    if (message.includes('Email not confirmed')) {
      return 'Veuillez confirmer votre email'
    }
    if (message.includes('User already registered')) {
      return 'Un compte existe déjà avec cet email'
    }
    if (message.includes('Password should be at least')) {
      return 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    return message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        onSuccess?.()
      } else {
        await signUp(email, password)
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
      }
    } catch (err: any) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-poppins text-white mb-2">
          {mode === 'signin' ? 'Connexion' : 'Inscription'}
        </h2>
        <p className="text-slate-400">
          {mode === 'signin' 
            ? 'Accédez à votre espace personnel' 
            : 'Créez votre compte en quelques secondes'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12"
            placeholder="votre@email.com"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="pl-12"
            placeholder="••••••••"
          />
        </div>
        
        {success && (
          <motion.div 
            className="flex items-center p-4 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-5 h-5 mr-3" />
            <span className="text-sm">{success}</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            className="flex items-center p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
        </Button>
      </form>
    </motion.div>
  )
}