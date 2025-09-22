import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { User, Settings, LogOut, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) return null

  return (
    <motion.nav 
      className="glass-effect border-b border-slate-800 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold font-poppins gradient-text">
                Mon App
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            
            <Link
              to="/profile"
              className="text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
            >
              <User className="w-4 h-4 mr-1" />
              Profil
            </Link>
            
            {['admin', 'super_admin'].includes(user.role) && (
              <Link
                to="/admin"
                className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}