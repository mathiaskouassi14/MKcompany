import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Users, Activity, Settings, AlertTriangle, TrendingUp, Database } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalData: number
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalData: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      // Récupérer le nombre total d'utilisateurs
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Récupérer les nouveaux utilisateurs d'aujourd'hui
      const today = new Date().toISOString().split('T')[0]
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // Récupérer le nombre total de données
      const { count: totalData } = await supabase
        .from('user_data')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.7), // Simulation
        newUsersToday: newUsersToday || 0,
        totalData: totalData || 0
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const adminStats = [
    { 
      name: 'Utilisateurs totaux', 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      name: 'Utilisateurs actifs', 
      value: stats.activeUsers.toString(), 
      icon: Activity, 
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      name: 'Nouveaux aujourd\'hui', 
      value: stats.newUsersToday.toString(), 
      icon: TrendingUp, 
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    { 
      name: 'Données totales', 
      value: stats.totalData.toString(), 
      icon: Database, 
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Administration 🛡️
            </h1>
            <p className="mt-2 text-gray-600">
              Tableau de bord administrateur - Bienvenue {user?.full_name || user?.email}
            </p>
          </div>

          {/* Alerte de sécurité */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Zone d'administration
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Vous avez accès aux fonctionnalités d'administration. 
                    Utilisez ces outils avec précaution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {adminStats.map((item) => (
              <div
                key={item.name}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-md ${item.bg}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Gestion des utilisateurs
              </h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité en développement')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir tous les utilisateurs
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité en développement')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Activité récente
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité en développement')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gérer les rôles
                </Button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Système et configuration
              </h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité en développement')}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Base de données
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité en développement')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={fetchAdminStats}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Actualiser les stats
                </Button>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Activité récente du système
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Nouvel utilisateur inscrit il y a 1 heure
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Mise à jour système effectuée il y a 2 heures
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                Sauvegarde automatique il y a 6 heures
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}