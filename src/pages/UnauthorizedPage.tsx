import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-10"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div 
            className="card-glass text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h2 className="text-3xl font-bold font-poppins text-slate-100 mb-4">
                Accès non autorisé
              </h2>
              
              <p className="text-slate-400 mb-8 leading-relaxed">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
              </p>
              
              <Link to="/dashboard">
                <Button className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Retour au dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}