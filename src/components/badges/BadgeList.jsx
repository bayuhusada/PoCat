import badges from '../../data/badges'
import { HiBadgeCheck } from 'react-icons/hi'

function BadgeList({ earnedBadges }) {
  const earned = new Set(earnedBadges)
  const earnedCount = badges.filter(b => earned.has(b.id)).length

  if (earnedCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-pastel-coral flex items-center justify-center">
          <HiBadgeCheck size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Badges</h2>
        <p className="text-slate text-sm text-center max-w-[220px]">
          Kumpulkan badge dengan menemukan kucing!
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-semibold text-primary">Badges</h2>
        <p className="text-sm text-slate mt-0.5">
          {earnedCount} / {badges.length} terkumpul
        </p>
      </div>

      {/* Badge grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const isEarned = earned.has(badge.id)
            return (
              <div
                key={badge.id}
                className={`
                  rounded-3xl p-4 flex flex-col items-center text-center gap-2
                  transition-all duration-200 border-2
                  ${isEarned
                    ? 'bg-canvas border-primary shadow-card'
                    : 'bg-surface border-hairline opacity-50'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-2xl
                  ${isEarned ? 'bg-pastel-yellow' : 'bg-hairline'}
                `}>
                  {isEarned ? badge.icon : '🔒'}
                </div>
                <h3 className={`text-sm font-semibold ${isEarned ? 'text-primary' : 'text-slate'}`}>
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate leading-tight">
                  {badge.description}
                </p>
                {!isEarned && (
                  <span className="text-[10px] text-steel font-semibold uppercase tracking-wider mt-1">
                    Belum
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BadgeList
