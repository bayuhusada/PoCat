import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiLocationMarker } from 'react-icons/hi'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

function createCatIcon(photoUrl) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:44px;height:44px;border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        overflow:hidden;
        background:#e5e7eb url('${photoUrl}') center/cover no-repeat;
      "></div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })
}

function MapView({ cats, onClose }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const tileLayerRef = useRef(null)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-2.5, 118], 5)

    tileLayerRef.current = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    ).addTo(map)

    mapRef.current = map

    setTimeout(() => map.invalidateSize(), 400)

    return () => map.remove()
  }, [])

  const toggleLabels = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const nextShow = !showLabels
    setShowLabels(nextShow)

    const tileUrl = nextShow
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'

    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map)
  }, [showLabels])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const catsWithLoc = cats.filter(c => c.latitude && c.longitude)
    if (catsWithLoc.length === 0) return

    const bounds = L.latLngBounds(catsWithLoc.map(c => [c.latitude, c.longitude]))
    map.fitBounds(bounds, { padding: [50, 50] })

    catsWithLoc.forEach(cat => {
      const marker = L.marker([cat.latitude, cat.longitude], {
        icon: createCatIcon(cat.photo),
      }).addTo(map)
      marker.bindPopup(`
        <div style="min-width:160px">
          <img src="${cat.photo}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px" />
          <strong style="font-size:14px">${cat.name}</strong><br/>
          <span style="font-size:11px;color:#666">${new Date(cat.created_at).toLocaleDateString('id-ID')}</span>
        </div>
      `)
    })
  }, [cats])

  const hasLocation = cats.some(c => c.latitude && c.longitude)

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-40 bg-canvas flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 safe-top bg-canvas border-b border-hairline shrink-0" style={{ height: 56 }}>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-primary">Map Explorer</span>
        <button
          onClick={toggleLabels}
          className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold transition-all ${
            showLabels
              ? 'bg-surface text-slate hover:text-primary'
              : 'bg-primary text-on-dark'
          }`}
          title={showLabels ? 'Sembunyikan nama jalan' : 'Tampilkan nama jalan'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {showLabels ? (
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0" />
              </>
            ) : (
              <path d="M2 2l20 20M8.5 8.5A5 5 0 0 0 15.5 15.5M6 6a10 10 0 0 0 14 14M2 12A10 10 0 0 1 22 12" />
            )}
          </svg>
          <span>{showLabels ? 'Label' : 'Bersih'}</span>
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={containerRef} className="absolute inset-0" />

        {!hasLocation && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ background: 'rgba(255,255,255,0.92)' }}>
            <HiLocationMarker size={48} className="text-steel mb-3" />
            <p className="text-slate text-sm text-center max-w-[220px]">
              Belum ada kucing dengan lokasi GPS.
              Aktifkan GPS saat memotret!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MapView
