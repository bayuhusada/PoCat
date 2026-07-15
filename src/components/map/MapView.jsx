import { useRef, useEffect } from 'react'
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

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-2.5, 118], 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => map.remove()
  }, [])

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
      <div className="flex items-center px-4 safe-top" style={{ height: 56 }}>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-primary">Map Explorer</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative">
        <div ref={containerRef} className="absolute inset-0" />

        {!hasLocation && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas/90 z-10">
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
