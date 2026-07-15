import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast'

function LoginPage({ onClose, onLoginSuccess }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        toast.success('Berhasil masuk!')
        onLoginSuccess?.()
        onClose()
      } else {
        await signUp(email, password)
        toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-canvas flex flex-col safe-top safe-bottom"
    >
      {/* Top bar */}
      <div className="flex items-center px-4" style={{ height: 56 }}>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-primary">Akun</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-brand-yellow flex items-center justify-center text-2xl mb-3">
              🐱
            </div>
            <h1 className="text-2xl font-bold text-primary">
              {mode === 'login' ? 'Masuk' : 'Daftar'}
            </h1>
            <p className="text-slate text-sm mt-1">
              {mode === 'login'
                ? 'Masuk untuk menyimpan koleksi ke cloud'
                : 'Buat akun baru untuk menyimpan koleksi'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <HiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <HiLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-steel hover:text-slate"
                >
                  {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-danger text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-dark rounded-full py-3 text-sm font-medium shadow-card active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {submitting
                ? 'Memproses...'
                : mode === 'login' ? 'Masuk' : 'Daftar'
              }
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <span className="text-sm text-slate">
              {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              {mode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <span className="text-[11px] text-steel">
                Atau lanjut sebagai tamu — data tersimpan di perangkat ini
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LoginPage
