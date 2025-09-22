import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export function SuccessStoriesSection() {
  const testimonials = [
    {
      name: 'Ahmed Benali',
      role: 'E-commerce Entrepreneur',
      image: 'https://i.ibb.co/tTzRhYG3/istockphoto-1522377399-612x612.jpg',
      content: 'Grâce à MK Company, j\'ai pu créer ma LLC et ouvrir un compte PayPal Business en quelques jours. Mon chiffre d\'affaires a doublé !',
      rating: 5
    },
    {
      name: 'Sarah Martin',
      role: 'Consultante Digital',
      image: 'https://i.ibb.co/93m6gQqY/istockphoto-1571704741-612x612.jpg',
      content: 'Service exceptionnel ! L\'équipe m\'a accompagnée à chaque étape. Je recommande vivement pour tous les entrepreneurs.',
      rating: 5
    },
    {
      name: 'Marc Dubois',
      role: 'Développeur SaaS',
      image: 'https://i.ibb.co/ycf1ndr9/young-african-businessman-working-office-laptop-make-notice-notebook-1296x700.jpg',
      content: 'Processus ultra-rapide et professionnel. Ma LLC était créée en 24h avec tous les documents nécessaires.',
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Nos clients témoignent
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Découvrez les success stories de nos clients qui ont créé leur LLC américaine avec MK Company.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card-glass"
            >
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-8 h-8 text-emerald-400" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold font-poppins text-slate-100">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}