import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect border-b border-slate-800' : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://i.ibb.co/KjbYWZCv/Gemini-Generated-Image-as4dw1as4dw1as4d-removebg-preview.png"
              alt="MK Company"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold font-poppins gradient-text">
              MK COMPANY
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Services
            </a>
            <a href="#pricing" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="text-slate-300 hover:text-emerald-400 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Boutons CTA Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" glow>
                Commencer
              </Button>
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden text-slate-300 hover:text-emerald-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile Déroulant */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden glass-effect border-t border-slate-800 mt-2 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                Services
              </a>
              <a href="#pricing" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                Tarifs
              </a>
              <a href="#faq" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                FAQ
              </a>
              <a href="#contact" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                Contact
              </a>
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <Link to="/auth" className="block">
                  <Button variant="ghost" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button className="w-full" glow>
                    Commencer
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}