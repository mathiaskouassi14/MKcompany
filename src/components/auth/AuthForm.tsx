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
      className="max-w-md mx-auto card-glass"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold font-poppins gradient-text mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {mode === 'signin' ? 'Connexion' : 'Inscription'}
        </motion.h2>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {mode === 'signin' 
            ? 'Accédez à votre espace personnel' 
            : 'Créez votre compte en quelques secondes'
          }
        </motion.p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
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
        </motion.div>
        
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            glow={true}
          >
            {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
          </Button>
        </motion.div>
      </form>
      
      {mode === 'signin' && (
        <motion.div 
          className="mt-6 text-center text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>Pas encore de compte ? Utilisez le bouton ci-dessous pour vous inscrire.</p>
        </motion.div>
      )}
    </motion.div>
  )
}