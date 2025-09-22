import { motion } from 'framer-motion'
import { FileText, Download, Eye, Calendar } from 'lucide-react'
import { Button } from '../ui/Button'

export function RecentDocuments() {
  const documents = [
    {
      id: 1,
      name: 'Articles of Organization',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-01-15',
      status: 'Disponible'
    },
    {
      id: 2,
      name: 'EIN Confirmation',
      type: 'PDF',
      size: '1.2 MB',
      date: '2024-01-16',
      status: 'Disponible'
    },
    {
      id: 3,
      name: 'Operating Agreement',
      type: 'PDF',
      size: '3.1 MB',
      date: '2024-01-17',
      status: 'En préparation'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'En préparation':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card-glass"
    >
      <div className="border-b border-slate-700 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold font-poppins text-slate-100 flex items-center">
            <FileText className="w-6 h-6 text-emerald-400 mr-3" />
            Documents récents
          </h3>
          <Button variant="ghost" size="sm">
            Voir tous
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-100">
                  {document.name}
                </h4>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>{document.type} • {document.size}</span>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(document.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
              
              {document.status === 'Disponible' && (
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}