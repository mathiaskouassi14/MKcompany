import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function PaymentsPage() {
  const payments = [
    {
      id: 1,
      description: 'Plan Professional - Création LLC',
      amount: '$1,800',
      date: '2024-01-15',
      status: 'Payé',
      method: 'Carte bancaire'
    },
    {
      id: 2,
      description: 'Frais gouvernementaux Delaware',
      amount: '$90',
      date: '2024-01-16',
      status: 'Payé',
      method: 'Inclus dans le plan'
    },
    {
      id: 3,
      description: 'Service bancaire premium',
      amount: '$200',
      date: '2024-01-20',
      status: 'En attente',
      method: 'PayPal'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'En attente':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'Échoué':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'En attente':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'Échoué':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const totalPaid = payments
    .filter(p => p.status === 'Payé')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Mes Paiements
          </h1>
          <p className="text-slate-400">
            Consultez l'historique de vos paiements et factures.
          </p>
        </div>

        {/* Résumé des paiements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-glass border border-emerald-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Total payé</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-glass border border-yellow-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">En attente</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  $200
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-glass border border-blue-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-blue-500/10">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Transactions</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {payments.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Historique des paiements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-poppins text-slate-100">
            Historique des transactions
          </h2>
          
          {payments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-slate-100">
                      {payment.description}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>{payment.method}</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(payment.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xl font-bold font-poppins text-slate-100">
                      {payment.amount}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aide */}
        <motion.div 
          className="card-glass border border-blue-500/20 bg-blue-500/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-start space-x-3">
            <CreditCard className="h-6 w-6 text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold font-poppins text-blue-400 mb-2">
                Questions sur vos paiements ?
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Notre équipe support est disponible pour vous aider avec toutes vos questions 
                concernant les paiements et la facturation.
              </p>
              <Button variant="secondary" size="sm">
                Contacter le support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}