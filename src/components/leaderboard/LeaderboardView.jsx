import { motion } from 'framer-motion'
import { HiArrowLeft, HiStar, HiUser } from 'react-icons/hi'
import useAuth from '../../hooks/useAuth'

function LeaderboardView({ userCats, cloudCats, entries, onClose }) {
  const { user, profile } = useAuth()
  const displayCats = cloudCats !== null ? Math.max(userCats, cloudCats) : userCats
  const isLoggedIn = !!user
  const displayName = profile?.username || user?.email || 'Player'
  const displayInitial = displayName[0].toUpperCase()

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
        <span className="flex-1 text-center text-sm font-semibold text-primary">Leaderboard</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
        {isLoggedIn ? (
          <>
            {/* User card */}
            <div className="w-full bg-primary rounded-3xl p-5 shadow-card text-center mb-6 mt-2">
              <div className="w-14 h-14 rounded-full bg-brand-yellow text-primary flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {displayInitial}
              </div>
              <p className="text-on-dark font-semibold text-base">{displayName}</p>
              <p className="text-3xl font-bold text-brand-yellow mt-2">{displayCats}</p>
              <p className="text-on-dark-muted text-sm mt-1">kucing dikoleksi</p>
            </div>

            {entries && entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map((entry, i) => (
                  <div
                    key={entry.name + i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                      entry.isUser ? 'bg-brand-yellow/20 border border-brand-yellow' : 'bg-surface'
                    }`}
                  >
                    <span className="w-6 text-center text-sm font-bold text-slate">#{entry.rank}</span>
                    <div className="w-9 h-9 rounded-full bg-primary text-on-dark flex items-center justify-center text-xs font-bold">
                      {entry.name[0].toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm font-medium text-primary">{entry.name}</span>
                    <span className="text-sm font-bold text-primary">{entry.totalCats}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate text-sm text-center mt-8">
                Belum ada pemain lain. Ajak temanmu untuk hunting kucing!
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full max-w-xs mx-auto mt-16">
            <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center">
              <HiUser size={32} className="text-slate" />
            </div>
            <h2 className="text-xl font-bold text-primary">Leaderboard</h2>
            <p className="text-slate text-sm text-center">
              Login untuk muncul di leaderboard dan lihat peringkatmu dibanding pemain lain!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LeaderboardView