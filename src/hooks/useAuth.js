import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    if (!userId) { setProfile(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
    } else {
      await supabase.from('profiles').insert({ id: userId }).single()
      setProfile({ username: '' })
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const updateUsername = useCallback(async (username) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user?.id, username, updated_at: new Date().toISOString() })
    if (error) throw error
    setProfile(prev => ({ ...prev, username }))
  }, [user])

  const updatePassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  }, [])

  return { session, user, profile, loading, signIn, signUp, signOut, updateUsername, updatePassword }
}
