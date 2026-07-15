import { useState, useEffect } from 'react'
import { HiCamera, HiStar, HiUser, HiLogout } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useLocalStorage from '../hooks/useLocalStorage'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { calculateLevel } from '../lib/levels'
import { getCatDexEntries } from '../data/catdex'
import DailyMission from '../components/missions/DailyMission'
import LeaderboardView from '../components/leaderboard/LeaderboardView'
import LoginPage from './LoginPage'
import toast from 'react-hot-toast'

function HomePage() {
  const navigate = useNavigate()
  const { data, addBadge } = useLocalStorage()
  const { user, signOut } = useAuth()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [cloudCats, setCloudCats] = useState(null)

  useEffect(() => {
    if (user) {
      supabase
        .from('cats')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then(({ count }) => setCloudCats(count || 0))
    } else {
      setCloudCats(null)
    }
  }, [user])

  const cats = data.cats || []
  const earnedBadges = data.badges || []
  const completedMissions = data.completedMissions || []
  const xp = data.xp || 0
  const totalCats = data.totalCats || cats.length
  const { level, xpInLevel, xpForNext, progress } = calculateLevel(xp)
  const catdexEntries = getCatDexEntries(cats)
  const catdexProgress = catdexEntries.filter(e => e.found).length
  const badgeCount = earnedBadges.length

  async function handleLogout() {
    await signOut()
    toast.success('Berhasil keluar')
    window.location.reload()
  }

  function handleMissionComplete(mission) {
    const today = new Date().toDateString()
    const updated = {
      ...data,
      xp: (data.xp || 0) + mission.reward,
      completedMissions: [
        ...(data.completedMissions || []),
        { id: mission.id, date: today },
      ],
    }
    localStorage.setItem('pocat_data', JSON.stringify(updated))
    window.location.reload()
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center px-6 pt-6 gap-5">
        {/* Header with avatar */}
        <div className="w-full flex items-center justify-between">
          <div />
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[32px] font-bold tracking-tight leading-tight text-primary">
              PokeCat
            </h1>
          </div>
          <button
            onClick={() => user ? navigate('/profile') : setShowLogin(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-hairline transition-colors"
            title={user ? `Profil (${user.email})` : 'Login'}
          >
            {user ? (
              <span className="w-7 h-7 rounded-full bg-primary text-on-dark flex items-center justify-center text-xs font-bold">
                {user.email[0].toUpperCase()}
              </span>
            ) : (
              <HiUser size={20} className="text-slate" />
            )}
          </button>
        </div>

        {/* Auth status */}
        {user && (
          <div className="flex items-center gap-2 text-xs text-slate -mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {user.email}
            {cloudCats !== null && (
              <span>· {cloudCats} kucing di cloud</span>
            )}
          </div>
        )}

        {/* Level Card */}
        <div className="w-full bg-primary rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-yellow text-primary flex items-center justify-center text-lg font-bold">
              {level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-on-dark font-semibold text-sm">Level {level}</span>
                <span className="text-on-dark-muted text-xs">{xp} XP</span>
              </div>
              <div className="mt-1.5 w-full h-1.5 bg-on-dark-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-yellow rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-on-dark-muted text-[11px] mt-1">
                {xpInLevel} / {xpForNext} XP menuju level {level + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Mission */}
        <DailyMission
          cats={cats}
          completedMissions={completedMissions}
          onComplete={handleMissionComplete}
        />

        {/* Stats row */}
        <div className="w-full grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{totalCats}</span>
            <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-1">Kucing</span>
          </div>
          <div className="bg-surface rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{catdexProgress}</span>
            <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-1">CatDex</span>
          </div>
          <div className="bg-surface rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{badgeCount}</span>
            <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-1">Badges</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={() => navigate('/camera')}
          className="flex items-center gap-2 bg-primary text-on-dark rounded-full px-8 py-3.5 text-sm font-medium shadow-card active:scale-95 transition-transform w-full justify-center"
        >
          <HiCamera size={20} />
          Mulai Hunting!
        </button>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2 text-slate border border-hairline rounded-full px-6 py-2.5 text-sm font-medium active:scale-95 transition-transform w-full justify-center hover:border-hairline-strong"
        >
          <HiStar size={18} />
          Lihat Peringkat
        </button>

        {/* Empty state hint */}
        {totalCats === 0 && (
          <p className="text-[11px] text-steel font-medium uppercase tracking-wider text-center pb-4">
            Belum ada kucing yang dikoleksi
          </p>
        )}

        {/* Guest mode hint */}
        {!user && (
          <p className="text-[11px] text-steel text-center pb-2">
            Mode tamu · Data tersimpan di perangkat ini
          </p>
        )}

        {/* Recent cats mini preview */}
        {cats.length > 0 && (
          <div className="w-full pb-6">
            <h3 className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">Kucing Terbaru</h3>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-6 px-6">
              {cats.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate('/gallery')}
                  className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-surface border border-hairline"
                >
                  <img src={cat.photo} alt={cat.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardView
            userCats={totalCats}
            cloudCats={cloudCats}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
