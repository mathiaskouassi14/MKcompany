export interface USState {
  id: string
  name: string
  code: string
  is_active: boolean
  created_at: string
}

export interface ClientRegistration {
  id: string
  user_id: string
  
  // Étape 1: Informations personnelles
  email: string
  first_name: string
  last_name: string
  
  // Étape 2: Informations société
  company_name: string
  number_of_partners: number
  state_id: string
  business_type: string
  business_description?: string
  
  // Statut et métadonnées
  status: 'draft' | 'pending_documents' | 'pending_review' | 'approved' | 'rejected'
  current_step: number
  completed_at?: string
  
  // Timestamps
  created_at: string
  updated_at: string
  
  // Relations
  state?: USState
  documents?: ClientDocument[]
}

export interface ClientDocument {
  id: string
  registration_id: string
  user_id: string
  
  // Informations du document
  document_type: 'passport' | 'identity_card' | 'other'
  original_filename: string
  file_path: string
  file_size?: number
  mime_type?: string
  
  // Statut de validation
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  reviewed_by?: string
  reviewed_at?: string
  
  // Timestamps
  uploaded_at: string
}

export interface RegistrationFormData {
  // Étape 1
  email: string
  firstName: string
  lastName: string
  
  // Étape 2
  companyName: string
  numberOfPartners: number
  stateId: string
  businessType: string
  businessDescription: string
  
  // Étape 3
  documents: File[]
}

export interface RegistrationStats {
  total_registrations: number
  pending_registrations: number
  approved_registrations: number
  pending_documents: number
  registrations_today: number
}