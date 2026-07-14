import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HiMap } from 'react-icons/hi'
import useLocalStorage from '../hooks/useLocalStorage'
import GalleryGrid from '../components/gallery/GalleryGrid'
import DetailView from '../components/gallery/DetailView'
import MapView from '../components/map/MapView'
import { shareCat } from '../components/gallery/ShareCard'

function GalleryPage() {
  const { getCats } = useLocalStorage()
  const [selectedCat, setSelectedCat] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const cats = getCats()

  return (
    <div className="h-full relative flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h2 className="text-lg font-semibold text-primary">Gallery</h2>
        {cats.length > 0 && cats.some(c => c.latitude && c.longitude) && (
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-1.5 text-sm text-slate font-medium px-3 py-1.5 rounded-full border border-hairline hover:border-hairline-strong transition-colors"
          >
            <HiMap size={16} />
            Map
          </button>
        )}
      </div>

      <GalleryGrid cats={cats} onCatTap={setSelectedCat} />

      <AnimatePresence>
        {selectedCat && (
          <DetailView
            cat={selectedCat}
            onClose={() => setSelectedCat(null)}
            onShare={shareCat}
          />
        )}
        {showMap && (
          <MapView
            cats={cats}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryPage
