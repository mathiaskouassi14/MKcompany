import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { ClientRegistration, USState, ClientDocument, RegistrationFormData, RegistrationStats } from '../types/registration'

export function useRegistration() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<USState[]>([])
  const [currentRegistration, setCurrentRegistration] = useState<ClientRegistration | null>(null)

  // Charger les états disponibles
  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('us_states')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setStates(data || [])
    } catch (err: any) {
      console.error('Error fetching states:', err)
      setError(err.message)
    }
  }

  // Charger l'inscription en cours de l'utilisateur
  const fetchCurrentRegistration = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .select(`
          *,
          state:us_states(*),
          documents:client_documents(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setCurrentRegistration(data || null)
    } catch (err: any) {
      console.error('Error fetching registration:', err)
      setError(err.message)
    }
  }

  // Créer ou mettre à jour une inscription
  const saveRegistration = async (formData: Partial<RegistrationFormData>, step: number) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const registrationData = {
        user_id: user.id,
        email: formData.email || user.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company_name: formData.companyName,
        number_of_partners: formData.numberOfPartners,
        state_id: formData.stateId,
        business_type: formData.businessType,
        business_description: formData.businessDescription,
        current_step: step
      }

      let result
      if (currentRegistration) {
        // Mettre à jour l'inscription existante
        const { data, error } = await supabase
          .from('client_registrations')
          .update(registrationData)
          .eq('id', currentRegistration.id)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Créer une nouvelle inscription
        const { data, error } = await supabase
          .from('client_registrations')
          .insert(registrationData)
          .select()
          .single()

        if (error) throw error
        result = data
      }

      setCurrentRegistration(result)
      return result
    } catch (err: any) {
      console.error('Error saving registration:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Upload de documents
  const uploadDocument = async (file: File, documentType: string, registrationId: string) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      // Upload du fichier vers Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${registrationId}/${documentType}_${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Enregistrer les métadonnées du document
      const { data, error } = await supabase
        .from('client_documents')
        .insert({
          registration_id: registrationId,
          user_id: user.id,
          document_type: documentType,
          original_filename: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      console.error('Error uploading document:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Finaliser l'inscription
  const finalizeRegistration = async (registrationId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .update({
          status: 'pending_review',
          current_step: 4,
          completed_at: new Date().toISOString()
        })
        .eq('id', registrationId)
        .select()
        .single()

      if (error) throw error
      setCurrentRegistration(data)
      return data
    } catch (err: any) {
      console.error('Error finalizing registration:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStates()
    if (user) {
      fetchCurrentRegistration()
    }
  }, [user])

  return {
    loading,
    error,
    states,
    currentRegistration,
    saveRegistration,
    uploadDocument,
    finalizeRegistration,
    refreshRegistration: fetchCurrentRegistration
  }
}

// Hook pour les admins
export function useAdminRegistrations() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrations, setRegistrations] = useState<ClientRegistration[]>([])
  const [stats, setStats] = useState<RegistrationStats | null>(null)

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  // Charger toutes les inscriptions
  const fetchRegistrations = async () => {
    if (!isAdmin) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .select(`
          *,
          state:us_states(*),
          documents:client_documents(*),
          user:profiles!client_registrations_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (err: any) {
      console.error('Error fetching registrations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Charger les statistiques
  const fetchStats = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase.rpc('get_registration_stats')
      if (error) throw error
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching registration stats:', err)
      setError(err.message)
    }
  }

  // Mettre à jour le statut d'une inscription
  const updateRegistrationStatus = async (registrationId: string, status: string, adminNotes?: string) => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('client_registrations')
        .update({ status })
        .eq('id', registrationId)

      if (error) throw error
      
      // Rafraîchir les données
      await fetchRegistrations()
      await fetchStats()
      
      return true
    } catch (err: any) {
      console.error('Error updating registration status:', err)
      setError(err.message)
      return false
    }
  }

  // Mettre à jour le statut d'un document
  const updateDocumentStatus = async (documentId: string, status: string, adminNotes?: string) => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('client_documents')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId)

      if (error) throw error
      
      // Rafraîchir les données
      await fetchRegistrations()
      
      return true
    } catch (err: any) {
      console.error('Error updating document status:', err)
      setError(err.message)
      return false
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations()
      fetchStats()
    }
  }, [isAdmin])

  return {
    loading,
    error,
    registrations,
    stats,
    updateRegistrationStatus,
    updateDocumentStatus,
    refreshData: () => {
      fetchRegistrations()
      fetchStats()
    }
  }
}