import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, ArrowRight } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { RegistrationFormData } from '../../../types/registration'

interface PersonalInfoStepProps {
  data: RegistrationFormData
  onNext: (data: Partial<RegistrationFormData>) => void
  loading: boolean
}

export function PersonalInfoStep({ data, onNext, loading }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est obligatoire'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est obligatoire'
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

  const handleChange = (field: string, value: string) => {
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
          <User className="w-6 h-6 text-emerald-400 mr-3" />
          Informations personnelles
        </h2>
        <p className="text-slate-400 mt-2">
          Commençons par vos informations de base
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Prénom *"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Votre prénom"
            error={errors.firstName}
          />

          <Input
            label="Nom *"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Votre nom"
            error={errors.lastName}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 mt-6" />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="votre@email.com"
            className="pl-12"
            error={errors.email}
          />
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-blue-400 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-1">
                Informations importantes
              </h3>
              <p className="text-sm text-slate-300">
                Ces informations seront utilisées pour créer votre LLC et doivent correspondre 
                exactement à vos documents d'identité officiels.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-700">
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