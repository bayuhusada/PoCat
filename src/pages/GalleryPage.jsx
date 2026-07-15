import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HiMap } from 'react-icons/hi'
import useLocalStorage from '../hooks/useLocalStorage'
import useAuth from '../hooks/useAuth'
import { fetchUserCats } from '../lib/cloud'
import GalleryGrid from '../components/gallery/GalleryGrid'
import DetailView from '../components/gallery/DetailView'
import MapView from '../components/map/MapView'
import { shareCat } from '../components/gallery/ShareCard'

function GalleryPage() {
  const { data, mergeCats } = useLocalStorage()
  const { user } = useAuth()
  const [selectedCat, setSelectedCat] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user) {
      setSyncing(true)
      fetchUserCats(user.id)
        .then(cloudCats => {
          if (cloudCats.length > 0) mergeCats(cloudCats)
        })
        .catch(() => {})
        .finally(() => setSyncing(false))
    }
  }, [user, mergeCats])

  const cats = data.cats || []

  return (
    <div className="h-full relative flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h2 className="text-lg font-semibold text-primary">Gallery</h2>
        <div className="flex items-center gap-2">
          {syncing && <span className="text-[11px] text-steel">syncing...</span>}
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
