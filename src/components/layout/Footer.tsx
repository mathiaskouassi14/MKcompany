import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const footerSections = [
    {
      title: 'Services',
      links: [
        { name: 'Création LLC', href: '#' },
        { name: 'Compte bancaire US', href: '#' },
        { name: 'PayPal Business', href: '#' },
        { name: 'Intégration Stripe', href: '#' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { name: 'Mentions légales', href: '#' },
        { name: 'CGU', href: '#' },
        { name: 'Politique de confidentialité', href: '#' },
        { name: 'Cookies', href: '#' }
      ]
    },
    {
      title: 'Contact',
      links: [
        { name: 'Support', href: '#' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Nous contacter', href: '#' }
      ]
    }
  ]

  return (
    <footer id="contact" className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
                alt="MK Company"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold font-poppins gradient-text">
                MK COMPANY
              </span>
            </Link>
            <p className="text-slate-400 mb-6">
              Votre partenaire de confiance pour créer votre LLC américaine et développer votre business à l'international.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 mr-3" />
                <span>contact@mkcompany.com</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-slate-400">
                <MapPin className="w-4 h-4 mr-3" />
                <span>Delaware, USA</span>
              </div>
            </div>
          </div>

          {/* Sections de liens */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold font-poppins text-slate-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Logo et description */}
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
                alt="MK Company"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold font-poppins gradient-text">
                MK COMPANY
              </span>
            </Link>
            <p className="text-slate-400 mb-6">
              Votre partenaire de confiance pour créer votre LLC américaine.
            </p>
          </div>

          {/* Sections dépliables */}
          {footerSections.map((section, index) => (
            <div key={index} className="border-b border-slate-700 last:border-b-0">
              <button
                className="w-full flex items-center justify-between py-4 text-left"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-lg font-semibold font-poppins text-slate-100">
                  {section.title}
                </h3>
                {openSections.includes(section.title) ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              {openSections.includes(section.title) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.href}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}

          {/* Contact mobile */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center text-slate-400">
              <Mail className="w-4 h-4 mr-3" />
              <span>contact@mkcompany.com</span>
            </div>
            <div className="flex items-center text-slate-400">
              <Phone className="w-4 h-4 mr-3" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-slate-400">
              <MapPin className="w-4 h-4 mr-3" />
              <span>Delaware, USA</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400">
            © 2024 MK COMPANY. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}