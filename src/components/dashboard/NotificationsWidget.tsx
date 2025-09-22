import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { Button } from '../ui/Button'

export function NotificationsWidget() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Document validé',
      message: 'Votre pièce d\'identité a été approuvée',
      time: 'il y a 2h',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Action requise',
      message: 'Veuillez fournir un justificatif d\'adresse',
      time: 'il y a 4h',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Mise à jour',
      message: 'Votre LLC est en cours de traitement',
      time: 'il y a 1j',
      read: true
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-500/5'
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5'
      default:
        return 'border-slate-600/20 bg-slate-600/5'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="card-glass"
    >
      <div className="border-b border-slate-700 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
            <Bell className="w-6 h-6 text-emerald-400 mr-3" />
            Notifications
          </h3>
          <Button variant="ghost" size="sm">
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
              !notification.read ? 'ring-1 ring-emerald-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-slate-100">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="ghost" size="sm">
          Voir toutes les notifications
        </Button>
      </div>
    </motion.div>
  )
}