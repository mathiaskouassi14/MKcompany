import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      name: 'Statut LLC',
      value: 'En cours',
      icon: FileText,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
    {
      name: 'Progression',
      value: '75%',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      name: 'Documents',
      value: '3/5',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      name: 'Actions requises',
      value: '2',
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`card-glass border ${stat.border}`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-400 truncate">
                  {stat.name}
                </dt>
                <dd className="text-2xl font-bold font-poppins text-slate-100">
                  {stat.value}
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}