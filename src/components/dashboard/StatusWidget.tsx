import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'

export function StatusWidget() {
  const steps = [
    {
      title: 'Informations reçues',
      description: 'Vos informations ont été validées',
      status: 'completed',
      date: '15 Jan 2024'
    },
    {
      title: 'Documents préparés',
      description: 'Articles of Organization en cours',
      status: 'in-progress',
      date: 'En cours'
    },
    {
      title: 'Dépôt officiel',
      description: 'Soumission au Delaware',
      status: 'pending',
      date: 'À venir'
    },
    {
      title: 'LLC finalisée',
      description: 'Réception des documents officiels',
      status: 'pending',
      date: 'À venir'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-slate-400" />
      default:
        return <FileText className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/20 bg-emerald-500/5'
      case 'in-progress':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'pending':
        return 'border-slate-600/20 bg-slate-600/5'
      default:
        return 'border-slate-600/20 bg-slate-600/5'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glass"
    >
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h3 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
          <FileText className="w-6 h-6 text-emerald-400 mr-3" />
          Suivi de création
        </h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getStatusColor(step.status)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-medium text-slate-100 mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-400 mb-2">
                  {step.description}
                </p>
                <p className="text-xs text-slate-500">
                  {step.date}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-400 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-1">
              Temps estimé restant
            </h4>
            <p className="text-sm text-slate-300">
              2-3 jours ouvrables pour finaliser votre LLC
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}