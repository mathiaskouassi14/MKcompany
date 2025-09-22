import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Play } from 'lucide-react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 liquid-bg opacity-20"></div>
      <div className="absolute inset-0 animate-particles"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Service professionnel certifié
          </motion.div>

          {/* Titre principal */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins text-slate-50 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Créez votre{' '}
            <span className="gradient-text shimmer-text">
              LLC américaine
            </span>
            <br />
            en toute simplicité
          </motion.h1>

          {/* Sous-titre */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ouvrez votre compte bancaire américain, acceptez PayPal Business et Stripe.
            <br className="hidden md:block" />
            Développez votre business à l'international avec MK COMPANY.
          </motion.p>

          {/* Boutons CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/auth">
              <Button size="lg" glow className="group">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="group">
              <Play className="w-5 h-5 mr-2" />
              Voir les tarifs
            </Button>
          </motion.div>

          {/* Statistiques */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { number: '500+', label: 'LLC créées' },
              { number: '98%', label: 'Taux de réussite' },
              { number: '24h', label: 'Délai moyen' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}