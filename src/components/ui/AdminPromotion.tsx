import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from './Button'
import { Input } from './Input'
import { Shield, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export function AdminPromotion() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const promoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { error } = await supabase.rpc('promote_user_to_admin', {
        user_email: email
      })

      if (error) throw error

      setMessage(`Utilisateur ${email} promu en administrateur avec succès !`)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la promotion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="max-w-md mx-auto card-glass border border-yellow-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-xl font-semibold font-poppins text-slate-100">
          Promotion Admin
        </h3>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-200">
            <p className="font-medium mb-1">Attention :</p>
            <p>Cette fonction permet de promouvoir un utilisateur existant en administrateur. L'utilisateur doit d'abord avoir créé un compte.</p>
          </div>
        </div>
      </div>

      <form onSubmit={promoteToAdmin} className="space-y-4">
        <Input
          label="Email de l'utilisateur à promouvoir"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="utilisateur@example.com"
          required
        />

        {message && (
          <motion.div 
            className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          variant="secondary"
        >
          Promouvoir en Admin
        </Button>
      </form>
    </motion.div>
  )
}