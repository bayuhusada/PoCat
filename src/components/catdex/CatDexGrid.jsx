import { getCatDexEntries, starsLabel } from '../../data/catdex'
import { HiCollection } from 'react-icons/hi'

function CatDexGrid({ cats }) {
  const entries = getCatDexEntries(cats)
  const foundCount = entries.filter(e => e.found).length

  if (cats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-pastel-teal flex items-center justify-center">
          <HiCollection size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">CatDex</h2>
        <p className="text-slate text-sm text-center max-w-[220px]">
          Temukan kucing untuk mengisi CatDex-mu!
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">CatDex</h2>
          <span className="text-sm text-slate font-medium">
            {foundCount} / {entries.length}
          </span>
        </div>
        <div className="mt-2 w-full h-1.5 bg-hairline rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(foundCount / entries.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`
                aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2
                transition-all duration-200
                ${entry.found
                  ? 'bg-canvas border-primary shadow-sm'
                  : 'bg-surface border-hairline opacity-60'
                }
              `}
            >
              {entry.found ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-surface overflow-hidden mb-1 flex-shrink-0">
                    {entry.discovered[0] && (
                      <img
                        src={entry.discovered[0].photo}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-steel font-semibold">
                    {String(entry.id).padStart(3, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-primary text-center leading-tight">
                    {entry.name}
                  </span>
                  <span className="text-[9px] mt-0.5">{starsLabel(entry.stars)}</span>
                </>
              ) : (
                <>
                  <span className="text-2xl text-steel mb-1">?</span>
                  <span className="text-[10px] text-steel font-semibold">
                    {String(entry.id).padStart(3, '0')}
                  </span>
                  <span className="text-[11px] text-steel text-center leading-tight">
                    ???
                  </span>
                  <span className="text-[9px] mt-0.5 text-steel">{starsLabel(entry.stars)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CatDexGrid