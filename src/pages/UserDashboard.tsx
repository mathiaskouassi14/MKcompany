import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../components/layout/Navbar'
import { User, Activity, Settings, Database } from 'lucide-react'

export function UserDashboard() {
  const { user } = useAuth()

  const stats = [
    { name: 'Profil complété', value: '85%', icon: User, color: 'text-blue-600' },
    { name: 'Activité récente', value: '12', icon: Activity, color: 'text-green-600' },
    { name: 'Paramètres', value: '3', icon: Settings, color: 'text-yellow-600' },
    { name: 'Données', value: '24', icon: Database, color: 'text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, {user?.full_name || user?.email} 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Voici un aperçu de votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activité récente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Profil mis à jour il y a 2 heures
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Connexion réussie il y a 1 jour
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Paramètres modifiés il y a 3 jours
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Modifier le profil</div>
                  <div className="text-sm text-gray-500">Mettre à jour vos informations</div>
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Gérer les données</div>
                  <div className="text-sm text-gray-500">Consulter vos données</div>
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Paramètres</div>
                  <div className="text-sm text-gray-500">Configurer votre compte</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}