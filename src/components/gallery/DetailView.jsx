import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  HiArrowLeft, HiHeart, HiOutlineHeart, HiShare,
  HiLocationMarker, HiClock, HiCalendar, HiPencil,
  HiCheck, HiTrash, HiX
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import useCloudData from '../../hooks/useCloudData'
import FramePicker from '../camera/FramePicker'
import catdex, { starsLabel } from '../../data/catdex'
import badges from '../../data/badges'

const frameBadges = {
  classic: 'bg-primary',
  pink: 'bg-pink-400',
  pixel: 'bg-success',
  nature: 'bg-emerald-500',
  neon: 'bg-[#00FF88] text-primary',
  halloween: 'bg-[#FF6B35]',
  christmas: 'bg-red-500',
  legendary: 'bg-[#FFD700] text-primary',
}

const frameNames = {
  classic: 'Classic',
  pink: 'Pink',
  pixel: 'Pixel',
  nature: 'Nature',
  neon: 'Neon',
  halloween: 'Halloween',
  christmas: 'Christmas',
  legendary: 'Legendary',
}

const frameOverlays = {
  classic: 'ring-4 ring-primary ring-inset',
  pink: 'ring-4 ring-pink-400 ring-inset shadow-[inset_0_0_20px_rgba(244,114,182,0.3)]',
  pixel: 'ring-4 ring-success ring-inset shadow-[inset_0_0_0_3px_rgba(107,203,119,0.3)]',
  nature: 'ring-4 ring-emerald-500/60 ring-inset',
  neon: 'ring-4 ring-[#00FF88] ring-inset shadow-[inset_0_0_24px_rgba(0,255,136,0.3)]',
  halloween: 'ring-4 ring-[#FF6B35] ring-inset shadow-[inset_0_0_20px_rgba(255,107,53,0.3)]',
  christmas: 'ring-4 ring-red-500 ring-inset shadow-[inset_0_0_20px_rgba(229,57,53,0.3)]',
  legendary: 'ring-4 ring-[#FFD700] ring-inset shadow-[inset_0_0_24px_rgba(255,215,0,0.4)]',
}

