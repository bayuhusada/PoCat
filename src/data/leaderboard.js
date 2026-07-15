export function getLeaderboard(userCats) {
  return [{
    name: 'Kamu',
    totalCats: userCats,
    avatar: null,
    isUser: true,
    rank: 1,
  }]
}
