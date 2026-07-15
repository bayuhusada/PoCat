import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft, HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiLogout } from 'react-icons/hi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import useLocalStorage from '../hooks/useLocalStorage'
import { supabase } from '../lib/supabase'
import { calculateLevel } from '../lib/levels'
import { getCatDexEntries } from '../data/catdex'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile, signOut, updateUsername, updatePassword } = useAuth()
  const { data } = useLocalStorage()
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

  const cats = data.cats || []
  const xp = data.xp || 0
  const { level } = calculateLevel(xp)
  const catdexEntries = getCatDexEntries(cats)
  const catdexProgress = catdexEntries.filter(e => e.found).length

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
      if (msg.includes('session') || msg.includes('login') || msg.includes('auth') || msg.includes('token')) {
        toast.error('Sesi berakhir, silakan login ulang untuk mengganti password')
      } else {
        toast.error(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut()
    } catch {}
    toast.success('Berhasil keluar')
    navigate('/')
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col safe-top">
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center">
            <HiUser size={32} className="text-steel" />
          </div>
          <p className="text-sm text-slate text-center">
            Login untuk mengakses profil dan menyimpan data ke cloud
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-on-dark rounded-full px-8 py-3 text-sm font-medium shadow-card"
          >
            Ke Halaman Utama
          </button>
        </div>
      </div>
    )
  }

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

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-2 gap-6 pb-8">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-dark text-2xl font-bold">
            {username ? username[0].toUpperCase() : (user.email?.[0]?.toUpperCase() || <HiUser size={32} />)}
          </div>

          {/* Username */}
          <div className="w-full max-w-sm">
            <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
              Username
            </label>
            {editingUsername ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value)}
                  placeholder="Username"
                  className="flex-1 px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                  maxLength={30}
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  disabled={submitting}
                  className="px-4 py-3 rounded-xl bg-primary text-on-dark text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? '...' : 'Simpan'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface">
                <span className="text-sm text-primary font-medium">
                  {username || <span className="text-muted italic">Belum diatur</span>}
                </span>
                <button
                  onClick={() => { setUsernameDraft(username); setEditingUsername(true) }}
                  className="text-xs font-semibold text-brand-blue"
                >
                  Ubah
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="w-full max-w-sm">
            <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface">
              <HiMail size={16} className="text-steel" />
              <span className="text-sm text-primary">{user.email}</span>
            </div>
          </div>

          {/* Password */}
          <div className="w-full max-w-sm">
            <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            {changingPassword ? (
              <div className="space-y-3">
                <div className="relative">
                  <HiLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Password baru (min. 6 karakter)"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-steel hover:text-slate"
                  >
                    {showNewPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password baru"
                  className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                  minLength={6}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setChangingPassword(false); setNewPassword(''); setConfirmPassword('') }}
                    className="flex-1 py-3 rounded-xl border border-hairline text-sm text-slate font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-primary text-on-dark text-sm font-medium disabled:opacity-50"
                  >
                    {submitting ? '...' : 'Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface">
                <div className="flex items-center gap-2.5">
                  <HiLockClosed size={16} className="text-steel" />
                  <span className="text-sm text-primary">********</span>
                </div>
                <button
                  onClick={() => setChangingPassword(true)}
                  className="text-xs font-semibold text-brand-blue"
                >
                  Ubah
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="w-full max-w-sm">
            <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-2 block">
              Statistik
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface rounded-2xl p-3 flex flex-col items-center">
                <span className="text-xl font-bold text-primary">{cats.length}</span>
                <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-0.5">Lokal</span>
              </div>
              <div className="bg-surface rounded-2xl p-3 flex flex-col items-center">
                <span className="text-xl font-bold text-primary">{cloudCats !== null ? cloudCats : '-'}</span>
                <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-0.5">Cloud</span>
              </div>
              <div className="bg-surface rounded-2xl p-3 flex flex-col items-center">
                <span className="text-xl font-bold text-primary">{catdexProgress}</span>
                <span className="text-[10px] text-slate font-semibold uppercase tracking-wider mt-0.5">CatDex</span>
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="w-full max-w-sm bg-primary rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-primary flex items-center justify-center text-base font-bold">
                {level}
              </div>
              <div>
                <span className="text-on-dark font-semibold text-sm">Level {level}</span>
                <p className="text-on-dark-muted text-xs">{xp} XP</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-full border border-danger/30 text-danger text-sm font-medium active:scale-[0.98] transition-transform"
          >
            <HiLogout size={18} />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
