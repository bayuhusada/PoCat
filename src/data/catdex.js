const catdex = [
  { id: 1,  name: 'Savannah',           stars: 5, desc: 'Hanya sedikit breeder, harga sangat mahal', keywords: ['savannah'] },
  { id: 2,  name: 'Toyger',             stars: 5, desc: 'Sangat jarang di Indonesia', keywords: ['toyger'] },
  { id: 3,  name: 'Lykoi',              stars: 5, desc: 'Dijuluki werewolf cat', keywords: ['lykoi', 'werewolf'] },
  { id: 4,  name: 'Peterbald',          stars: 5, desc: 'Kucing tanpa bulu asal Rusia', keywords: ['peterbald'] },
  { id: 5,  name: 'Egyptian Mau',       stars: 5, desc: 'Ras alami yang sangat langka', keywords: ['egyptian', 'mau'] },
  { id: 6,  name: 'Khao Manee',         stars: 5, desc: 'Mata indah, berasal dari Thailand', keywords: ['khao', 'manee'] },
  { id: 7,  name: 'Kurilian Bobtail',   stars: 5, desc: 'Ekor pendek alami', keywords: ['kurilian', 'bobtail'] },
  { id: 8,  name: 'Ocicat',            stars: 5, desc: 'Mirip kucing liar tetapi jinak', keywords: ['ocicat'] },
  { id: 9,  name: 'Ukrainian Levkoy',  stars: 5, desc: 'Hampir tidak ada breeder lokal', keywords: ['ukrainian', 'levkoy'] },
  { id: 10, name: 'Donskoy',           stars: 5, desc: 'Ras tanpa bulu asal Rusia', keywords: ['donskoy'] },
  { id: 11, name: 'Devon Rex',         stars: 4, desc: 'Bulu keriting, telinga besar', keywords: ['devon', 'rex'] },
  { id: 12, name: 'Cornish Rex',       stars: 4, desc: 'Bulu sangat pendek dan keriting', keywords: ['cornish', 'rex'] },
  { id: 13, name: 'Selkirk Rex',       stars: 4, desc: 'Bulu keriting tebal', keywords: ['selkirk', 'rex'] },
  { id: 14, name: 'LaPerm',            stars: 4, desc: 'Memiliki bulu ikal alami', keywords: ['laperm'] },
  { id: 15, name: 'Japanese Bobtail',  stars: 4, desc: 'Populer di Jepang tetapi sedikit di Indonesia', keywords: ['japanese', 'bobtail'] },
  { id: 16, name: 'Norwegian Forest',  stars: 4, desc: 'Tubuh besar dan berbulu tebal', keywords: ['norwegian', 'norwegia', 'forest'] },
  { id: 17, name: 'Siberian',          stars: 4, desc: 'Ras asli Rusia', keywords: ['siberian', 'siberia'] },
  { id: 18, name: 'Birman',            stars: 4, desc: 'Mata biru dengan kaki putih', keywords: ['birman'] },
  { id: 19, name: 'Havana Brown',      stars: 4, desc: 'Warna cokelat khas', keywords: ['havana', 'brown'] },
  { id: 20, name: 'Chartreux',         stars: 4, desc: 'Ras asal Prancis', keywords: ['chartreux'] },
  { id: 21, name: 'Burmese',           stars: 3, desc: 'Mulai dikenal di Indonesia', keywords: ['burmese'] },
  { id: 22, name: 'Burmilla',          stars: 3, desc: 'Hasil persilangan Burmese dan Chinchilla', keywords: ['burmilla'] },
  { id: 23, name: 'Abyssinian',        stars: 3, desc: 'Aktif dan sangat cerdas', keywords: ['abyssinian', 'abby'] },
  { id: 24, name: 'Somali',            stars: 3, desc: 'Versi berbulu panjang Abyssinian', keywords: ['somali'] },
  { id: 25, name: 'Balinese',          stars: 3, desc: 'Mirip Siamese berbulu panjang', keywords: ['balinese'] },
  { id: 26, name: 'Oriental Shorthair',stars: 3, desc: 'Banyak variasi warna', keywords: ['oriental'] },
  { id: 27, name: 'Tonkinese',         stars: 3, desc: 'Campuran Siamese dan Burmese', keywords: ['tonkinese'] },
  { id: 28, name: 'Turkish Van',       stars: 3, desc: 'Suka bermain air', keywords: ['turkish', 'van'] },
  { id: 29, name: 'Turkish Angora',    stars: 3, desc: 'Angora asli, berbeda dengan anggora mix', keywords: ['turkish', 'angora'] },
  { id: 30, name: 'American Curl',     stars: 3, desc: 'Telinga melengkung ke belakang', keywords: ['american', 'curl'] },
  { id: 31, name: 'American Shorthair',stars: 3, desc: 'Tubuh kekar dan sehat', keywords: ['american'] },
  { id: 32, name: 'Exotic Shorthair',  stars: 3, desc: 'Persia berbulu pendek', keywords: ['exotic'] },
  { id: 33, name: 'Munchkin',          stars: 2, desc: 'Berkaki pendek', keywords: ['munchkin'] },
  { id: 34, name: 'Russian Blue',      stars: 2, desc: 'Warna abu-abu kebiruan', keywords: ['russian', 'blue'] },
  { id: 35, name: 'Ragdoll',           stars: 2, desc: 'Sangat lembut dan penyayang', keywords: ['ragdoll'] },
  { id: 36, name: 'Bengal',            stars: 2, desc: 'Corak seperti macan tutul', keywords: ['bengal'] },
  { id: 37, name: 'Siamese',           stars: 2, desc: 'Sangat vokal dan aktif', keywords: ['siamese', 'siam'] },
  { id: 38, name: 'Scottish Fold',     stars: 2, desc: 'Telinga terlipat khas', keywords: ['scottish', 'fold', 'scot'] },
  { id: 39, name: 'Maine Coon',        stars: 1, desc: 'Salah satu ras besar paling populer', keywords: ['maine', 'coon'] },
  { id: 40, name: 'British Shorthair', stars: 1, desc: 'Tubuh bulat dan berbulu tebal', keywords: ['british'] },
  { id: 41, name: 'Anggora',           stars: 1, desc: 'Salah satu ras paling populer di Indonesia', keywords: ['angora', 'anggora'] },
  { id: 42, name: 'Persian',           stars: 1, desc: 'Ras paling populer di kalangan pecinta kucing', keywords: ['persian', 'persia'] },
  { id: 43, name: 'Kucing Kampung',    stars: 1, desc: 'Paling banyak ditemui di seluruh Indonesia', keywords: ['kampung', 'domestic', 'local'] },
]

export function starsLabel(stars) {
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars)
}

export function starsLevel(stars) {
  const map = { 5: 'Sangat Langka', 4: 'Langka', 3: 'Cukup Langka', 2: 'Mulai Banyak', 1: 'Sangat Mudah' }
  return map[stars] || ''
}

export function matchCatToDex(catName) {
  const name = catName.toLowerCase()
  for (const entry of catdex) {
    if (entry.keywords.some(k => name.includes(k))) {
      return entry.id
    }
  }
  return null
}

export function getCatDexEntries(cats) {
  const foundIds = new Set()
  cats.forEach(cat => {
    if (cat.species) {
      foundIds.add(cat.species)
    } else {
      const match = matchCatToDex(cat.name)
      if (match) foundIds.add(match)
    }
  })
  return catdex.map(entry => ({
    ...entry,
    found: foundIds.has(entry.id),
    discovered: cats.filter(c => {
      if (c.species) return c.species === entry.id
      return matchCatToDex(c.name) === entry.id
    }),
  }))
}

export default catdex