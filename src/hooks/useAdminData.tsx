import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export interface AdminStats {
  total_users: number
  active_users: number
  new_users_today: number
  total_applications: number
  pending_applications: number
  completed_applications: number
  total_revenue: number
  pending_documents: number
}

export interface Client {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
  llc_applications?: LLCApplication[]
}

export interface LLCApplication {
  id: string
  company_name: string
  plan: string
  status: string
  progress: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  name: string
  type: string
  category: string
  status: string
  uploaded_at: string
  user_id: string
  user?: {
    full_name: string | null
    email: string
  }
}

export interface Payment {
  id: string
  amount: number
  description: string
  status: string
  created_at: string
  user_id: string
  user?: {
    full_name: string | null
    email: string
  }
}

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  user_id: string
  user?: {
    full_name: string | null
    email: string
  }
}

export function useAdminData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  // Récupérer les statistiques admin
  const fetchStats = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase.rpc('get_admin_stats')
      if (error) throw error
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching admin stats:', err)
      setError(err.message)
    }
  }

  // Récupérer tous les clients
  const fetchClients = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          llc_applications (
            id,
            company_name,
            plan,
            status,
            progress,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      console.error('Error fetching clients:', err)
      setError(err.message)
    }
  }

  // Récupérer tous les documents
  const fetchDocuments = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles!documents_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setDocuments(data?.map(doc => ({
        ...doc,
        user: doc.profiles
      })) || [])
    } catch (err: any) {
      console.error('Error fetching documents:', err)
      setError(err.message)
    }
  }

  // Récupérer tous les paiements
  const fetchPayments = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles!payments_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data?.map(payment => ({
        ...payment,
        user: payment.profiles
      })) || [])
    } catch (err: any) {
      console.error('Error fetching payments:', err)
      setError(err.message)
    }
  }

  // Récupérer toutes les notifications
  const fetchNotifications = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!notifications_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data?.map(notif => ({
        ...notif,
        user: notif.profiles
      })) || [])
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      setError(err.message)
    }
  }

  // Mettre à jour le statut d'un document
  const updateDocumentStatus = async (documentId: string, status: string, adminNotes?: string) => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', documentId)

      if (error) throw error
      
      // Rafraîchir les documents
      await fetchDocuments()
      
      return true
    } catch (err: any) {
      console.error('Error updating document status:', err)
      setError(err.message)
      return false
    }
  }

  // Mettre à jour le statut d'une application LLC
  const updateLLCStatus = async (applicationId: string, status: string, progress?: number) => {
    if (!isAdmin) return

    try {
      const updateData: any = { status }
      if (progress !== undefined) {
        updateData.progress = progress
      }

      const { error } = await supabase
        .from('llc_applications')
        .update(updateData)
        .eq('id', applicationId)

      if (error) throw error
      
      // Rafraîchir les clients
      await fetchClients()
      
      return true
    } catch (err: any) {
      console.error('Error updating LLC status:', err)
      setError(err.message)
      return false
    }
  }

  // Envoyer une notification à un client
  const sendNotification = async (userId: string, title: string, message: string, type: string = 'info') => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          created_by: user?.id
        })

      if (error) throw error
      
      // Enregistrer l'action admin
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          target_user_id: userId,
          action_type: 'notification_sent',
          description: `Notification envoyée: ${title}`,
          metadata: { title, message, type }
        })
      
      // Rafraîchir les notifications
      await fetchNotifications()
      
      return true
    } catch (err: any) {
      console.error('Error sending notification:', err)
      setError(err.message)
      return false
    }
  }

  // Suspendre/Activer un utilisateur
  const updateUserStatus = async (userId: string, status: string) => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)

      if (error) throw error
      
      // Enregistrer l'action admin
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          target_user_id: userId,
          action_type: 'user_status_changed',
          description: `Statut utilisateur changé: ${status}`,
          metadata: { new_status: status }
        })
      
      // Rafraîchir les clients
      await fetchClients()
      
      return true
    } catch (err: any) {
      console.error('Error updating user status:', err)
      setError(err.message)
      return false
    }
  }

  // Charger toutes les données
  const loadAllData = async () => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await Promise.all([
        fetchStats(),
        fetchClients(),
        fetchDocuments(),
        fetchPayments(),
        fetchNotifications()
      ])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Configurer les abonnements temps réel
  useEffect(() => {
    if (!isAdmin) return

    loadAllData()

    // Abonnements temps réel
    const profilesSubscription = supabase
      .channel('admin-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchClients()
        fetchStats()
      })
      .subscribe()

    const applicationsSubscription = supabase
      .channel('admin-applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'llc_applications' }, () => {
        fetchClients()
        fetchStats()
      })
      .subscribe()

    const documentsSubscription = supabase
      .channel('admin-documents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
        fetchDocuments()
        fetchStats()
      })
      .subscribe()

    const paymentsSubscription = supabase
      .channel('admin-payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        fetchPayments()
        fetchStats()
      })
      .subscribe()

    const notificationsSubscription = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications()
      })
      .subscribe()

    return () => {
      profilesSubscription.unsubscribe()
      applicationsSubscription.unsubscribe()
      documentsSubscription.unsubscribe()
      paymentsSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [isAdmin, user?.id])

  return {
    stats,
    clients,
    documents,
    payments,
    notifications,
    loading,
    error,
    actions: {
      updateDocumentStatus,
      updateLLCStatus,
      sendNotification,
      updateUserStatus,
      refreshData: loadAllData
    }
  }
}