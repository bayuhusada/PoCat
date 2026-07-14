const missions = [
  {
    id: 'daily_photo',
    title: 'Foto Kucing Hari Ini',
    description: 'Ambil foto kucing baru',
    icon: '📸',
    check: (catsToday) => catsToday >= 1,
    reward: 20,
  },
  {
    id: 'daily_orange',
    title: 'Pemburu Oyen',
    description: 'Temukan kucing orange',
    icon: '🟠',
    check: (catsToday) => catsToday.some(c => /orange|oyen|kuning|ginger/i.test(c.name)),
    reward: 50,
  },
  {
    id: 'daily_three',
    title: 'Triple Capture',
    description: 'Koleksi 3 kucing hari ini',
    icon: '🐱',
    check: (catsToday) => catsToday.length >= 3,
    reward: 100,
  },
  {
    id: 'daily_explore',
    title: 'Jelajah',
    description: 'Temukan kucing di lokasi baru',
    icon: '🗺️',
    check: (catsToday) => {
      const locs = new Set(catsToday.filter(c => c.latitude).map(c => `${c.latitude.toFixed(2)},${c.longitude.toFixed(2)}`))
      return locs.size >= 2
    },
    reward: 75,
  },
]

export function getDailyMission() {
  const today = new Date().toDateString()
  const dayIndex = missions.length > 0
    ? Math.abs(today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % missions.length
    : 0
  return missions[dayIndex]
}

export function isMissionCompleted(missionId, completedMissions = []) {
  const today = new Date().toDateString()
  return completedMissions.some(m => m.id === missionId && m.date === today)
}

export function checkMissionCompletion(mission, cats, completedMissions) {
  const today = new Date().toDateString()
  if (completedMissions.some(m => m.id === mission.id && m.date === today)) return false

  const catsToday = cats.filter(c => {
    const catDate = new Date(c.created_at).toDateString()
    return catDate === today
  })

  if (mission.check(catsToday)) {
    return true
  }
  return false
}

export default missions
