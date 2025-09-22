import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  CreditCard, 
  Settings, 
  Users, 
  BarChart3, 
  LogOut,
  Bell,
  User,
  Shield
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const clientNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Paiements', href: '/payments', icon: CreditCard },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ]

  const adminNavigation = [
    { name: 'Dashboard Admin', href: '/admin', icon: Shield },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]

  const navigation = isAdmin && location.pathname.startsWith('/admin') 
    ? adminNavigation 
    : clientNavigation

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-5"></div>
      <div className="absolute inset-0 animate-particles opacity-20"></div>
      
      <div className="relative z-10 flex">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto glass-effect border-r border-slate-800">
              <div className="flex items-center flex-shrink-0 px-4">
                <img 
                  src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
                  alt="MK Company"
                  className="h-8 w-8"
                />
                <span className="ml-3 text-xl font-bold font-poppins gradient-text">
                  MK COMPANY
                </span>
              </div>
              
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                          }`}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Basculer entre vues admin/client */}
                {isAdmin && (
                  <div className="px-2 py-4 border-t border-slate-700">
                    <div className="space-y-2">
                      <Link
                        to="/dashboard"
                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                      >
                        <User className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                        Vue Client
                      </Link>
                      <Link
                        to="/admin"
                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                      >
                        <Shield className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                        Vue Admin
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40 lg:hidden">
            <div className="fixed inset-0 bg-slate-900/75" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex-1 flex flex-col max-w-xs w-full glass-effect"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img 
                    src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
                    alt="MK Company"
                    className="h-8 w-8"
                  />
                  <span className="ml-3 text-xl font-bold font-poppins gradient-text">
                    MK COMPANY
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400'
                        }`}
                      >
                        <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Header */}
          <div className="relative z-10 flex-shrink-0 flex h-16 glass-effect border-b border-slate-800">
            <button
              className="px-4 border-r border-slate-800 text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1" />
              
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors">
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* Profil utilisateur */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-100">
                      {user?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user?.role}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Déconnexion */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu de la page */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}