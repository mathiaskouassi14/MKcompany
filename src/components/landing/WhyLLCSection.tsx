import { motion } from 'framer-motion'
import { CheckCircle, DollarSign, Shield, Globe, TrendingUp, Users, Building } from 'lucide-react'

export function WhyLLCSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Compte bancaire américain',
      description: 'Accédez aux services bancaires US pour vos transactions internationales.'
    },
    {
      icon: Shield,
      title: 'Protection juridique',
      description: 'Séparez vos actifs personnels de votre activité professionnelle.'
    },
    {
      icon: Globe,
      title: 'PayPal Business & Stripe',
      description: 'Acceptez les paiements internationaux avec les meilleures plateformes.'
    },
    {
      icon: TrendingUp,
      title: 'Avantages fiscaux',
      description: 'Optimisez votre fiscalité avec le système américain avantageux.'
    },
    {
      icon: Users,
      title: 'Crédibilité internationale',
      description: 'Renforcez votre image de marque avec une entité américaine.'
    },
    {
      icon: Building,
      title: 'Expansion facilitée',
      description: 'Développez votre business sur le marché américain et international.'
    }
  ]

  return (
    <section className="py-24 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1612278920639-cfbae3835fee"
                alt="LLC américaine"
                className="rounded-2xl shadow-2xl animate-float"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-6">
              Pourquoi une LLC américaine ?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Une LLC américaine vous ouvre les portes du marché international et vous donne accès 
              aux meilleurs outils financiers pour développer votre business.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-slate-100 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}