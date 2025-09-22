import { motion } from 'framer-motion'
import { Shield, Zap, Globe, HeadphonesIcon } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Sécurisé et légal',
      description: 'Création 100% légale avec tous les documents officiels requis par les autorités américaines.'
    },
    {
      icon: Zap,
      title: 'Rapide et efficace',
      description: 'Processus optimisé pour créer votre LLC en moins de 48h avec suivi en temps réel.'
    },
    {
      icon: Globe,
      title: 'Accès international',
      description: 'Ouvrez des comptes bancaires US, acceptez PayPal Business et intégrez Stripe facilement.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Support expert',
      description: 'Accompagnement personnalisé par nos experts en création d\'entreprises américaines.'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="features" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Pourquoi choisir MK COMPANY ?
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Nous simplifions la création de votre LLC américaine avec un service complet et professionnel.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-glass text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold font-poppins text-slate-100 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}