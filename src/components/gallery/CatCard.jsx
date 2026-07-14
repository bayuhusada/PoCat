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

function CatCard({ cat, onTap }) {
  const date = new Date(cat.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <button
      onClick={() => onTap(cat)}
      className="w-full text-left rounded-3xl overflow-hidden bg-canvas border border-hairline-soft shadow-card active:scale-[0.97] transition-transform"
    >
      {/* Photo */}
      <div className="aspect-square relative overflow-hidden bg-surface">
        <img
          src={cat.photo}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 space-y-1">
        <h3 className="text-sm font-semibold text-primary truncate">
          {cat.name}
        </h3>
        <p className="text-[11px] text-slate">{date}</p>
        {cat.location_name && (
          <p className="text-[11px] text-slate truncate">{cat.location_name}</p>
        )}
        <div className="flex items-center gap-1 pt-0.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-on-dark ${frameBadges[cat.frame] || frameBadges.classic}`}>
            {frameNames[cat.frame] || cat.frame}
          </span>
        </div>
      </div>
    </button>
  )
}

export default CatCard
