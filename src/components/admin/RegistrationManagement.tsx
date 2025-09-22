import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useAdminRegistrations } from '../../hooks/useRegistration'
import { ClientRegistration } from '../../types/registration'

export function RegistrationManagement() {
  const { registrations, stats, loading, error, updateRegistrationStatus, updateDocumentStatus } = useAdminRegistrations()
  const [selectedRegistration, setSelectedRegistration] = useState<ClientRegistration | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredRegistrations = registrations.filter(reg => {
    if (filterStatus === 'all') return true
    return reg.status === filterStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending_review':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'pending_review':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'pending_documents':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    await updateRegistrationStatus(registrationId, newStatus)
  }

  const handleDocumentStatusChange = async (documentId: string, newStatus: string, notes?: string) => {
    await updateDocumentStatus(documentId, newStatus, notes)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-16 w-16"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass border border-emerald-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-emerald-500/10">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Total</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {stats.total_registrations}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass border border-yellow-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">En attente</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {stats.pending_registrations}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass border border-emerald-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Approuvées</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {stats.approved_registrations}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-glass border border-blue-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Documents</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {stats.pending_documents}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-glass border border-purple-500/20"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-xl bg-purple-500/10">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-400">Aujourd'hui</p>
                <p className="text-2xl font-bold font-poppins text-slate-100">
                  {stats.registrations_today}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filtres */}
      <div className="card-glass">
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 font-medium">Filtrer par statut:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-emerald-500/20"
          >
            <option value="all">Tous</option>
            <option value="draft">Brouillon</option>
            <option value="pending_documents">Documents en attente</option>
            <option value="pending_review">En révision</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
          </select>
        </div>
      </div>

      {/* Liste des inscriptions */}
      <div className="space-y-4">
        {filteredRegistrations.map((registration, index) => (
          <motion.div
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="card-glass"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {registration.first_name.charAt(0)}{registration.last_name.charAt(0)}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold font-poppins text-slate-100">
                    {registration.first_name} {registration.last_name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {registration.email}
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {registration.company_name}
                    </div>
                    <span>•</span>
                    <span>{new Date(registration.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(registration.status)}`}>
                      {getStatusIcon(registration.status)}
                      <span className="ml-1">
                        {registration.status === 'draft' ? 'Brouillon' :
                         registration.status === 'pending_documents' ? 'Documents en attente' :
                         registration.status === 'pending_review' ? 'En révision' :
                         registration.status === 'approved' ? 'Approuvée' :
                         registration.status === 'rejected' ? 'Rejetée' : registration.status}
                      </span>
                    </span>
                    {registration.documents && (
                      <span className="text-xs text-slate-500">
                        {registration.documents.length} document(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedRegistration(registration)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </Button>
                
                <select
                  value={registration.status}
                  onChange={(e) => handleStatusChange(registration.id, e.target.value)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending_documents">Documents en attente</option>
                  <option value="pending_review">En révision</option>
                  <option value="approved">Approuvée</option>
                  <option value="rejected">Rejetée</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de détails */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
              <h2 className="text-2xl font-bold font-poppins text-slate-100">
                Détails de l'inscription
              </h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedRegistration(null)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                    <User className="w-5 h-5 text-emerald-400 mr-2" />
                    Informations personnelles
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-400">Nom complet:</span>
                      <p className="text-slate-100 font-medium">
                        {selectedRegistration.first_name} {selectedRegistration.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <p className="text-slate-100 font-medium">{selectedRegistration.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                    <Building className="w-5 h-5 text-emerald-400 mr-2" />
                    Informations société
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-400">Nom de la LLC:</span>
                      <p className="text-slate-100 font-medium">{selectedRegistration.company_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Nombre d'associés:</span>
                      <p className="text-slate-100 font-medium">{selectedRegistration.number_of_partners}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">État:</span>
                      <p className="text-slate-100 font-medium">
                        {selectedRegistration.state?.name} ({selectedRegistration.state?.code})
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Type d'activité:</span>
                      <p className="text-slate-100 font-medium">{selectedRegistration.business_type}</p>
                    </div>
                    {selectedRegistration.business_description && (
                      <div>
                        <span className="text-slate-400">Description:</span>
                        <p className="text-slate-100 font-medium">{selectedRegistration.business_description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-emerald-400 mr-2" />
                  Documents ({selectedRegistration.documents?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedRegistration.documents?.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-slate-100 font-medium">{doc.original_filename}</p>
                          <p className="text-xs text-slate-400">
                            {doc.document_type === 'passport' ? 'Passeport' : 
                             doc.document_type === 'identity_card' ? 'Carte d\'identité' : 
                             'Autre document'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                            {doc.status === 'pending' ? 'En attente' :
                             doc.status === 'approved' ? 'Approuvé' :
                             doc.status === 'rejected' ? 'Rejeté' : doc.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleDocumentStatusChange(doc.id, 'approved')}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDocumentStatusChange(doc.id, 'rejected')}
                        >
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <p className="text-slate-400 text-sm">Aucun document téléchargé</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {filteredRegistrations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">
            Aucune inscription trouvée
          </h3>
          <p className="text-slate-500">
            Aucune inscription ne correspond aux critères sélectionnés.
          </p>
        </motion.div>
      )}
    </div>
  )
}