import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Calendar } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function DocumentsPage() {
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
      status: 'En attente'
    },
    {
      id: 4,
      name: 'Bank Account Documents',
      type: 'ZIP',
      size: '5.8 MB',
      date: '2024-01-20',
      status: 'En préparation'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'En attente':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'En préparation':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Mes Documents
          </h1>
          <p className="text-slate-400">
            Accédez à tous vos documents officiels et téléchargez-les quand vous le souhaitez.
          </p>
        </div>

        <div className="grid gap-6">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-slate-100">
                      {document.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>{document.type} • {document.size}</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(document.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                    {document.status}
                  </span>
                  
                  {document.status === 'Disponible' && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="card-glass border border-blue-500/20 bg-blue-500/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-start space-x-3">
            <FileText className="h-6 w-6 text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold font-poppins text-blue-400 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Si vous avez des questions sur vos documents ou si vous ne trouvez pas ce que vous cherchez, 
                notre équipe support est là pour vous aider.
              </p>
              <Button variant="secondary" size="sm">
                Contacter le support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}