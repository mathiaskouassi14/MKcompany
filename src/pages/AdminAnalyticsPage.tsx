import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, FileText, Calendar, BarChart3, RefreshCw } from 'lucide-react'
import { useAdminData } from '../hooks/useAdminData'
import { Button } from '../components/ui/Button'

export function AdminAnalyticsPage() {
  const { stats, clients, documents, payments, loading, error, actions } = useAdminData()

  const analyticsStats = [
    {
      name: 'Revenus ce mois',
      value: `$${stats?.total_revenue?.toLocaleString() || '0'}`,
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      name: 'Nouveaux clients',
      value: stats?.new_users_today?.toString() || '0',
      change: '+8%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'LLC créées',
      value: stats?.completed_applications?.toString() || '0',
      change: '+5%',
      changeType: 'positive',
      icon: FileText
    },
    {
      name: 'Documents en attente',
      value: stats?.pending_documents?.toString() || '0',
      change: '+2%',
      changeType: 'warning',
      icon: TrendingUp
    }
  ]

  // Activité récente basée sur les vraies données
  const recentActivity = [
    ...clients.slice(0, 2).map(client => ({
      action: 'Nouveau client inscrit',
      client: client.full_name || client.email,
      time: new Date(client.created_at).toLocaleDateString('fr-FR')
    })),
    ...documents.slice(0, 2).map(doc => ({
      action: `Document ${doc.status === 'approved' ? 'approuvé' : 'soumis'}`,
      client: doc.user?.full_name || doc.user?.email || 'Client',
      time: new Date(doc.uploaded_at).toLocaleDateString('fr-FR')
    })),
    ...payments.slice(0, 1).map(payment => ({
      action: `Paiement ${payment.status === 'completed' ? 'reçu' : 'en attente'}`,
      client: payment.user?.full_name || payment.user?.email || 'Client',
      time: new Date(payment.created_at).toLocaleDateString('fr-FR')
    }))
  ].slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Analytics & Rapports
          </h1>
          <p className="text-slate-400">
            Analysez les performances de votre business et suivez les tendances.
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
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-glass"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold font-poppins text-slate-100 mb-2">
                    {stat.value}
                  </p>
                  <p className={`text-sm flex items-center ${
                    stat.changeType === 'positive' ? 'text-emerald-400' : 
                    stat.changeType === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'negative' ? 'rotate-180' : ''
                    }`} />
                    {stat.change} vs mois dernier
                  </p>
                </div>
                <div className="flex-shrink-0 p-3 rounded-xl bg-emerald-500/10">
                  <stat.icon className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique des revenus */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-glass"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
                <BarChart3 className="w-6 h-6 text-emerald-400 mr-3" />
                Statistiques en temps réel
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-bold font-poppins gradient-text mb-1">
                    {stats?.total_users || 0}
                  </div>
                  <p className="text-slate-400 text-sm">Clients totaux</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-bold font-poppins gradient-text mb-1">
                    {stats?.total_applications || 0}
                  </div>
                  <p className="text-slate-400 text-sm">LLC totales</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-bold font-poppins gradient-text mb-1">
                    {stats?.pending_applications || 0}
                  </div>
                  <p className="text-slate-400 text-sm">En cours</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="text-2xl font-bold font-poppins gradient-text mb-1">
                    {stats?.completed_applications || 0}
                  </div>
                  <p className="text-slate-400 text-sm">Terminées</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card-glass"
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-emerald-400 mr-3" />
              <h3 className="text-xl font-semibold font-poppins text-slate-100">
                Activité récente
              </h3>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div>
                    <p className="text-slate-200 font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-400">
                      {activity.client}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Métriques détaillées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-glass"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
            <h3 className="text-xl font-semibold font-poppins text-slate-100">
              Métriques détaillées
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-3xl font-bold font-poppins gradient-text mb-2">
                ${stats?.total_revenue ? Math.round(stats.total_revenue / (stats.total_users || 1)) : 0}
              </div>
              <p className="text-slate-400 mb-1">Revenu moyen par client</p>
              <p className="text-sm text-emerald-400">Temps réel</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-3xl font-bold font-poppins gradient-text mb-2">
                {stats?.pending_applications && stats?.total_applications ? 
                  Math.round((stats.pending_applications / stats.total_applications) * 100) : 0}%
              </div>
              <p className="text-slate-400 mb-1">Taux de progression</p>
              <p className="text-sm text-emerald-400">Temps réel</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-3xl font-bold font-poppins gradient-text mb-2">
                {stats?.completed_applications && stats?.total_applications ? 
                  Math.round((stats.completed_applications / stats.total_applications) * 100) : 0}%
              </div>
              <p className="text-slate-400 mb-1">Taux de réussite</p>
              <p className="text-sm text-emerald-400">Temps réel</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}