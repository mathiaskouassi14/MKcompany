export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'moderator' | 'admin' | 'super_admin'
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface UserUpdateData {
  full_name?: string
  avatar_url?: string
  email?: string
}