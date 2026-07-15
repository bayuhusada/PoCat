import { supabase } from './supabase'

function base64ToBlob(base64DataUrl) {
  const [header, base64] = base64DataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i)
  return new Blob([array], { type: mime })
}

export function compressImage(base64DataUrl, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let w = img.width
      let h = img.height
      if (w > maxWidth) {
        h = (h / w) * maxWidth
        w = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => reject(new Error('Gagal memuat gambar'))
    img.src = base64DataUrl
  })
}

export async function uploadPhoto(userId, catId, base64DataUrl) {
  const compressed = await compressImage(base64DataUrl)
  const blob = base64ToBlob(compressed)
  const filePath = `${userId}/${catId}.jpg`
  const { error } = await supabase.storage
    .from('cat-photos')
    .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data: { signedUrl }, error: signedError } = await supabase.storage
    .from('cat-photos')
    .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10)
  if (signedError) throw signedError
  return signedUrl
}

export async function saveCatToCloud(cat) {
  const { error } = await supabase
    .from('cats')
    .upsert({
      id: cat.id,
      user_id: cat.user_id,
      name: cat.name,
      story: cat.story || '',
      photo: cat.photo,
      frame: cat.frame || 'classic',
      latitude: cat.latitude,
      longitude: cat.longitude,
      location_name: cat.location_name || '',
      color: cat.color,
      species: cat.species,
      favorite: cat.favorite || false,
      created_at: cat.created_at,
    })
  if (error) throw error
}

export async function updateCatInCloud(catId, updates) {
  const { error } = await supabase
    .from('cats')
    .update(updates)
    .eq('id', catId)
  if (error) throw error
}

export async function deleteCatFromCloud(catId, userId) {
  const { data, error: dbError } = await supabase
    .from('cats')
    .delete()
    .eq('id', catId)
    .select()
  if (dbError) throw dbError
  if (!data || data.length === 0) throw new Error('Catatan tidak ditemukan atau sudah dihapus')

  const filePath = `${userId}/${catId}.jpg`
  const { error: storageError } = await supabase.storage
    .from('cat-photos')
    .remove([filePath])
  if (storageError) throw storageError
}

export async function fetchUserCats(userId) {
  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function migrateLocalToCloud(userId, localCats) {
  if (!localCats || localCats.length === 0) return 0
  let count = 0
  for (const cat of localCats) {
    try {
      const photoUrl = await uploadPhoto(userId, cat.id, cat.photo)
      await saveCatToCloud({
        ...cat,
        photo: photoUrl,
        user_id: userId,
      })
      count++
    } catch (err) {
      console.error('Migration failed for cat', cat.id, err)
    }
  }
  return count
}

export async function fetchUserBadges(userId) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map(r => r.badge_id)
}

export async function unlockBadge(userId, badgeId) {
  const { error } = await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badgeId })
  if (error) throw error
}

export async function fetchUserMissions(userId) {
  const { data, error } = await supabase
    .from('user_missions')
    .select('mission_id, completed_date')
    .eq('user_id', userId)
  if (error) throw error
  return data || []
}

export async function completeMission(userId, missionId, date) {
  const { error } = await supabase
    .from('user_missions')
    .insert({ user_id: userId, mission_id: missionId, completed_date: date })
  if (error) throw error
}
