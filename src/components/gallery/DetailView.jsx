import { motion } from 'framer-motion'
import { HiArrowLeft, HiHeart, HiOutlineHeart, HiShare, HiLocationMarker, HiClock, HiCalendar } from 'react-icons/hi'
import useLocalStorage from '../../hooks/useLocalStorage'

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

function DetailView({ cat, onClose, onShare }) {
  const { updateCat } = useLocalStorage()

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
        <span className="flex-1 text-center text-sm font-semibold text-primary">Detail</span>
        <button
          onClick={() => onShare(cat)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiShare size={20} />
        </button>
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
          </div>
        </div>

        {/* Info */}
        <div className="px-5 space-y-4 pb-6">
          {/* Name + Favorite */}
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

          {/* Frame badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-on-dark ${frameBadges[cat.frame] || frameBadges.classic}`}>
              {frameNames[cat.frame] || cat.frame}
            </span>
          </div>

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
              <div className="flex items-center gap-2.5 text-sm text-slate">
                <HiLocationMarker size={16} className="text-steel" />
                <span>
                  {cat.latitude.toFixed(4)}, {cat.longitude.toFixed(4)}
                  {cat.location_name ? ` - ${cat.location_name}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Story */}
          {cat.story && (
            <div className="bg-surface rounded-2xl px-4 py-3">
              <p className="text-sm text-charcoal leading-relaxed">{cat.story}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default DetailView
