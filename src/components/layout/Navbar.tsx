import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { User, Settings, LogOut, Shield } from 'lucide-react'

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900">
              Mon App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            
            <Link
              to="/profile"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <User className="w-4 h-4 mr-1" />
              Profil
            </Link>
            
            {['admin', 'super_admin'].includes(user.role) && (
              <Link
                to="/admin"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
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
    </nav>
  )
}