import { useState } from 'react'
import BottomSheet from '../ui/BottomSheet'
import catdex from '../../data/catdex'

const colors = [
  { id: 'orange', label: 'Orange', bg: 'bg-orange-400', ring: 'ring-orange-400' },
  { id: 'white', label: 'White', bg: 'bg-white', ring: 'ring-gray-200' },
  { id: 'black', label: 'Black', bg: 'bg-gray-900', ring: 'ring-gray-900' },
  { id: 'grey', label: 'Grey', bg: 'bg-gray-400', ring: 'ring-gray-400' },
  { id: 'brown', label: 'Brown', bg: 'bg-amber-800', ring: 'ring-amber-800' },
  { id: 'mixed', label: 'Mixed', bg: 'bg-gradient-to-br from-orange-400 via-gray-900 to-white', ring: 'ring-gray-500' },
]

function NamingSheet({ isOpen, onClose, onSave, previewImage, selectedFrame, saving }) {
  const [name, setName] = useState('')
  const [story, setStory] = useState('')
  const [color, setColor] = useState('')
  const [species, setSpecies] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Nama kucing wajib diisi')
      return
    }
    onSave({
      name: trimmed,
      story: story.trim(),
      color: color || null,
      species: species ? Number(species) : null,
    })
    setName('')
    setStory('')
    setColor('')
    setSpecies('')
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
      <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
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

        {/* Color picker */}
        <div>
          <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
            Warna
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(color === c.id ? '' : c.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all
                  ${color === c.id
                    ? 'bg-primary text-on-dark ring-2 ring-primary'
                    : 'bg-surface text-slate border border-hairline hover:border-hairline-strong'
                  }`}
              >
                <span className={`w-3 h-3 rounded-full ${c.bg} ${c.id === 'white' ? 'border border-gray-200' : ''}`} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Species dropdown */}
        <div>
          <label className="text-xs font-semibold text-slate uppercase tracking-wider mb-1.5 block">
            Ras / Spesies
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-hairline-strong text-sm text-primary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors bg-white appearance-none"
          >
            <option value="">Pilih ras (opsional)</option>
            <option disabled>──────────</option>
            {catdex.map(entry => (
              <option key={entry.id} value={entry.id}>{entry.name}</option>
            ))}
            <option disabled>──────────</option>
            <option value="">Lainnya</option>
          </select>
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
