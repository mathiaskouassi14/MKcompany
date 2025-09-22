import { useAdminData } from '../hooks/useAdminData'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Users, Activity, Settings, AlertTriangle, TrendingUp, Database, Shield, Zap, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export function AdminDashboard() {
  const { stats, loading, error, actions } = useAdminData()

  const adminStats = [
    { 
      name: 'Utilisateurs totaux', 
      value: stats?.total_users?.toString() || '0', 
      icon: Users, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      name: 'Utilisateurs actifs', 
      value: stats?.active_users?.toString() || '0', 
      icon: Activity, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    { 
      name: 'Nouveaux aujourd\'hui', 
      value: stats?.new_users_today?.toString() || '0', 
      icon: TrendingUp, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    { 
      name: 'LLC en cours', 
      value: stats?.pending_applications?.toString() || '0', 
      icon: Database, 
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 liquid-bg opacity-10"></div>
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner h-16 w-16"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-10"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold font-poppins text-slate-50 mb-2">
              Administration <span className="gradient-text">🛡️</span>
            </h1>
            <p className="text-lg text-slate-400">
              Tableau de bord administrateur - Gestion temps réel
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.refreshData}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              {error && (
                <span className="text-red-400 text-sm">
                  Erreur: {error}
                </span>
              )}
            </div>
          </motion.div>

          {/* Alerte de sécurité */}
          <motion.div 
            className="mb-8 card-glass border border-yellow-500/20 bg-yellow-500/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold font-poppins text-yellow-400 mb-2">
                  Zone d'administration
                </h3>
                <p className="text-slate-300 text-sm">
                  Vous avez accès aux fonctionnalités d'administration. 
                  Utilisez ces outils avec précaution.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {adminStats.map((item, index) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`card-glass border ${item.border}`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-2xl font-bold font-poppins text-slate-100">
                        {item.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-emerald-400 mr-3" />
                <h3 className="text-xl font-semibold font-poppins text-slate-100">
                  Gestion des utilisateurs
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Users, text: 'Voir tous les utilisateurs', desc: 'Gérer les comptes utilisateurs' },
                  { icon: Activity, text: 'Activité récente', desc: 'Surveiller les actions' },
                  { icon: Shield, text: 'Gérer les rôles', desc: 'Modifier les permissions' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50 hover:border-emerald-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/admin/clients'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <action.icon className="w-5 h-5 text-emerald-400 mr-3" />
                      <div>
                        <div className="font-medium text-slate-200">{action.text}</div>
                        <div className="text-sm text-slate-400">{action.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-emerald-400 mr-3" />
                <h3 className="text-xl font-semibold font-poppins text-slate-100">
                  Système et configuration
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Database, text: 'Base de données', desc: 'Gérer les données système' },
                  { icon: Settings, text: 'Configuration', desc: 'Paramètres globaux' },
                  { icon: TrendingUp, text: 'Actualiser les stats', desc: 'Mettre à jour les métriques', action: fetchAdminStats }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50 hover:border-emerald-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action || (() => window.location.href = '/admin/analytics')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <action.icon className="w-5 h-5 text-emerald-400 mr-3" />
                      <div>
                        <div className="font-medium text-slate-200">{action.text}</div>
                        <div className="text-sm text-slate-400">{action.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activité récente */}
          <motion.div 
            className="mt-8 card-glass"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-emerald-400 mr-3" />
              <h3 className="text-xl font-semibold font-poppins text-slate-100">
                Activité récente du système
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { text: `${stats?.new_users_today || 0} nouveaux utilisateurs aujourd'hui`, time: 'temps réel', color: 'bg-emerald-400' },
                { text: `${stats?.pending_documents || 0} documents en attente`, time: 'temps réel', color: 'bg-yellow-400' },
                { text: `$${stats?.total_revenue || 0} de revenus totaux`, time: 'temps réel', color: 'bg-blue-400' }
              ].map((activity, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <div className={`w-2 h-2 ${activity.color} rounded-full mr-3`}></div>
                  <span className="text-slate-300 flex-1">{activity.text}</span>
                  <span className="text-slate-500">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}