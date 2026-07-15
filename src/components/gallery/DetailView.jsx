import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiArrowLeft, HiHeart, HiOutlineHeart, HiShare,
  HiLocationMarker, HiClock, HiCalendar, HiPencil,
  HiCheck, HiTrash, HiX
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import useLocalStorage from '../../hooks/useLocalStorage'
import FramePicker from '../camera/FramePicker'

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
  const { updateCat, deleteCat } = useLocalStorage()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editStory, setEditStory] = useState('')
  const [editFrame, setEditFrame] = useState('')
  const [showFramePicker, setShowFramePicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [locationName, setLocationName] = useState(cat?.location_name || '')

  useEffect(() => {
    setEditName(cat?.name || '')
    setEditStory(cat?.story || '')
    setEditFrame(cat?.frame || 'classic')
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

  function toggleFavorite() {
    updateCat(cat.id, { favorite: !cat.favorite })
  }

  function handleStartEdit() {
    setEditName(cat.name)
    setEditStory(cat.story || '')
    setEditFrame(cat.frame || 'classic')
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
    })
    setEditing(false)
    toast.success('Kucing berhasil diperbarui')
  }

  function handleDelete() {
    deleteCat(cat.id)
    setShowDeleteConfirm(false)
    onClose()
    toast.success('Kucing berhasil dihapus')
  }

  function handleFrameSelect(frameId) {
    setEditFrame(frameId)
    setShowFramePicker(false)
  }

  const mapsUrl = cat.latitude && cat.longitude
    ? `https://maps.google.com/?q=${cat.latitude},${cat.longitude}`
    : null

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
