import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'pocat_data'
const EVENT_KEY = 'pocat_data_changed'

function getStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : getDefaultData()
  } catch {
    return getDefaultData()
  }
}

function getDefaultData() {
  return { cats: [], badges: [], xp: 0, totalCats: 0 }
}

function notifyChange() {
  try {
    window.dispatchEvent(new CustomEvent(EVENT_KEY))
  } catch {}
}

export default function useLocalStorage() {
  const [data, setData] = useState(getStoredData)

  useEffect(() => {
    const handler = () => setData(getStoredData())
    window.addEventListener(EVENT_KEY, handler)
    return () => window.removeEventListener(EVENT_KEY, handler)
  }, [])

  const addCat = useCallback((cat) => {
    const newCat = {
      ...cat,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    setData(prev => {
      const next = {
        ...prev,
        cats: [...prev.cats, newCat],
        xp: (prev.xp || 0) + 20,
        totalCats: (prev.totalCats || 0) + 1,
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    notifyChange()
    return newCat
  }, [])

  const addBadge = useCallback((badgeId) => {
    let unlocked = false
    setData(prev => {
      if (prev.badges.includes(badgeId)) return prev
      unlocked = true
      const next = {
        ...prev,
        badges: [...prev.badges, badgeId],
        xp: (prev.xp || 0) + 50,
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    notifyChange()
    return unlocked
  }, [])

  const getCats = useCallback(() => {
    return getStoredData().cats || []
  }, [])

  const getCatById = useCallback((id) => {
    return (getStoredData().cats || []).find(c => c.id === id) || null
  }, [])

  const updateCat = useCallback((id, updates) => {
    setData(prev => {
      const cats = prev.cats.map(c => c.id === id ? { ...c, ...updates } : c)
      const next = { ...prev, cats }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    notifyChange()
  }, [])

  const deleteCat = useCallback((id) => {
    setData(prev => {
      const cats = prev.cats.filter(c => c.id !== id)
      const next = {
        ...prev,
        cats,
        totalCats: cats.length,
        xp: Math.max(0, (prev.xp || 0) - 20),
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    notifyChange()
  }, [])

  const mergeCats = useCallback((newCats) => {
    setData(prev => {
      const existing = new Map(prev.cats.map(c => [c.id, c]))
      newCats.forEach(c => existing.set(c.id, c))
      const merged = Array.from(existing.values())
      const next = { ...prev, cats: merged }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    notifyChange()
  }, [])

  return {
    data,
    addCat,
    addBadge,
    getCats,
    getCatById,
    updateCat,
    deleteCat,
    mergeCats,
    setData,
  }
}
