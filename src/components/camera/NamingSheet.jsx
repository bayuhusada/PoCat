import { useState } from 'react'
import BottomSheet from '../ui/BottomSheet'
import catdex, { starsLabel, starsLevel } from '../../data/catdex'

const colors = [
  { id: 'orange_tabby',     label: 'Orange Tabby',     bg: 'bg-orange-400' },
  { id: 'brown_tabby',      label: 'Brown Tabby',      bg: 'bg-amber-800' },
  { id: 'black',            label: 'Black',             bg: 'bg-gray-900' },
  { id: 'tuxedo',           label: 'Tuxedo',            bg: 'bg-gradient-to-r from-gray-900 via-white to-gray-900' },
  { id: 'white',            label: 'White',             bg: 'bg-white border border-gray-200' },
  { id: 'calico',           label: 'Calico',            bg: 'bg-gradient-to-br from-orange-400 via-white to-gray-900' },
  { id: 'tortoiseshell',    label: 'Tortoiseshell',     bg: 'bg-gradient-to-br from-amber-800 via-orange-400 to-gray-900' },
  { id: 'gray',             label: 'Gray',              bg: 'bg-gray-400' },
  { id: 'gray_white',       label: 'Gray & White',      bg: 'bg-gradient-to-r from-gray-400 to-white' },
  { id: 'orange_white',     label: 'Orange & White',    bg: 'bg-gradient-to-r from-orange-400 to-white' },
  { id: 'cream',            label: 'Cream',             bg: 'bg-amber-100 border border-amber-200' },
  { id: 'chocolate',        label: 'Chocolate',         bg: 'bg-amber-900' },
  { id: 'seal_point',       label: 'Seal Point',        bg: 'bg-gradient-to-b from-amber-800 via-white to-white' },
  { id: 'blue_point',       label: 'Blue Point',        bg: 'bg-gradient-to-b from-gray-400 via-white to-white' },
  { id: 'golden_shaded',    label: 'Golden Shaded',     bg: 'bg-amber-200' },
  { id: 'silver_shaded',    label: 'Silver Shaded',     bg: 'bg-gray-200' },
  { id: 'chinchilla_silver',label: 'Chinchilla Silver', bg: 'bg-gray-100 border border-gray-200' },
  { id: 'blue_cream',       label: 'Blue Cream',        bg: 'bg-gradient-to-br from-gray-400 to-amber-100' },
  { id: 'lilac',            label: 'Lilac',             bg: 'bg-purple-200' },
  { id: 'cinnamon',         label: 'Cinnamon',          bg: 'bg-amber-600' },
]

const groups = [
  { label: 'Sangat Langka', stars: 5 },
  { label: 'Langka', stars: 4 },
  { label: 'Cukup Langka', stars: 3 },
  { label: 'Mulai Banyak', stars: 2 },
  { label: 'Sangat Mudah', stars: 1 },
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
          <div className="flex gap-1.5 flex-wrap">
            {colors.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(color === c.id ? '' : c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all
                  ${color === c.id
                    ? 'bg-primary text-on-dark ring-2 ring-primary'
                    : 'bg-surface text-slate border border-hairline hover:border-hairline-strong'
                  }`}
              >
                <span className={`w-3 h-3 rounded-full ${c.bg} flex-shrink-0`} />
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
            {groups.map(group => (
              <optgroup key={group.stars} label={`${starsLabel(group.stars)} ${group.label}`}>
                {catdex
                  .filter(e => e.stars === group.stars)
                  .map(entry => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name} — {entry.desc}
                    </option>
                  ))}
              </optgroup>
            ))}
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