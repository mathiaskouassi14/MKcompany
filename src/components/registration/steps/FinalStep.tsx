import { motion } from 'framer-motion'
import { CheckCircle, User, Building, FileText, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../../ui/Button'
import { ClientRegistration } from '../../../types/registration'

interface FinalStepProps {
  registration: ClientRegistration | null
  onFinalize: () => void
  onPrevious: () => void
  loading: boolean
}

export function FinalStep({ registration, onFinalize, onPrevious, loading }: FinalStepProps) {
  if (!registration) {
    return (
      <div className="card-glass max-w-2xl mx-auto text-center py-12">
        <p className="text-slate-400">Chargement des informations...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glass max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-poppins gradient-text mb-2">
          Récapitulatif de votre inscription
        </h2>
        <p className="text-slate-400">
          Vérifiez vos informations avant de finaliser
        </p>
      </div>

      <div className="space-y-6">
        {/* Informations personnelles */}
        <div className="card-glass border border-slate-700/50">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-emerald-400 mr-3" />
            <h3 className="text-lg font-semibold text-slate-100">
              Informations personnelles
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Nom complet:</span>
              <p className="text-slate-100 font-medium">
                {registration.first_name} {registration.last_name}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Email:</span>
              <p className="text-slate-100 font-medium">{registration.email}</p>
            </div>
          </div>
        </div>

        {/* Informations société */}
        <div className="card-glass border border-slate-700/50">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-emerald-400 mr-3" />
            <h3 className="text-lg font-semibold text-slate-100">
              Informations société
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Nom de la LLC:</span>
              <p className="text-slate-100 font-medium">{registration.company_name}</p>
            </div>
            <div>
              <span className="text-slate-400">Nombre d'associés:</span>
              <p className="text-slate-100 font-medium">{registration.number_of_partners}</p>
            </div>
            <div>
              <span className="text-slate-400">État d'enregistrement:</span>
              <p className="text-slate-100 font-medium">
                {registration.state?.name} ({registration.state?.code})
              </p>
            </div>
            <div>
              <span className="text-slate-400">Type d'activité:</span>
              <p className="text-slate-100 font-medium">{registration.business_type}</p>
            </div>
          </div>
          {registration.business_description && (
            <div className="mt-4">
              <span className="text-slate-400">Description:</span>
              <p className="text-slate-100 font-medium mt-1">
                {registration.business_description}
              </p>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="card-glass border border-slate-700/50">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-emerald-400 mr-3" />
            <h3 className="text-lg font-semibold text-slate-100">
              Documents téléchargés
            </h3>
          </div>
          <div className="space-y-2">
            {registration.documents?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-100 text-sm">
                    {doc.document_type === 'passport' ? 'Passeport' : 
                     doc.document_type === 'identity_card' ? 'Carte d\'identité' : 
                     'Autre document'}
                  </span>
                </div>
                <span className="text-emerald-400 text-xs">✓ Téléchargé</span>
              </div>
            )) || (
              <p className="text-slate-400 text-sm">Aucun document trouvé</p>
            )}
          </div>
        </div>
      </div>

      {/* Prochaines étapes */}
      <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">
          Prochaines étapes
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Validation de vos documents par notre équipe</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Préparation des documents de création de votre LLC</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Dépôt officiel auprès des autorités américaines</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Réception de vos documents officiels sous 48-72h</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Précédent
        </Button>
        
        <Button
          onClick={onFinalize}
          loading={loading}
          glow={true}
          className="group"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Finaliser l'inscription
        </Button>
      </div>
    </motion.div>
  )
}