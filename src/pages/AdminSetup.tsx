import { AdminPromotion } from '../components/ui/AdminPromotion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

export function AdminSetup() {
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
            <h1 className="text-3xl font-bold font-poppins gradient-text mb-4">
              Configuration Admin
            </h1>
            <p className="text-slate-400">
              Promouvoir un utilisateur en administrateur
            </p>
          </motion.div>

          <AdminPromotion />

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/auth">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour à l'authentification
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="mt-8 card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold font-poppins text-slate-100 mb-4">
              Instructions :
            </h3>
            <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
              <li>Créez d'abord un compte utilisateur normal via la page d'inscription</li>
              <li>Utilisez ce formulaire pour promouvoir votre compte en admin</li>
              <li>Reconnectez-vous pour voir le lien "Admin" dans la navigation</li>
              <li>Accédez à <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400">/admin</code> pour le dashboard administrateur</li>
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  )
}