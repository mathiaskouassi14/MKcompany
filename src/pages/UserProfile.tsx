import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { User, Mail, Calendar, Shield, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function UserProfile() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateProfile({ full_name: fullName })
      setMessage('Profil mis à jour avec succès !')
    } catch (error: any) {
      setMessage('Erreur lors de la mise à jour : ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-10"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <Navbar />
      
      <div className="relative z-10 max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold font-poppins gradient-text mb-2">
              Mon Profil
            </h1>
            <p className="text-lg text-slate-400">
              Gérez vos informations personnelles
            </p>
          </motion.div>

          <motion.div 
            className="card-glass"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="border-b border-slate-700 pb-6 mb-6">
              <h2 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
                <User className="w-6 h-6 text-emerald-400 mr-3" />
                Informations personnelles
              </h2>
            </div>
            
            <div className="mb-8">
              <motion.div 
                className="flex items-center space-x-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-poppins text-slate-100">
                    {user?.full_name || 'Nom non défini'}
                  </h3>
                  <p className="text-slate-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </p>
                  <p className="text-slate-500 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Membre depuis {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nom complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                />

                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
              </div>

              <motion.div 
                className="card-glass border border-emerald-500/20 bg-emerald-500/5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-emerald-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-emerald-400 mb-2">
                      Rôle : {user?.role}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Votre niveau d'accès détermine les fonctionnalités disponibles dans l'application.
                    </p>
                  </div>
                </div>
              </motion.div>

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
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}