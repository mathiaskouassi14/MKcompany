import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthForm } from '../components/auth/AuthForm'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-10"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
                alt="MK Company"
                className="h-12 w-12 mr-3"
              />
              <span className="text-2xl font-bold font-poppins gradient-text">
                MK COMPANY
              </span>
            </div>
            <h1 className="text-3xl font-bold font-poppins text-slate-100 mb-2">
              {mode === 'signin' ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-slate-400">
              {mode === 'signin' 
                ? 'Accédez à votre espace client' 
                : 'Créez votre compte pour commencer'
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AuthForm mode={mode} onSuccess={handleSuccess} />
          </motion.div>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {mode === 'signin' 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'
              }
            </button>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}