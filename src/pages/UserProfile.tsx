import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { User, Mail, Calendar } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos informations personnelles
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Informations personnelles
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user?.full_name || 'Nom non défini'}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user?.email}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Membre depuis {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="bg-gray-50"
                />

                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Rôle : {user?.role}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Votre niveau d'accès détermine les fonctionnalités disponibles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-md ${
                    message.includes('succès') 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={loading}
                  >
                    Sauvegarder les modifications
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}