import { motion } from 'framer-motion'
import { FileText, CreditCard, CheckCircle } from 'lucide-react'

export function ProcessSection() {
  const steps = [
    {
      icon: FileText,
      title: 'Remplissez le formulaire',
      description: 'Fournissez vos informations et choisissez votre plan en quelques minutes.'
    },
    {
      icon: CreditCard,
      title: 'Effectuez le paiement',
      description: 'Paiement sécurisé par carte bancaire ou PayPal pour valider votre commande.'
    },
    {
      icon: CheckCircle,
      title: 'Recevez vos documents',
      description: 'Nous créons votre LLC et vous recevez tous les documents officiels sous 48h.'
    }
  ]

  return (
    <section className="py-24 bg-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Un processus simple en 3 étapes
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Créez votre LLC américaine rapidement et facilement avec notre processus optimisé.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent transform translate-x-8 z-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Numéro d'étape */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold text-xl mb-6">
                  {index + 1}
                </div>
                
                {/* Icône */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <step.icon className="w-6 h-6 text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-semibold font-poppins text-slate-100 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}