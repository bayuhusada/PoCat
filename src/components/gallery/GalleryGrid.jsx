import { useState, useMemo } from 'react'
import { HiSearch, HiPhotograph } from 'react-icons/hi'
import CatCard from './CatCard'

const filters = ['All', 'Orange', 'White', 'Black', 'Grey', 'Mixed']

function GalleryGrid({ cats, onCatTap }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(() => {
    let result = [...cats]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.location_name || '').toLowerCase().includes(q) ||
        new Date(c.created_at).toLocaleDateString('id-ID').toLowerCase().includes(q)
      )
    }

    if (activeFilter !== 'All') {
      const color = activeFilter.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(color)
      )
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [cats, search, activeFilter])

  if (cats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-pastel-yellow flex items-center justify-center">
          <HiPhotograph size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Belum Ada Kucing</h2>
        <p className="text-slate text-sm text-center max-w-[220px]">
          Kucing yang kamu potret akan muncul di sini
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-surface rounded-full px-4 py-2.5 border border-hairline">
          <HiSearch size={16} className="text-steel flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, lokasi..."
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-steel focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-steel hover:text-slate text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full
                transition-all duration-150 whitespace-nowrap
                ${activeFilter === f
                  ? 'bg-primary text-on-dark'
                  : 'bg-canvas text-slate border border-hairline hover:border-hairline-strong'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate text-sm">Tidak ada hasil untuk "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((cat) => (
              <CatCard key={cat.id} cat={cat} onTap={onCatTap} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryGrid
