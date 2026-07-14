import { useState, useCallback } from 'react'

const STORAGE_KEY = 'pocat_data'

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

export default function useLocalStorage() {
  const [data, setData] = useState(getStoredData)

  const persist = useCallback((newData) => {
    setData(newData)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch (err) {
      console.error('Failed to save to localStorage:', err)
    }
  }, [])

  const addCat = useCallback((cat) => {
    const newCat = {
      ...cat,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    persist({
      ...getStoredData(),
      cats: [...getStoredData().cats, newCat],
      xp: (getStoredData().xp || 0) + 20,
      totalCats: (getStoredData().totalCats || 0) + 1,
    })
    return newCat
  }, [persist])

  const addBadge = useCallback((badgeId) => {
    const current = getStoredData()
    if (current.badges.includes(badgeId)) return false
    persist({
      ...current,
      badges: [...current.badges, badgeId],
      xp: (current.xp || 0) + 50,
    })
    return true
  }, [persist])

  const getCats = useCallback(() => {
    return getStoredData().cats || []
  }, [])

  const getCatById = useCallback((id) => {
    return (getStoredData().cats || []).find(c => c.id === id) || null
  }, [])

  const updateCat = useCallback((id, updates) => {
    const current = getStoredData()
    const cats = (current.cats || []).map(c => c.id === id ? { ...c, ...updates } : c)
    persist({ ...current, cats })
  }, [persist])

  const deleteCat = useCallback((id) => {
    const current = getStoredData()
    const cats = (current.cats || []).filter(c => c.id !== id)
    persist({ ...current, cats, totalCats: cats.length })
  }, [persist])

  return {
    data,
    addCat,
    addBadge,
    getCats,
    getCatById,
    updateCat,
    deleteCat,
  }
}
