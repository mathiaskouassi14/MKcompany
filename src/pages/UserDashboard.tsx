import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../components/layout/Navbar'
import { User, Activity, Settings, Database, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function UserDashboard() {
  const { user } = useAuth()

  const stats = [
    { 
      name: 'Profil complété', 
      value: '85%', 
      icon: User, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      name: 'Activité récente', 
      value: '12', 
      icon: Activity, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    { 
      name: 'Paramètres', 
      value: '3', 
      icon: Settings, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    { 
      name: 'Données', 
      value: '24', 
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
              Bonjour, <span className="gradient-text">{user?.full_name || user?.email}</span> 👋
            </h1>
            <p className="text-lg text-slate-400">
              Voici un aperçu de votre activité
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((item, index) => (
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
                <h3 className="text-xl font-semibold font-poppins text-slate-100">
                  Activité récente
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { text: 'Profil mis à jour', time: 'il y a 2 heures', color: 'bg-emerald-400' },
                  { text: 'Connexion réussie', time: 'il y a 1 jour', color: 'bg-blue-400' },
                  { text: 'Paramètres modifiés', time: 'il y a 3 jours', color: 'bg-purple-400' }
                ].map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className={`w-2 h-2 ${activity.color} rounded-full mr-3`}></div>
                    <span className="text-slate-300 flex-1">{activity.text}</span>
                    <span className="text-slate-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <Zap className="w-6 h-6 text-emerald-400 mr-3" />
                <h3 className="text-xl font-semibold font-poppins text-slate-100">
                  Actions rapides
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Modifier le profil', desc: 'Mettre à jour vos informations', icon: User },
                  { title: 'Gérer les données', desc: 'Consulter vos données', icon: Database },
                  { title: 'Paramètres', desc: 'Configurer votre compte', icon: Settings }
                ].map((action, index) => (
                  <motion.button 
                    key={index}
                    className="w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <action.icon className="w-5 h-5 text-emerald-400 mr-3" />
                      <div>
                        <div className="font-medium text-slate-200">{action.title}</div>
                        <div className="text-sm text-slate-400">{action.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}