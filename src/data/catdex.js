const catdex = [
  { id: 1, name: 'Oyen', keywords: ['oyen', 'orange', 'kuning', 'ginger'] },
  { id: 2, name: 'Black', keywords: ['black', 'hitam', 'item', 'blackie'] },
  { id: 3, name: 'White', keywords: ['white', 'putih', 'susu', 'snow'] },
  { id: 4, name: 'Persian', keywords: ['persian', 'persia'] },
  { id: 5, name: 'Angora', keywords: ['angora', 'anggora'] },
  { id: 6, name: 'Tabby', keywords: ['tabby', 'belang', 'striped'] },
  { id: 7, name: 'Calico', keywords: ['calico', 'telon', 'tiga warna'] },
  { id: 8, name: 'Siamese', keywords: ['siamese', 'siam'] },
  { id: 9, name: 'Grey', keywords: ['grey', 'gray', 'abu', 'abby'] },
  { id: 10, name: 'Tuxedo', keywords: ['tuxedo', 'tuksedo', 'jas'] },
  { id: 11, name: 'Ragdoll', keywords: ['ragdoll'] },
  { id: 12, name: 'Sphynx', keywords: ['sphynx', 'sphinx', 'botak'] },
  { id: 13, name: 'Maine Coon', keywords: ['maine', 'coon'] },
  { id: 14, name: 'Bengal', keywords: ['bengal'] },
  { id: 15, name: 'Scottish Fold', keywords: ['scottish', 'fold', 'scot'] },
  { id: 16, name: 'British Shorthair', keywords: ['british'] },
  { id: 17, name: 'Himalayan', keywords: ['himalaya', 'himalayan'] },
  { id: 18, name: 'Birman', keywords: ['birman'] },
  { id: 19, name: 'Norwegian Forest', keywords: ['norwegian', 'norwegia'] },
  { id: 20, name: 'Munchkin', keywords: ['munchkin'] },
]

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
