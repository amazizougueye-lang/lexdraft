import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface Profile {
  nom: string
  introduction: string
  domaine: string
  onboarded: boolean
}

interface ProfileContextType {
  profile: Profile
  loading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const defaultProfile: Profile = {
  nom: '',
  introduction: '',
  domaine: 'Droit civil',
  onboarded: false,
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data as Profile)
        setLoading(false)
      })
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return
    const merged = { ...profile, ...updates }
    setProfile(merged)
    await supabase
      .from('profiles')
      .upsert({ id: user.id, ...merged, updated_at: new Date().toISOString() })
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
