import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRegistration } from '../../hooks/useRegistration'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { CompanyInfoStep } from './steps/CompanyInfoStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { FinalStep } from './steps/FinalStep'
import { RegistrationFormData } from '../../types/registration'
import { CheckCircle, Circle, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'

export function MultiStepRegistration() {
  const navigate = useNavigate()
  const { currentRegistration, saveRegistration, finalizeRegistration, loading, error } = useRegistration()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    numberOfPartners: 1,
    stateId: '',
    businessType: '',
    businessDescription: '',
    documents: []
  })

  // Charger les données existantes si disponibles
  useEffect(() => {
    if (currentRegistration) {
      setFormData({
        email: currentRegistration.email,
        firstName: currentRegistration.first_name,
        lastName: currentRegistration.last_name,
        companyName: currentRegistration.company_name,
        numberOfPartners: currentRegistration.number_of_partners,
        stateId: currentRegistration.state_id,
        businessType: currentRegistration.business_type,
        businessDescription: currentRegistration.business_description || '',
        documents: []
      })
      setCurrentStep(currentRegistration.current_step)
    }
  }, [currentRegistration])

  const steps = [
    { number: 1, title: 'Informations personnelles', completed: currentStep > 1 },
    { number: 2, title: 'Informations société', completed: currentStep > 2 },
    { number: 3, title: 'Documents', completed: currentStep > 3 },
    { number: 4, title: 'Validation', completed: currentStep > 4 }
  ]

  const handleNext = async (stepData: Partial<RegistrationFormData>) => {
    try {
      const updatedFormData = { ...formData, ...stepData }
      setFormData(updatedFormData)
      
      await saveRegistration(updatedFormData, currentStep + 1)
      setCurrentStep(currentStep + 1)
    } catch (err) {
      console.error('Error saving step:', err)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalize = async () => {
    try {
      if (currentRegistration) {
        await finalizeRegistration(currentRegistration.id)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Error finalizing registration:', err)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData}
            onNext={handleNext}
            loading={loading}
          />
        )
      case 2:
        return (
          <CompanyInfoStep
            data={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )
      case 3:
        return (
          <DocumentsStep
            registrationId={currentRegistration?.id}
            onNext={() => setCurrentStep(4)}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )
      case 4:
        return (
          <FinalStep
            registration={currentRegistration}
            onFinalize={handleFinalize}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-10"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Inscription LLC
          </h1>
          <p className="text-slate-400">
            Créez votre LLC américaine en quelques étapes simples
          </p>
        </motion.div>

        {/* Indicateur d'étapes */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : currentStep === step.number
                      ? 'border-emerald-500 text-emerald-500'
                      : 'border-slate-600 text-slate-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    currentStep === step.number ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.completed ? 'bg-emerald-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Messages d'erreur */}
        {error && (
          <motion.div 
            className="mt-6 p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Bouton retour */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  )
}