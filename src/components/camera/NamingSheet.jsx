import { useState } from 'react'
import BottomSheet from '../ui/BottomSheet'

function NamingSheet({ isOpen, onClose, onSave, previewImage, selectedFrame, saving }) {
  const [name, setName] = useState('')
  const [story, setStory] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Nama kucing wajib diisi')
      return
    }
    onSave({ name: trimmed, story: story.trim() })
    setName('')
    setStory('')
    setError('')
  }

  const frameStyles = {
    classic: 'border-4 border-primary',
    pink: 'border-4 border-pink-400',
    pixel: 'border-4 border-success',
    nature: 'border-4 border-emerald-500/60',
    neon: 'border-4 border-[#00FF88]',
    halloween: 'border-4 border-[#FF6B35]',
    christmas: 'border-4 border-red-500',
    legendary: 'border-4 border-[#FFD700]',
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Beri Nama" showClose={false}>
      <div className="flex flex-col gap-4">
        {/* Preview kecil */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface relative">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className={`absolute inset-0 ${frameStyles[selectedFrame] || frameStyles.classic}`} />
          </div>
        </div>

        {/* Input nama */}
        <div>
          <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
            Nama Kucing <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Contoh: Mochi, Oyen, Garong"
            className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
            autoFocus
            maxLength={50}
          />
          {error && <p className="text-danger text-xs mt-1">{error}</p>}
        </div>

        {/* Cerita (opsional) */}
        <div>
          <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
            Cerita (opsional)
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Ketemu di parkiran kampus. Sangat ramah."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors resize-none"
            maxLength={200}
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-on-dark rounded-full py-3 text-sm font-medium shadow-card active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan Kucing!'}
        </button>
      </div>
    </BottomSheet>
  )
}

export default NamingSheet
