import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const faqs = [
    {
      question: 'Combien de temps faut-il pour créer une LLC ?',
      answer: 'En moyenne, nous créons votre LLC en 24 à 48 heures ouvrables. Vous recevrez tous les documents officiels par email dès que la création sera finalisée.'
    },
    {
      question: 'Puis-je ouvrir un compte bancaire américain avec ma LLC ?',
      answer: 'Oui, absolument ! Nous vous accompagnons dans l\'ouverture de votre compte bancaire américain. C\'est l\'un des principaux avantages de notre service.'
    },
    {
      question: 'Quels documents vais-je recevoir ?',
      answer: 'Vous recevrez les Articles of Organization, l\'EIN (numéro fiscal), l\'Operating Agreement, et tous les documents officiels nécessaires pour votre LLC.'
    },
    {
      question: 'Y a-t-il des frais cachés ?',
      answer: 'Non, nos tarifs sont transparents. Le prix affiché inclut tous les frais gouvernementaux et notre service. Aucune surprise !'
    }
  ]

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 2)

  return (
    <section id="faq" className="py-24 bg-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins gradient-text mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-slate-400">
            Trouvez les réponses aux questions les plus courantes sur la création de LLC.
          </p>
        </motion.div>

        <div className="space-y-4">
          {visibleFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-glass"
            >
              <button
                className="w-full text-left flex items-center justify-between p-6"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold font-poppins text-slate-100 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {!showAll && (
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              variant="ghost"
              onClick={() => setShowAll(true)}
            >
              Afficher plus de questions
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}