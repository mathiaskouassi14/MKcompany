import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$1,200',
      description: 'Parfait pour débuter',
      features: [
        'Création de la LLC',
        'EIN (numéro fiscal)',
        'Adresse commerciale',
        'Documents officiels',
        'Support email'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$1,800',
      description: 'Le plus populaire',
      features: [
        'Tout du plan Starter',
        'Compte bancaire US',
        'PayPal Business',
        'Stripe intégration',
        'Support prioritaire',
        'Consultation 1h offerte'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '$2,500',
      description: 'Solution complète',
      features: [
        'Tout du plan Professional',
        'Domiciliation premium',
        'Comptabilité 1ère année',
        'Support téléphonique',
        'Consultation illimitée',
        'Accompagnement fiscal'
      ],
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Des tarifs transparents pour créer votre LLC américaine selon vos besoins.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`relative card-glass ${
                plan.popular 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                  : 'border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium">
                    <Star className="w-4 h-4 mr-1" />
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold font-poppins text-slate-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-400 mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold font-poppins gradient-text mb-2">
                  {plan.price}
                </div>
                <p className="text-slate-500 text-sm">
                  Paiement unique
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="block">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  glow={plan.popular}
                >
                  Choisir ce plan
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}