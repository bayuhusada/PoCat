import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiLogout } from 'react-icons/hi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import useCloudData from '../hooks/useCloudData'
import { supabase } from '../lib/supabase'
import { calculateLevel } from '../lib/levels'
import { getCatDexEntries } from '../data/catdex'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile, signOut, updateUsername, updatePassword } = useAuth()
  const { cats, badges, xp } = useCloudData()
  const [username, setUsername] = useState(profile?.username || '')
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameDraft, setUsernameDraft] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [cloudCats, setCloudCats] = useState(null)

  useEffect(() => {
    if (profile) {
      setUsername(profile?.username || '')
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      supabase
        .from('cats')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then(({ count }) => setCloudCats(count || 0))
    }
  }, [user])

  const totalCats = Math.max(cats.length, cloudCats || 0)
  const { level } = calculateLevel(xp)
  const catdexEntries = getCatDexEntries(cats)
  const catdexProgress = catdexEntries.filter(e => e.found).length
  const badgeCount = badges.length

  async function handleSaveUsername() {
    const trimmed = usernameDraft.trim()
    if (!trimmed) {
      toast.error('Username tidak boleh kosong')
      return
    }
    setSubmitting(true)
    try {
      await updateUsername(trimmed)
      setUsername(trimmed)
      setEditingUsername(false)
      toast.success('Username berhasil diperbarui')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(newPassword)
      toast.success('Password berhasil diubah')
      setNewPassword('')
      setConfirmPassword('')
      setChangingPassword(false)
    } catch (err) {
      const msg = err.message?.toLowerCase() || ''
      if (msg.includes('session') || msg.includes('login') || msg.includes('auth')) {
        toast.error('Sesi berakhir, silakan login ulang untuk mengganti password')
      } else {
        toast.error(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    try { await signOut() } catch {}
    toast.success('Berhasil keluar')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="h-full flex flex-col safe-top">
      {/* Top bar */}
      <div className="flex items-center px-4" style={{ height: 56 }}>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-primary">Profil</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Avatar + Username */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary text-on-dark flex items-center justify-center text-3xl font-bold mb-3">
            {(profile?.username || user?.email || '?')[0].toUpperCase()}
          </div>
          {editingUsername ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                maxLength={30}
                className="px-4 py-2 rounded-xl border border-hairline-strong text-sm text-primary focus:outline-none focus:border-brand-blue text-center"
                autoFocus
              />
              <button
                onClick={handleSaveUsername}
                disabled={submitting}
                className="px-4 py-2 rounded-full bg-primary text-on-dark text-xs font-medium"
              >
                {submitting ? '...' : 'Simpan'}
              </button>
              <button
                onClick={() => setEditingUsername(false)}
                className="px-3 py-2 text-xs text-slate"
              >
                Batal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-primary">
                {profile?.username || user?.email?.split('@')[0] || 'Player'}
              </h2>
              <button
                onClick={() => { setUsernameDraft(profile?.username || ''); setEditingUsername(true) }}
                className="text-xs text-brand-blue font-medium"
              >
                Edit
              </button>
            </div>
          )}
          <p className="text-xs text-slate mt-1">{user?.email}</p>
        </div>

        {/* Level Card */}
        <div className="w-full bg-primary rounded-3xl p-5 shadow-card mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-yellow text-primary flex items-center justify-center text-lg font-bold">
              {level}
            </div>
            <div className="flex-1">
              <span className="text-on-dark font-semibold text-sm">Level {level}</span>
              <p className="text-on-dark-muted text-xs mt-0.5">{xp} XP</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-3xl p-5 mb-6">
          <h3 className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">Statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">{totalCats}</p>
              <p className="text-xs text-slate">Kucing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{catdexProgress}</p>
              <p className="text-xs text-slate">CatDex</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{badgeCount}</p>
              <p className="text-xs text-slate">Badges</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{xp}</p>
              <p className="text-xs text-slate">Total XP</p>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-surface rounded-3xl p-5 mb-6">
          <h3 className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">Keamanan</h3>
          {changingPassword ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password baru"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted pr-10"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel"
                >
                  {showNewPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setChangingPassword(false)}
                  className="flex-1 py-2.5 rounded-full border border-hairline text-sm text-slate font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-dark text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? '...' : 'Simpan'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setChangingPassword(true)}
              className="flex items-center gap-2 text-sm text-slate font-medium"
            >
              <HiLockClosed size={16} />
              Ganti Password
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-danger/30 text-danger text-sm font-medium active:scale-[0.98] transition-transform"
        >
          <HiLogout size={18} />
          Keluar
        </button>
      </div>
    </div>
  )
}

export default ProfilePage