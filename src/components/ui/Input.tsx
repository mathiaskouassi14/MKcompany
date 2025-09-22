import { InputHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            block w-full px-4 py-3 rounded-lg shadow-sm transition-all duration-200
            input-glass
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <motion.p 
            className="text-sm text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

Input.displayName = 'Input'