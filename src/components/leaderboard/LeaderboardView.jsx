import { motion } from 'framer-motion'
import { HiArrowLeft, HiStar } from 'react-icons/hi'
import { getLeaderboard } from '../../data/leaderboard'

const rankStyles = {
  1: 'text-[#FFD700]',
  2: 'text-[#C0C0C0]',
  3: 'text-[#CD7F32]',
}

const rankBg = {
  1: 'bg-[#FFF8E0] border-[#FFD700]',
  2: 'bg-[#F0F0F5] border-[#C0C0C0]',
  3: 'bg-[#FFF0E8] border-[#CD7F32]',
}

function LeaderboardView({ userCats, onClose }) {
  const entries = getLeaderboard(userCats)

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

      {/* Hero */}
      <div className="px-5 pb-4">
        <div className="bg-primary rounded-3xl p-6 text-center">
          <HiStar size={36} className="text-brand-yellow mx-auto mb-2" />
          <h2 className="text-xl font-bold text-on-dark">Peringkat</h2>
          <p className="text-on-dark-muted text-sm mt-1">
            Semakin banyak kucing, semakin tinggi peringkatmu!
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.name}
              className={`
                flex items-center gap-3 rounded-2xl px-4 py-3 border
                transition-all
                ${entry.isUser
                  ? 'bg-primary border-primary text-on-dark'
                  : entry.rank <= 3
                    ? `${rankBg[entry.rank]} border`
                    : 'bg-canvas border-hairline-soft'
                }
              `}
            >
              {/* Rank */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${entry.isUser
                  ? 'bg-brand-yellow text-primary'
                  : entry.rank <= 3
                    ? `${rankStyles[entry.rank]} bg-canvas`
                    : 'bg-surface text-slate'
                }
              `}>
                {entry.rank}
              </div>

              {/* Avatar */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${entry.isUser ? 'bg-brand-yellow text-primary' : 'bg-surface text-slate'}
              `}>
                {entry.name[0]}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold ${entry.isUser ? 'text-on-dark' : 'text-primary'}`}>
                  {entry.name}
                </span>
                {entry.isUser && (
                  <span className="text-[10px] text-on-dark-muted ml-2 font-medium">(Kamu)</span>
                )}
              </div>

              {/* Cats count */}
              <span className={`text-sm font-bold ${entry.isUser ? 'text-on-dark' : 'text-primary'}`}>
                {entry.totalCats}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LeaderboardView
