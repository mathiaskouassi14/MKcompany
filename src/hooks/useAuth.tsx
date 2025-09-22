import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error)
        setLoading(false)
        return
      }
      
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    setLoading(true)
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile fetch error details:', error)
        // Si le profil n'existe pas, on le crée
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile')
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            const newProfile = {
              id: authUser.user.id,
              email: authUser.user.email,
              full_name: authUser.user.user_metadata?.full_name || null,
              role: 'user' as const
            }
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single()
            
            if (createError) throw createError
            setUser(createdProfile)
          }
        } else {
          console.error('Profile fetch error:', error)
          // En cas d'erreur de connexion, on continue sans profil
          setUser(null)
        }
      } else {
        console.log('Profile found:', data)
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      console.error('Sign in error:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up for:', email)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) throw error
    
    setUser({ ...user, ...data })
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}