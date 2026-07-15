import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCamera from '../hooks/useCamera'
import useCatDetection from '../hooks/useCatDetection'
import useGeolocation from '../hooks/useGeolocation'
import useCloudData from '../hooks/useCloudData'
import CameraView from '../components/camera/CameraView'
import AIDetection from '../components/camera/AIDetection'
import FramePicker from '../components/camera/FramePicker'
import NamingSheet from '../components/camera/NamingSheet'
import badges from '../data/badges'

function CameraPage() {
  const navigate = useNavigate()
  const camera = useCamera()
  const ai = useCatDetection()
  const geo = useGeolocation()
  const { addCat } = useCloudData()

  const lastGeocodeRef = useRef(0)
  const [showFramePicker, setShowFramePicker] = useState(false)
  const [showNaming, setShowNaming] = useState(false)
  const [selectedFrame, setSelectedFrame] = useState('classic')
  const [saving, setSaving] = useState(false)

  const handleCapture = useCallback(() => {
    const imageSrc = camera.capture()
    if (!imageSrc) return
    geo.getCurrentPosition()
    ai.loadModelAndDetect(imageSrc)
  }, [camera, geo, ai])

  const handleFileUpload = useCallback(async (file) => {
    const dataUrl = await camera.handleFileUpload(file)
    if (dataUrl) {
      geo.getCurrentPosition()
      ai.loadModelAndDetect(dataUrl)
    }
  }, [camera, geo, ai])

  const handleRetake = useCallback(() => {
    ai.reset()
    camera.retake()
  }, [ai, camera])

  const handleContinue = useCallback(() => {
    setShowFramePicker(true)
  }, [])

  const handleFrameSelect = useCallback((frameId) => {
    setSelectedFrame(frameId)
    setShowNaming(true)
  }, [])

  const handleSave = useCallback(async ({ name, story, color, species }) => {
    setSaving(true)

    let location_name = ''
    const now = Date.now()
    if (geo.location?.latitude && geo.location?.longitude && now - lastGeocodeRef.current > 1500) {
      lastGeocodeRef.current = now
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${geo.location.latitude}&lon=${geo.location.longitude}&format=json`,
          { headers: { 'Accept-Language': 'id' } }
        )
        const data = await res.json()
        if (data.display_name) location_name = data.display_name
      } catch {}
    }

    try {
      const result = await addCat({
        name,
        story,
        photo: camera.capturedImage,
        frame: selectedFrame,
        latitude: geo.location?.latitude || null,
        longitude: geo.location?.longitude || null,
        location_name,
        color,
        species,
      })

      setShowNaming(false)

      const newBadges = result?.newBadges || []
      if (newBadges.length > 0) {
        newBadges.forEach(badgeId => {
          const badge = badges.find(b => b.id === badgeId)
          if (!badge) return
          toast.custom((t) => (
            <div className="flex items-center gap-3 bg-primary text-on-dark rounded-2xl px-4 py-3 shadow-elevated min-w-[280px]">
              <span className="text-2xl">{badge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Badge Terbuka! +50XP</p>
                <p className="text-xs text-on-dark-muted">{badge.title}</p>
              </div>
              <button
                onClick={() => { toast.dismiss(t.id); navigate('/badges') }}
                className="px-3 py-1.5 rounded-full bg-brand-yellow text-primary text-xs font-semibold whitespace-nowrap"
              >
                Lihat
              </button>
            </div>
          ), { duration: 6000 })
        })
      } else {
        toast.success(`${name} saved! +20XP 🐱`, { icon: '🎉' })
      }

      setTimeout(() => navigate('/gallery'), newBadges.length > 0 ? 3000 : 500)
    } catch (err) {
      toast.error('Gagal menyimpan: ' + (err.message || 'Gagal'))
    } finally {
      setSaving(false)
    }
  }, [camera.capturedImage, selectedFrame, geo.location, addCat, navigate])

  const handleClose = useCallback(() => {
    if (camera.capturedImage) {
      camera.retake()
      ai.reset()
    } else {
      navigate(-1)
    }
  }, [camera, ai, navigate])

  if (!camera.capturedImage) {
    return (
      <CameraView
        webcamRef={camera.webcamRef}
        facingMode={camera.facingMode}
        isCameraReady={camera.isCameraReady}
        cameraError={camera.cameraError}
        showFallback={camera.showFallback}
        flash={camera.flash}
        onUserMedia={camera.handleUserMedia}
        onUserMediaError={camera.handleUserMediaError}
        onSwitchCamera={camera.switchCamera}
        onCapture={handleCapture}
    onFileUpload={handleFileUpload}
    onClose={handleClose}
    zoomLevel={camera.zoomLevel}
    onZoomChange={camera.setZoomLevel}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-primary">
      {/* Top bar */}
      <div className="flex items-center px-4 safe-top" style={{ height: 56 }}>
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-dark"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 12l6-6M3 12l6 6" />
          </svg>
        </button>
        <span className="flex-1 text-center text-sm font-medium text-on-dark">Preview</span>
        <div className="w-10" />
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center px-3 pb-3">
        <div className="relative w-full h-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-charcoal">
          <img
            src={camera.capturedImage}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* AI Detection overlay */}
          <AIDetection
            isDetecting={ai.isDetecting}
            result={ai.result}
            modelLoading={ai.modelLoading}
            onRetry={handleRetake}
            onContinue={handleContinue}
          />

          {/* Frame overlay (after selection) */}
          {selectedFrame && !ai.isDetecting && ai.result?.found && (
            <div className={`absolute inset-0 pointer-events-none ${getFrameStyle(selectedFrame)}`} />
          )}
        </div>
      </div>

      {/* Bottom action */}
      {!ai.isDetecting && !ai.result && (
        <div className="flex items-center justify-center pb-6 safe-bottom gap-4">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-full bg-white/15 text-on-dark text-sm font-medium active:scale-95 transition-transform"
          >
            Ulang
          </button>
          <button
            onClick={() => ai.loadModelAndDetect(camera.capturedImage)}
            className="px-8 py-3 rounded-full bg-on-dark text-primary text-sm font-medium shadow-card active:scale-95 transition-transform"
          >
            Deteksi Kucing
          </button>
        </div>
      )}

      {/* Frame Picker Sheet */}
      <FramePicker
        isOpen={showFramePicker}
        onClose={() => setShowFramePicker(false)}
        onSelect={handleFrameSelect}
        previewImage={camera.capturedImage}
      />

      {/* Naming Sheet */}
      <NamingSheet
        isOpen={showNaming}
        onClose={() => { if (!saving) setShowNaming(false) }}
        onSave={handleSave}
        previewImage={camera.capturedImage}
        selectedFrame={selectedFrame}
        saving={saving}
      />
    </div>
  )
}

function getFrameStyle(frameId) {
  const styles = {
    classic: 'ring-4 ring-primary ring-inset',
    pink: 'ring-4 ring-pink-400 ring-inset shadow-[inset_0_0_20px_rgba(244,114,182,0.3)]',
    pixel: 'ring-4 ring-success ring-inset shadow-[inset_0_0_0_3px_rgba(107,203,119,0.3)]',
    nature: 'ring-4 ring-emerald-500/60 ring-inset',
    neon: 'ring-4 ring-[#00FF88] ring-inset shadow-[inset_0_0_24px_rgba(0,255,136,0.3)]',
    halloween: 'ring-4 ring-[#FF6B35] ring-inset shadow-[inset_0_0_20px_rgba(255,107,53,0.3)]',
    christmas: 'ring-4 ring-red-500 ring-inset shadow-[inset_0_0_20px_rgba(229,57,53,0.3)]',
    legendary: 'ring-4 ring-[#FFD700] ring-inset shadow-[inset_0_0_24px_rgba(255,215,0,0.4)]',
  }
  return styles[frameId] || styles.classic
}

export default CameraPage