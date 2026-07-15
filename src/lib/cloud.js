import { supabase } from './supabase'

function base64ToBlob(base64DataUrl) {
  const [header, base64] = base64DataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i)
  return new Blob([array], { type: mime })
}

export async function uploadPhoto(userId, catId, base64DataUrl) {
  const blob = base64ToBlob(base64DataUrl)
  const filePath = `${userId}/${catId}.jpg`
  const { error } = await supabase.storage
    .from('cat-photos')
    .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage
    .from('cat-photos')
    .getPublicUrl(filePath)
  return publicUrl
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
  const { error: dbError } = await supabase
    .from('cats')
    .delete()
    .eq('id', catId)
  if (dbError) throw dbError

  const filePath = `${userId}/${catId}.jpg`
  const { error: storageError } = await supabase.storage
    .from('cat-photos')
    .remove([filePath])
  if (storageError) throw storageError
}
