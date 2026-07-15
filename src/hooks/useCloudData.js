import { useState, useEffect, useCallback, useRef } from 'react'
import useAuth from './useAuth'
import { supabase } from '../lib/supabase'
import {
  uploadPhoto, saveCatToCloud, updateCatInCloud, deleteCatFromCloud,
  fetchUserCats, fetchUserBadges, unlockBadge,
  fetchUserMissions, completeMission,
} from '../lib/cloud'
import { checkBadges, calculateLevel } from '../lib/levels'
import missions from '../data/missions'

export default function useCloudData() {
  const { user } = useAuth()
  const [cats, setCats] = useState([])
  const [badges, setBadges] = useState([])
  const [completedMissions, setCompletedMissions] = useState([])
  const [loading, setLoading] = useState(true)

  const catsRef = useRef(cats)
  useEffect(() => { catsRef.current = cats }, [cats])
  const badgesRef = useRef(badges)
  useEffect(() => { badgesRef.current = badges }, [badges])

  useEffect(() => {
    if (!user) {
      setCats([])
      setBadges([])
      setCompletedMissions([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      fetchUserCats(user.id),
      fetchUserBadges(user.id),
      fetchUserMissions(user.id),
    ])
      .then(([catsData, badgeIds, missionsData]) => {
        setCats(catsData || [])
        setBadges(badgeIds || [])
        setCompletedMissions(missionsData.map(m => ({ id: m.mission_id, date: m.completed_date })) || [])
      })
      .catch(err => console.error('Failed to fetch cloud data:', err))
      .finally(() => setLoading(false))
  }, [user])

  const addCat = useCallback(async (catData) => {
    if (!user) throw new Error('Login required')
    const catId = crypto.randomUUID()
    const newCat = {
      ...catData,
      id: catId,
      user_id: user.id,
      created_at: new Date().toISOString(),
    }
    const photoUrl = await uploadPhoto(user.id, catId, catData.photo)
    newCat.photo = photoUrl
    await saveCatToCloud(newCat)
    setCats(prev => [newCat, ...prev])

    const allCats = [newCat, ...catsRef.current]
    const unlockedBadges = checkBadges(allCats, badgesRef.current)
    for (const id of unlockedBadges) {
      try {
        await unlockBadge(user.id, id)
        setBadges(prev => prev.includes(id) ? prev : [...prev, id])
      } catch {}
    }
    return { cat: newCat, newBadges: unlockedBadges }
  }, [user])

  const updateCat = useCallback(async (catId, updates) => {
    if (!user) throw new Error('Login required')
    await updateCatInCloud(catId, updates)
    setCats(prev => prev.map(c => c.id === catId ? { ...c, ...updates } : c))

    const allCats = catsRef.current.map(c => c.id === catId ? { ...c, ...updates } : c)
    const unlockedBadges = checkBadges(allCats, badgesRef.current)
    for (const id of unlockedBadges) {
      try {
        await unlockBadge(user.id, id)
        setBadges(prev => prev.includes(id) ? prev : [...prev, id])
      } catch {}
    }
    return { newBadges: unlockedBadges }
  }, [user])

  const deleteCat = useCallback(async (catId) => {
    if (!user) throw new Error('Login required')
    await deleteCatFromCloud(catId, user.id)
    setCats(prev => prev.filter(c => c.id !== catId))
  }, [user])

  const addBadge = useCallback(async (badgeId) => {
    if (!user) throw new Error('Login required')
    if (badgesRef.current.includes(badgeId)) return false
    await unlockBadge(user.id, badgeId)
    setBadges(prev => prev.includes(badgeId) ? prev : [...prev, badgeId])
    return true
  }, [user])

  const markMissionComplete = useCallback(async (mission) => {
    if (!user) throw new Error('Login required')
    const today = new Date().toISOString().split('T')[0]
    await completeMission(user.id, mission.id, today)
    setCompletedMissions(prev => [...prev, { id: mission.id, date: today }])
  }, [user])

  const xp = cats.length * 20 + badges.length * 50 +
    completedMissions
      .filter(m => m.date === new Date().toISOString().split('T')[0])
      .reduce((sum, m) => {
        const def = missions.find(d => d.id === m.id)
        return sum + (def?.reward || 0)
      }, 0)

  return {
    cats,
    badges,
    completedMissions,
    xp,
    level: calculateLevel(xp).level,
    loading,
    addCat,
    updateCat,
    deleteCat,
    addBadge,
    markMissionComplete,
  }
}
