import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { StatusWidget } from '../components/dashboard/StatusWidget'
import { RecentDocuments } from '../components/dashboard/RecentDocuments'
import { NotificationsWidget } from '../components/dashboard/NotificationsWidget'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Plus, FileText, CreditCard, Settings } from 'lucide-react'

export function ClientDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête avec actions rapides */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
              Bonjour, {user?.full_name || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-slate-400">
              Voici un aperçu de votre activité et de vos projets LLC.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link to="/register">
              <Button glow className="group">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle LLC
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques principales */}
        <DashboardStats />

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            <StatusWidget />
            <RecentDocuments />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <NotificationsWidget />
            
            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card-glass"
            >
              <h3 className="text-xl font-semibold font-poppins text-slate-100 mb-6">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Link to="/documents" className="block">
                  <Button variant="ghost" className="w-full justify-start group">
                    <FileText className="w-5 h-5 mr-3 text-emerald-400" />
                    <div className="text-left">
                      <div className="font-medium text-slate-200">Mes documents</div>
                      <div className="text-sm text-slate-400">Télécharger vos documents officiels</div>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/payments" className="block">
                  <Button variant="ghost" className="w-full justify-start group">
                    <CreditCard className="w-5 h-5 mr-3 text-emerald-400" />
                    <div className="text-left">
                      <div className="font-medium text-slate-200">Paiements</div>
                      <div className="text-sm text-slate-400">Historique et factures</div>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/settings" className="block">
                  <Button variant="ghost" className="w-full justify-start group">
                    <Settings className="w-5 h-5 mr-3 text-emerald-400" />
                    <div className="text-left">
                      <div className="font-medium text-slate-200">Paramètres</div>
                      <div className="text-sm text-slate-400">Gérer votre compte</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Aide et support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-glass border border-blue-500/20 bg-blue-500/5"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-poppins text-blue-400 mb-2">
                    Besoin d'aide ?
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Notre équipe support est disponible pour vous accompagner dans 
                    toutes vos démarches.
                  </p>
                  <Button variant="secondary" size="sm">
                    Contacter le support
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}