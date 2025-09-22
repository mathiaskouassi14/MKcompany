import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, CheckCircle, X, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '../../ui/Button'
import { useRegistration } from '../../../hooks/useRegistration'

interface DocumentsStepProps {
  registrationId?: string
  onNext: () => void
  onPrevious: () => void
  loading: boolean
}

interface UploadedDocument {
  id: string
  file: File
  type: string
  status: 'uploading' | 'success' | 'error'
  progress: number
}

export function DocumentsStep({ registrationId, onNext, onPrevious, loading }: DocumentsStepProps) {
  const { uploadDocument } = useRegistration()
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requiredDocuments = [
    {
      type: 'passport',
      label: 'Passeport',
      description: 'Photo claire de votre passeport (pages principales)',
      required: true
    },
    {
      type: 'identity_card',
      label: 'Carte d\'identité',
      description: 'Recto-verso de votre carte d\'identité',
      required: true
    }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('Seuls les images et PDF sont acceptés')
        continue
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 10MB')
        continue
      }

      const documentId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newDocument: UploadedDocument = {
        id: documentId,
        file,
        type: 'other', // Par défaut, l'utilisateur pourra changer
        status: 'uploading',
        progress: 0
      }

      setDocuments(prev => [...prev, newDocument])

      // Simuler l'upload avec progression
      try {
        if (registrationId) {
          // Upload réel
          await uploadDocument(file, newDocument.type, registrationId)
          
          setDocuments(prev => prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, status: 'success', progress: 100 }
              : doc
          ))
        } else {
          // Simulation pour le développement
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100))
            setDocuments(prev => prev.map(doc => 
              doc.id === documentId 
                ? { ...doc, progress }
                : doc
            ))
          }
          
          setDocuments(prev => prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, status: 'success' }
              : doc
          ))
        }
      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'error' }
            : doc
        ))
      }
    }
  }

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const updateDocumentType = (documentId: string, type: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, type }
        : doc
    ))
  }

  const hasRequiredDocuments = () => {
    const passportDoc = documents.find(doc => doc.type === 'passport' && doc.status === 'success')
    const idDoc = documents.find(doc => doc.type === 'identity_card' && doc.status === 'success')
    return passportDoc && idDoc
  }

  const canProceed = hasRequiredDocuments()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glass max-w-2xl mx-auto"
    >
      <div className="border-b border-slate-700 pb-6 mb-8">
        <h2 className="text-2xl font-bold font-poppins text-slate-100 flex items-center">
          <FileText className="w-6 h-6 text-emerald-400 mr-3" />
          Documents requis
        </h2>
        <p className="text-slate-400 mt-2">
          Téléchargez vos documents d'identité officiels
        </p>
      </div>

      {/* Liste des documents requis */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          Documents obligatoires
        </h3>
        <div className="space-y-4">
          {requiredDocuments.map((docType) => {
            const uploaded = documents.find(doc => doc.type === docType.type && doc.status === 'success')
            return (
              <div key={docType.type} className={`p-4 rounded-lg border ${
                uploaded ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100 flex items-center">
                      {uploaded ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-400 mr-2" />
                      )}
                      {docType.label}
                      {docType.required && <span className="text-red-400 ml-1">*</span>}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {docType.description}
                    </p>
                  </div>
                  {uploaded && (
                    <span className="text-emerald-400 text-sm font-medium">
                      ✓ Téléchargé
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Zone de téléchargement */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-500/5' 
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-100 mb-2">
          Glissez vos fichiers ici
        </h3>
        <p className="text-slate-400 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <p className="text-sm text-slate-500">
          Formats acceptés: JPG, PNG, PDF (max 10MB)
        </p>
      </div>

      {/* Liste des documents téléchargés */}
      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Documents téléchargés
          </h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      {doc.file.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                        className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-200"
                      >
                        <option value="passport">Passeport</option>
                        <option value="identity_card">Carte d'identité</option>
                        <option value="other">Autre</option>
                      </select>
                      <span className="text-xs text-slate-500">
                        {(doc.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {doc.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{doc.progress}%</span>
                    </div>
                  )}
                  
                  {doc.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  
                  {doc.status === 'error' && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message d'aide */}
      {!canProceed && (
        <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-yellow-400 mb-1">
                Documents manquants
              </h3>
              <p className="text-sm text-slate-300">
                Vous devez télécharger au minimum votre passeport et votre carte d'identité 
                pour continuer l'inscription.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Précédent
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          loading={loading}
          glow={canProceed}
          className="group"
        >
          Continuer
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}