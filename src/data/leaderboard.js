const mockUsers = [
  { name: 'Andi', totalCats: 120, avatar: null },
  { name: 'Budi', totalCats: 98, avatar: null },
  { name: 'Citra', totalCats: 87, avatar: null },
  { name: 'Doni', totalCats: 76, avatar: null },
  { name: 'Eka', totalCats: 65, avatar: null },
  { name: 'Farah', totalCats: 54, avatar: null },
  { name: 'Gilang', totalCats: 43, avatar: null },
  { name: 'Hana', totalCats: 32, avatar: null },
  { name: 'Indra', totalCats: 21, avatar: null },
  { name: 'Joko', totalCats: 15, avatar: null },
]

export function getLeaderboard(userCats) {
  const userEntry = {
    name: 'Kamu',
    totalCats: userCats,
    avatar: null,
    isUser: true,
  }

  const all = [...mockUsers, userEntry]
    .filter(e => e.totalCats > 0)
    .sort((a, b) => b.totalCats - a.totalCats)

  return all.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))
}

export default mockUsers
