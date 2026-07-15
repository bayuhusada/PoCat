const XP_PER_LEVEL = 100

export function calculateLevel(xp = 0) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpInLevel = xp % XP_PER_LEVEL
  return {
    level,
    xpInLevel,
    xpForNext: XP_PER_LEVEL,
    progress: xpInLevel / XP_PER_LEVEL,
  }
}

export function getTotalXP(cats = [], badges = []) {
  const fromCats = cats.length * 20
  const fromBadges = badges.length * 50
  return fromCats + fromBadges
}

export function checkBadges(cats = [], currentBadges = []) {
  const unlocked = []
  const totalCats = cats.length

  if (totalCats >= 0) {
    if (totalCats >= 1 && !currentBadges.includes('first_cat')) unlocked.push('first_cat')
    if (totalCats >= 5 && !currentBadges.includes('cat_lover')) unlocked.push('cat_lover')
    if (totalCats >= 10 && !currentBadges.includes('ten_cats')) unlocked.push('ten_cats')
    if (totalCats >= 50 && !currentBadges.includes('fifty_cats')) unlocked.push('fifty_cats')
    if (totalCats >= 100 && !currentBadges.includes('hundred_cats')) unlocked.push('hundred_cats')
  }

  const orangeCount = cats.filter(c => {
    if (c.color) return c.color === 'orange'
    return /orange|oyen|kuning|ginger/i.test(c.name)
  }).length
  if (orangeCount >= 3 && !currentBadges.includes('orange_collector')) unlocked.push('orange_collector')

  const blackCount = cats.filter(c => {
    if (c.color) return c.color === 'black'
    return /black|hitam|item|blackie/i.test(c.name)
  }).length
  if (blackCount >= 3 && !currentBadges.includes('black_collector')) unlocked.push('black_collector')

  const locations = new Set(cats.filter(c => c.latitude).map(c => `${c.latitude.toFixed(2)},${c.longitude.toFixed(2)}`))
  if (locations.size >= 5 && !currentBadges.includes('explorer')) unlocked.push('explorer')

  const nightCats = cats.filter(c => {
    const catHour = new Date(c.created_at).getHours()
    return catHour >= 18 || catHour < 5
  })
  if (nightCats.length >= 1 && !currentBadges.includes('night_hunter')) unlocked.push('night_hunter')

  const rainCats = cats.filter(c =>
    /hujan|rain|ujan|gerimis|deras/i.test(c.story || '')
  )
  if (rainCats.length >= 1 && !currentBadges.includes('rain_hunter')) unlocked.push('rain_hunter')

  return unlocked
}
