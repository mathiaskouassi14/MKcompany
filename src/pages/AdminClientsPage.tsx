import { useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { Search, Filter, Users, Eye, Mail, Phone, CheckCircle, Clock, AlertTriangle, Edit, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAdminData } from '../hooks/useAdminData'

export function AdminClientsPage() {
  const { clients, loading, error, actions } = useAdminData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesRole = filterRole === 'all' || client.role === filterRole
    return matchesSearch && matchesRole
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Users className="w-4 h-4 text-slate-400" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'super_admin':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'moderator':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'suspended':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    await actions.updateUserStatus(clientId, newStatus)
  }

  const handleSendNotification = async (clientId: string) => {
    const title = prompt('Titre de la notification:')
    const message = prompt('Message:')
    if (title && message) {
      await actions.sendNotification(clientId, title, message, 'info')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner h-16 w-16"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Gestion des Clients
          </h1>
          <p className="text-slate-400">
            Gérez tous vos clients et leurs informations en temps réel.
          </p>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              Erreur: {error}
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-glass border border-emerald-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-emerald-500/10">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Total clients</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {clients.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-glass border border-blue-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Utilisateurs</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {clients.filter(c => c.role === 'user').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-glass border border-purple-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Admins</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {clients.filter(c => ['admin', 'super_admin'].includes(c.role)).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-glass border border-yellow-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-yellow-500/10">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Nouveaux (7j)</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {clients.filter(c => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(c.created_at) > weekAgo
                  }).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-glass"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Rechercher par email ou nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-emerald-500/20"
              >
                <option value="all">Tous les rôles</option>
                <option value="user">Utilisateurs</option>
                <option value="admin">Admins</option>
                <option value="super_admin">Super Admins</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Liste des clients */}
        <div className="space-y-4">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="card-glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {client.full_name ? client.full_name.charAt(0).toUpperCase() : client.email.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-slate-100">
                      {client.full_name || 'Nom non défini'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {client.email}
                      </div>
                      <span>•</span>
                      <span>Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR')}</span>
                      {client.llc_applications && client.llc_applications.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{client.llc_applications.length} LLC</span>
                        </>
                      )}
                    </div>
                    {client.llc_applications && client.llc_applications.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-500">
                          Dernière LLC: {client.llc_applications[0].company_name} ({client.llc_applications[0].status})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(client.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(client.role)}`}>
                    {client.role}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendNotification(client.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Notifier
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    <select
                      value={client.status}
                      onChange={(e) => handleStatusChange(client.id, e.target.value)}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Aucun client trouvé
            </h3>
            <p className="text-slate-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}