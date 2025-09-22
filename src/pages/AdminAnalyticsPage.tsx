import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, FileText, Calendar, BarChart3 } from 'lucide-react'

export function AdminAnalyticsPage() {
  const stats = [
    {
      name: 'Revenus ce mois',
      value: '$24,500',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      name: 'Nouveaux clients',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'LLC créées',
      value: '15',
      change: '+5%',
      changeType: 'positive',
      icon: FileText
    },
    {
      name: 'Taux de conversion',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative',
      icon: TrendingUp
    }
  ]

  const recentActivity = [
    { action: 'Nouvelle LLC créée', client: 'Ahmed Benali', time: 'il y a 2h' },
    { action: 'Paiement reçu', client: 'Sarah Martin', time: 'il y a 4h' },
    { action: 'Document validé', client: 'Marc Dubois', time: 'il y a 6h' },
    { action: 'Nouveau client inscrit', client: 'Julie Moreau', time: 'il y a 8h' },
    { action: 'LLC finalisée', client: 'Pierre Durand', time: 'il y a 1j' }
  ]

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
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                    stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
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
                Revenus mensuels
              </h3>
              <select className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm">
                <option>6 derniers mois</option>
                <option>12 derniers mois</option>
                <option>Cette année</option>
              </select>
            </div>
            
            {/* Placeholder pour graphique */}
            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Graphique des revenus</p>
                <p className="text-sm text-slate-600">Intégration en cours...</p>
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
              {recentActivity.map((activity, index) => (
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
              ))}
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
                $1,847
              </div>
              <p className="text-slate-400 mb-1">Revenu moyen par client</p>
              <p className="text-sm text-emerald-400">+15% vs mois dernier</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-3xl font-bold font-poppins gradient-text mb-2">
                4.2j
              </div>
              <p className="text-slate-400 mb-1">Temps moyen de création</p>
              <p className="text-sm text-emerald-400">-8% vs mois dernier</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-3xl font-bold font-poppins gradient-text mb-2">
                98.5%
              </div>
              <p className="text-slate-400 mb-1">Taux de satisfaction</p>
              <p className="text-sm text-emerald-400">+2% vs mois dernier</p>
            </div>
          </div>
        </motion.div>

        {/* Note de développement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card-glass border border-blue-500/20 bg-blue-500/5"
        >
          <div className="flex items-start space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold font-poppins text-blue-400 mb-2">
                Analytics avancées en développement
              </h3>
              <p className="text-slate-300 text-sm">
                Cette page sera bientôt enrichie avec des graphiques interactifs, 
                des rapports détaillés et des analyses prédictives pour vous aider 
                à optimiser votre business.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}