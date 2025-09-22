import { useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateProfile({ 
        full_name: formData.full_name 
      })
      setMessage('Profil mis à jour avec succès !')
    } catch (error: any) {
      setMessage('Erreur lors de la mise à jour : ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Paramètres
          </h1>
          <p className="text-slate-400">
            Gérez vos informations personnelles et préférences de compte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-glass"
            >
              <div className="border-b border-slate-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
                  <User className="w-6 h-6 text-emerald-400 mr-3" />
                  Informations personnelles
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom complet"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Votre nom complet"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="opacity-60 cursor-not-allowed"
                  />

                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />

                  <Input
                    label="Adresse"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Votre adresse"
                  />
                </div>

                {message && (
                  <motion.div 
                    className={`p-4 rounded-lg border ${
                      message.includes('succès') 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message}
                  </motion.div>
                )}

                <div className="flex justify-end pt-6 border-t border-slate-700">
                  <Button
                    type="submit"
                    loading={loading}
                    glow={true}
                  >
                    Sauvegarder les modifications
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-glass mt-8"
            >
              <div className="border-b border-slate-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
                  <Bell className="w-6 h-6 text-emerald-400 mr-3" />
                  Préférences de notification
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'email', label: 'Notifications par email', desc: 'Recevez les mises à jour par email' },
                  { key: 'sms', label: 'Notifications SMS', desc: 'Recevez les alertes importantes par SMS' },
                  { key: 'push', label: 'Notifications push', desc: 'Recevez les notifications dans votre navigateur' }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-slate-100">
                        {notification.label}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {notification.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications[notification.key as keyof typeof formData.notifications]}
                        onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rôle utilisateur */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-glass border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-emerald-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold font-poppins text-emerald-400 mb-2">
                    Rôle : {user?.role}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Votre niveau d'accès détermine les fonctionnalités disponibles.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sécurité */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-glass"
            >
              <h3 className="text-lg font-semibold font-poppins text-slate-100 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                Sécurité
              </h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  Changer le mot de passe
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Authentification à deux facteurs
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Sessions actives
                </Button>
              </div>
            </motion.div>

            {/* Facturation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card-glass"
            >
              <h3 className="text-lg font-semibold font-poppins text-slate-100 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 text-emerald-400 mr-2" />
                Facturation
              </h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  Méthodes de paiement
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Historique des factures
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Télécharger les reçus
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}