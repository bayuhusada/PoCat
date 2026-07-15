import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { migrateLocalToCloud } from '../lib/cloud'

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
    setProfile(data || { username: '' })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
        if (event === 'SIGNED_IN') {
          const stored = localStorage.getItem('pocat_data')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              const { cats: localCats, badges: localBadges, completedMissions: localMissions } = parsed
              if (localCats?.length > 0) {
                await migrateLocalToCloud(session.user.id, localCats)
              }
              if (localBadges?.length > 0) {
                for (const badgeId of localBadges) {
                  await supabase
                    .from('user_badges')
                    .upsert({ user_id: session.user.id, badge_id: badgeId }, { onConflict: 'user_id,badge_id' })
                }
              }
              if (localMissions?.length > 0) {
                for (const m of localMissions) {
                  await supabase
                    .from('user_missions')
                    .upsert({ user_id: session.user.id, mission_id: m.id, completed_date: m.date }, { onConflict: 'user_id,mission_id,completed_date' })
                }
              }
            } catch (err) {
              console.error('Migration failed:', err)
            }
          }
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signUp = useCallback(async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data?.user && username) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, username, updated_at: new Date().toISOString() })
      if (profileError) throw profileError
      setProfile({ username })
    }
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