function DetailView({ cat, onClose, onShare }) {
  const navigate = useNavigate()
  const { updateCat, deleteCat } = useCloudData()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editStory, setEditStory] = useState('')
  const [editFrame, setEditFrame] = useState('')
  const [editColor, setEditColor] = useState('')
  const [editSpecies, setEditSpecies] = useState('')
  const [showFramePicker, setShowFramePicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [locationName, setLocationName] = useState(cat?.location_name || '')

  useEffect(() => {
    setEditName(cat?.name || '')
    setEditStory(cat?.story || '')
    setEditFrame(cat?.frame || 'classic')
    setEditColor(cat?.color || '')
    setEditSpecies(cat?.species || '')
  }, [cat])

  useEffect(() => {
    if (cat?.latitude && cat?.longitude && !cat?.location_name) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${cat.latitude}&lon=${cat.longitude}&format=json`,
        { headers: { 'Accept-Language': 'id' } }
      )
        .then(r => r.json())
        .then(data => {
          if (data.display_name) setLocationName(data.display_name)
        })
        .catch(() => {})
    }
  }, [cat?.latitude, cat?.longitude, cat?.location_name])

  if (!cat) return null

  const date = new Date(cat.created_at)
  const dateStr = date.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  })

  async function toggleFavorite() {
    try {
      await updateCat(cat.id, { favorite: !cat.favorite })
    } catch {}
  }

  function handleStartEdit() {
    setEditName(cat.name)
    setEditStory(cat.story || '')
    setEditFrame(cat.frame || 'classic')
    setEditColor(cat.color || '')
    setEditSpecies(cat.species || '')
    setEditing(true)
  }

  function handleCancelEdit() {
    setEditing(false)
  }

  function handleSaveEdit() {
    const trimmed = editName.trim()
    if (!trimmed) {
      toast.error('Nama kucing wajib diisi')
      return
    }
    updateCat(cat.id, {
      name: trimmed,
      story: editStory.trim(),
      frame: editFrame,
      color: editColor || null,
      species: editSpecies ? Number(editSpecies) : null,
    }).then(result => {
      setEditing(false)
      const newBadges = result?.newBadges || []
      if (newBadges.length > 0) {
        newBadges.forEach(badgeId => {
          const badge = badges.find(b => b.id === badgeId)
          if (!badge) return
          toast.custom((t) => (
            <div className="flex items-center gap-3 bg-primary text-on-dark rounded-2xl px-4 py-3 shadow-elevated min-w-[280px]">
              <span className="text-2xl">{badge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Badge Terbuka! +50XP</p>
                <p className="text-xs text-on-dark-muted">{badge.title}</p>
              </div>
              <button
                onClick={() => { toast.dismiss(t.id); navigate('/badges') }}
                className="px-3 py-1.5 rounded-full bg-brand-yellow text-primary text-xs font-semibold whitespace-nowrap"
              >
                Lihat
              </button>
            </div>
          ), { duration: 6000 })
        })
      } else {
        toast.success('Kucing berhasil diperbarui')
      }
    }).catch(err => {
      toast.error('Gagal memperbarui: ' + (err.message || 'Gagal'))
    })
  }

  async function handleDelete() {
    try {
      await deleteCat(cat.id)
      setShowDeleteConfirm(false)
      onClose()
      toast.success('Kucing berhasil dihapus')
    } catch (err) {
      toast.error('Gagal menghapus: ' + (err.message || 'Gagal'))
    }
  }

  function handleFrameSelect(frameId) {
    setEditFrame(frameId)
    setShowFramePicker(false)
  }

  const mapsUrl = cat.latitude && cat.longitude
    ? `https://maps.google.com/?q=${cat.latitude},${cat.longitude}`
    : null

  const colorStyles = {
    orange_tabby: 'bg-orange-400',
    brown_tabby: 'bg-amber-800',
    black: 'bg-gray-900',
    tuxedo: 'bg-gradient-to-r from-gray-900 via-white to-gray-900',
    white: 'bg-white border border-gray-200 text-primary',
    calico: 'bg-gradient-to-br from-orange-400 via-white to-gray-900',
    tortoiseshell: 'bg-gradient-to-br from-amber-800 via-orange-400 to-gray-900',
    gray: 'bg-gray-400',
    gray_white: 'bg-gradient-to-r from-gray-400 to-white',
    orange_white: 'bg-gradient-to-r from-orange-400 to-white',
    cream: 'bg-amber-100 border border-amber-200 text-primary',
    chocolate: 'bg-amber-900',
    seal_point: 'bg-gradient-to-b from-amber-800 via-white to-white text-primary',
    blue_point: 'bg-gradient-to-b from-gray-400 via-white to-white text-primary',
    golden_shaded: 'bg-amber-200 text-primary',
    silver_shaded: 'bg-gray-200 text-primary',
    chinchilla_silver: 'bg-gray-100 border border-gray-200 text-primary',
    blue_cream: 'bg-gradient-to-br from-gray-400 to-amber-100 text-primary',
    lilac: 'bg-purple-200 text-primary',
    cinnamon: 'bg-amber-600',
  }

  const colorLabels = {
    orange_tabby: 'Orange Tabby',
    brown_tabby: 'Brown Tabby',
    black: 'Black',
    tuxedo: 'Tuxedo',
    white: 'White',
    calico: 'Calico',
    tortoiseshell: 'Tortoiseshell',
    gray: 'Gray',
    gray_white: 'Gray & White',
    orange_white: 'Orange & White',
    cream: 'Cream',
    chocolate: 'Chocolate',
    seal_point: 'Seal Point',
    blue_point: 'Blue Point',
    golden_shaded: 'Golden Shaded',
    silver_shaded: 'Silver Shaded',
    chinchilla_silver: 'Chinchilla Silver',
    blue_cream: 'Blue Cream',
    lilac: 'Lilac',
    cinnamon: 'Cinnamon',
  }

  const editColors = [
    { id: 'orange_tabby', label: 'Orange Tabby', dot: 'bg-orange-400' },
    { id: 'brown_tabby', label: 'Brown Tabby', dot: 'bg-amber-800' },
    { id: 'black', label: 'Black', dot: 'bg-gray-900' },
    { id: 'tuxedo', label: 'Tuxedo', dot: 'bg-gradient-to-r from-gray-900 via-white to-gray-900' },
    { id: 'white', label: 'White', dot: 'bg-white border border-gray-200' },
    { id: 'calico', label: 'Calico', dot: 'bg-gradient-to-br from-orange-400 via-white to-gray-900' },
    { id: 'tortoiseshell', label: 'Tortoiseshell', dot: 'bg-gradient-to-br from-amber-800 via-orange-400 to-gray-900' },
    { id: 'gray', label: 'Gray', dot: 'bg-gray-400' },
    { id: 'gray_white', label: 'Gray & White', dot: 'bg-gradient-to-r from-gray-400 to-white' },
    { id: 'orange_white', label: 'Orange & White', dot: 'bg-gradient-to-r from-orange-400 to-white' },
    { id: 'cream', label: 'Cream', dot: 'bg-amber-100 border border-amber-200' },
    { id: 'chocolate', label: 'Chocolate', dot: 'bg-amber-900' },
    { id: 'seal_point', label: 'Seal Point', dot: 'bg-gradient-to-b from-amber-800 via-white to-white' },
    { id: 'blue_point', label: 'Blue Point', dot: 'bg-gradient-to-b from-gray-400 via-white to-white' },
    { id: 'golden_shaded', label: 'Golden Shaded', dot: 'bg-amber-200' },
    { id: 'silver_shaded', label: 'Silver Shaded', dot: 'bg-gray-200' },
    { id: 'chinchilla_silver', label: 'Chinchilla Silver', dot: 'bg-gray-100 border border-gray-200' },
    { id: 'blue_cream', label: 'Blue Cream', dot: 'bg-gradient-to-br from-gray-400 to-amber-100' },
    { id: 'lilac', label: 'Lilac', dot: 'bg-purple-200' },
    { id: 'cinnamon', label: 'Cinnamon', dot: 'bg-amber-600' },
  ]

  const speciesEntry = cat.species ? catdex.find(e => e.id === cat.species) : null
  const speciesName = speciesEntry?.name || null
  const speciesStars = speciesEntry ? starsLabel(speciesEntry.stars) : null

  const groups = [
    { label: 'Sangat Langka', stars: 5 },
    { label: 'Langka', stars: 4 },
    { label: 'Cukup Langka', stars: 3 },
    { label: 'Mulai Banyak', stars: 2 },
    { label: 'Sangat Mudah', stars: 1 },
  ]

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-40 bg-canvas flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center px-4 safe-top" style={{ height: 56 }}>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-primary">
          {editing ? 'Edit Kucing' : 'Detail'}
        </span>
        {editing ? (
          <button
            onClick={handleSaveEdit}
            className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
          >
            <HiCheck size={22} />
          </button>
        ) : (
          <button
            onClick={handleStartEdit}
            className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
          >
            <HiPencil size={20} />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo */}
        <div className="px-4 pb-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface relative">
            <img
              src={cat.photo}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {editing && (
              <div className={`absolute inset-0 ${frameOverlays[editFrame] || frameOverlays.classic}`} />
            )}
          </div>
          {editing && (
            <button
              onClick={() => setShowFramePicker(true)}
              className="mt-2 w-full py-2 rounded-xl border border-hairline text-sm text-slate font-medium active:scale-[0.98] transition-transform"
            >
              Ganti Frame ({frameNames[editFrame] || editFrame})
            </button>
          )}
        </div>

        {/* Info */}
        <div className="px-5 space-y-4 pb-6">
          {/* Name + Favorite or Edit Name */}
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
                  Nama Kucing <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nama kucing"
                  className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                  maxLength={50}
                  autoFocus
                />
              </div>

              {/* Color picker (edit mode) */}
              <div>
                <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">Warna</label>
                <div className="flex gap-2 flex-wrap">
                  {editColors.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEditColor(editColor === c.id ? '' : c.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all
                        ${editColor === c.id
                          ? 'bg-primary text-on-dark ring-2 ring-primary'
                          : 'bg-surface text-slate border border-hairline hover:border-hairline-strong'
                        }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Species dropdown (edit mode) */}
              <div>
                <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">Ras / Spesies</label>
                <select
                  value={editSpecies}
                  onChange={(e) => setEditSpecies(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white appearance-none"
                >
                  <option value="">Pilih ras (opsional)</option>
                  {groups.map(group => (
                    <optgroup key={group.stars} label={`${starsLabel(group.stars)} ${group.label}`}>
                      {catdex
                        .filter((e) => e.stars === group.stars)
                        .map(entry => (
                          <option key={entry.id} value={entry.id}>
                            {entry.name} — {entry.desc}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">{cat.name}</h1>
              <button
                onClick={toggleFavorite}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
              >
                {cat.favorite ? (
                  <HiHeart size={24} className="text-danger" />
                ) : (
                  <HiOutlineHeart size={24} className="text-slate" />
                )}
              </button>
            </div>
          )}

          {/* Frame badge */}
          {!editing && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-on-dark ${frameBadges[cat.frame] || frameBadges.classic}`}>
                {frameNames[cat.frame] || cat.frame}
              </span>
            </div>
          )}

          {/* Color & Species badges (view mode) */}
          {!editing && (cat.color || cat.species) && (
            <div className="flex items-center gap-2">
              {cat.color && (
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-on-dark ${colorStyles[cat.color] || 'bg-slate'}`}>
                  {colorLabels[cat.color] || cat.color}
                </span>
              )}
              {speciesName && (
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-surface text-slate border border-hairline">
                  {speciesStars && <span className="mr-1">{speciesStars}</span>}{speciesName}
                </span>
              )}
            </div>
          )}

          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-slate">
              <HiCalendar size={16} className="text-steel" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate">
              <HiClock size={16} className="text-steel" />
              <span>{timeStr}</span>
            </div>
            {cat.latitude && cat.longitude && (
              <div className="flex items-start gap-2.5 text-sm text-slate">
                <HiLocationMarker size={16} className="text-steel mt-0.5" />
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {locationName || `${cat.latitude.toFixed(4)}, ${cat.longitude.toFixed(4)}`}
                  </a>
                ) : (
                  <span>{locationName || `${cat.latitude.toFixed(4)}, ${cat.longitude.toFixed(4)}`}</span>
                )}
              </div>
            )}
          </div>

          {/* Story or Edit Story */}
          {editing ? (
            <div>
              <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
                Cerita (opsional)
              </label>
              <textarea
                value={editStory}
                onChange={(e) => setEditStory(e.target.value)}
                placeholder="Cerita tentang kucing ini..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors resize-none"
                maxLength={200}
              />
            </div>
          ) : (
            cat.story && (
              <div className="bg-surface rounded-2xl px-4 py-3">
                <p className="text-sm text-charcoal leading-relaxed">{cat.story}</p>
              </div>
            )
          )}

          {/* Edit action buttons */}
          {editing && (
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCancelEdit}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-hairline text-sm text-slate font-medium active:scale-[0.98] transition-transform"
              >
                <HiX size={18} />
                Batal
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-danger text-on-dark text-sm font-medium active:scale-[0.98] transition-transform"
              >
                <HiTrash size={18} />
                Hapus
              </button>
            </div>
          )}

          {/* Share button (non-edit) */}
          {!editing && (
            <button
              onClick={() => onShare(cat)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-hairline text-sm text-slate font-medium active:scale-[0.98] transition-transform"
            >
              <HiShare size={18} />
              Bagikan
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-canvas rounded-3xl p-6 w-full max-w-xs shadow-elevated"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                <HiTrash size={24} className="text-danger" />
              </div>
              <h3 className="text-lg font-bold text-primary">Hapus Kucing?</h3>
              <p className="text-sm text-slate">
                Kucing ini akan dihapus permanen. Data tidak bisa dikembalikan.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-full border border-hairline text-sm text-slate font-medium active:scale-[0.98] transition-transform"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-full bg-danger text-on-dark text-sm font-medium active:scale-[0.98] transition-transform"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Frame Picker Sheet */}
      <FramePicker
        isOpen={showFramePicker}
        onClose={() => setShowFramePicker(false)}
        onSelect={handleFrameSelect}
        previewImage={cat.photo}
      />
    </motion.div>
  )
}

export default DetailView
