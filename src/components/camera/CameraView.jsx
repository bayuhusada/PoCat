import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { HiSwitchHorizontal, HiPhotograph, HiArrowLeft, HiPlus, HiMinus } from 'react-icons/hi'

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.5

function CameraView({
  webcamRef,
  facingMode,
  isCameraReady,
  cameraError,
  showFallback,
  flash,
  onUserMedia,
  onUserMediaError,
  onSwitchCamera,
  onCapture,
  onFileUpload,
  onClose,
  zoomLevel = 1,
  onZoomChange,
}) {
  const fileInputRef = useRef(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  useEffect(() => {
    if (isCameraReady) return
    const t = setTimeout(() => setLoadingTimeout(true), 8000)
    return () => clearTimeout(t)
  }, [isCameraReady])

  useEffect(() => {
    if (isCameraReady) setLoadingTimeout(false)
  }, [isCameraReady])

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      await onFileUpload(file)
      e.target.value = ''
    }
  }

  const showFallbackUI = showFallback || cameraError || (!isCameraReady && loadingTimeout)

  function zoomIn() {
    if (onZoomChange) onZoomChange(Math.min(ZOOM_MAX, +(zoomLevel + ZOOM_STEP).toFixed(1)))
  }

  function zoomOut() {
    if (onZoomChange) onZoomChange(Math.max(ZOOM_MIN, +(zoomLevel - ZOOM_STEP).toFixed(1)))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col safe-top safe-bottom">
      {/* Flash */}
      {flash && (
        <div className="absolute inset-0 bg-white z-50 animate-ping opacity-50 pointer-events-none" />
      )}

      {/* Video background - fills entire screen */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {showFallbackUI ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-on-dark-muted bg-black">
            <HiPhotograph size={48} />
            <p className="text-sm font-medium">
              {cameraError === 'permission_denied'
                ? 'Izin kamera ditolak'
                : loadingTimeout
                  ? 'Kamera tidak merespon'
                  : 'Kamera tidak tersedia'
              }
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-on-dark text-primary rounded-full px-6 py-2.5 text-sm font-medium shadow-card active:scale-95 transition-transform"
            >
              Pilih dari Galeri
            </button>
          </div>
        ) : (
          <div
            className="w-full h-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.8}
              videoConstraints={{ facingMode }}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
              mirrored={facingMode === 'user'}
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {!isCameraReady && !loadingTimeout && !showFallback && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-on-dark-muted border-t-on-dark rounded-full animate-spin" />
              <span className="text-on-dark-muted text-xs font-medium">Mengakses kamera...</span>
            </div>
          </div>
        )}
      </div>

      {/* Top bar overlay */}
      <div className="relative z-20 flex items-center px-4" style={{ height: 56 }}>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-on-dark"
        >
          <HiArrowLeft size={22} />
        </button>
        <span className="flex-1 text-center text-sm font-medium text-on-dark drop-shadow-md">
          Ambil Foto
        </span>
        {isCameraReady && (
          <button
            onClick={onSwitchCamera}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-on-dark"
          >
            <HiSwitchHorizontal size={20} />
          </button>
        )}
        {!isCameraReady && <div className="w-10" />}
      </div>

      {/* Spacer pushes bottom controls down */}
      <div className="flex-1" />

      {/* Zoom controls - right side */}
      {isCameraReady && (
        <div className="absolute right-4 z-20 flex flex-col gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= ZOOM_MAX}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-on-dark disabled:opacity-30 active:scale-90 transition-transform"
          >
            <HiPlus size={20} />
          </button>
          <div className="text-center text-[11px] font-semibold text-on-dark drop-shadow-md">
            {zoomLevel}x
          </div>
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= ZOOM_MIN}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-on-dark disabled:opacity-30 active:scale-90 transition-transform"
          >
            <HiMinus size={20} />
          </button>
        </div>
      )}

      {/* Bottom controls with gradient */}
      <div className="relative z-20 pb-6">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-center gap-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center rounded-full text-on-dark/70 hover:text-on-dark transition-colors"
            title="Pilih dari galeri"
          >
            <HiPhotograph size={22} />
          </button>

          <button
            onClick={onCapture}
            disabled={!isCameraReady}
            className="w-16 h-16 rounded-full bg-on-dark flex items-center justify-center shadow-elevated active:scale-90 transition-transform disabled:opacity-40"
          >
            <div className="w-12 h-12 rounded-full border-2 border-primary" />
          </button>

          {isCameraReady && (
            <button
              onClick={onSwitchCamera}
              className="w-12 h-12 flex items-center justify-center rounded-full text-on-dark/70 hover:text-on-dark transition-colors"
              title="Ganti kamera"
            >
              <HiSwitchHorizontal size={22} />
            </button>
          )}
          {!isCameraReady && <div className="w-12" />}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default CameraView
