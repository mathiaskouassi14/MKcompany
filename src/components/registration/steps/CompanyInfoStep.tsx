import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building, Users, MapPin, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { useRegistration } from '../../../hooks/useRegistration'
import { RegistrationFormData } from '../../../types/registration'

interface CompanyInfoStepProps {
  data: RegistrationFormData
  onNext: (data: Partial<RegistrationFormData>) => void
  onPrevious: () => void
  loading: boolean
}

export function CompanyInfoStep({ data, onNext, onPrevious, loading }: CompanyInfoStepProps) {
  const { states } = useRegistration()
  const [formData, setFormData] = useState({
    companyName: data.companyName,
    numberOfPartners: data.numberOfPartners,
    stateId: data.stateId,
    businessType: data.businessType,
    businessDescription: data.businessDescription
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const businessTypes = [
    'SaaS',
    'E-commerce',
    'Consulting',
    'Marketing Digital',
    'Développement Web',
    'Design',
    'Formation',
    'Autre'
  ]

  const partnerOptions = [
    { value: 1, label: '1 (Moi uniquement)' },
    { value: 2, label: '2 associés' },
    { value: 3, label: '3 associés' },
    { value: 4, label: '4 associés ou plus' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName) {
      newErrors.companyName = 'Le nom de la société est obligatoire'
    } else if (formData.companyName.length < 3) {
      newErrors.companyName = 'Le nom doit contenir au moins 3 caractères'
    }

    if (!formData.stateId) {
      newErrors.stateId = 'Veuillez sélectionner un état'
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Veuillez sélectionner un type d\'activité'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glass max-w-2xl mx-auto"
    >
      <div className="border-b border-slate-700 pb-6 mb-8">
        <h2 className="text-2xl font-bold font-poppins text-slate-100 flex items-center">
          <Building className="w-6 h-6 text-emerald-400 mr-3" />
          Informations sur la société
        </h2>
        <p className="text-slate-400 mt-2">
          Définissons les détails de votre future LLC
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nom souhaité pour la LLC *"
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          placeholder="Ex: Mon Entreprise LLC"
          error={errors.companyName}
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Nombre d'associés *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {partnerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('numberOfPartners', option.value)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  formData.numberOfPartners === option.value
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            État d'enregistrement *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={formData.stateId}
              onChange={(e) => handleChange('stateId', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                errors.stateId ? 'border-red-500' : 'border-slate-700 focus:border-emerald-500'
              }`}
            >
              <option value="">Sélectionnez un état</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>
          {errors.stateId && (
            <p className="mt-2 text-sm text-red-400">{errors.stateId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Type d'activité *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('businessType', type)}
                className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                  formData.businessType === type
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Briefcase className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm font-medium">{type}</span>
              </button>
            ))}
          </div>
          {errors.businessType && (
            <p className="mt-2 text-sm text-red-400">{errors.businessType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description de l'activité (optionnel)
          </label>
          <textarea
            value={formData.businessDescription}
            onChange={(e) => handleChange('businessDescription', e.target.value)}
            placeholder="Décrivez brièvement votre activité..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
          />
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-emerald-400 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-emerald-400 mb-1">
                Recommandation
              </h3>
              <p className="text-sm text-slate-300">
                Le New Mexico offre d'excellents avantages fiscaux et une grande flexibilité 
                pour les LLC. C'est notre recommandation pour la plupart des entrepreneurs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-700">
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
            type="submit"
            loading={loading}
            glow={true}
            className="group"
          >
            Continuer
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </motion.div>
  )
}