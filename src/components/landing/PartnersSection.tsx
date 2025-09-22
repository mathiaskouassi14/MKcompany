import { motion } from 'framer-motion'

export function PartnersSection() {
  const partners = [
    {
      name: 'Y Combinator',
      logo: 'https://i.ibb.co/1tzRpr9r/Is-Y-Worth-It-2-removebg-preview.png'
    },
    {
      name: 'HubSpot',
      logo: 'https://i.ibb.co/8LtGfDwy/Hubspot-Logo-img-1-removebg-preview.png'
    },
    {
      name: 'Nexus',
      logo: 'https://i.ibb.co/TxMvCYwP/5940629705780741548-120-removebg-preview.png'
    },
    {
      name: 'Hustle Fund',
      logo: 'https://i.ibb.co/bgxGBJZM/5940629705780741551-120-removebg-preview.png'
    }
  ]

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 animate-liquid"></div>
      <div className="absolute inset-0 animate-particles opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Soutenu par les meilleurs
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Nous travaillons avec les leaders de l'industrie pour vous offrir le meilleur service.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, glow: true }}
              className="flex items-center justify-center p-6 card-glass hover:border-emerald-500/30 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}