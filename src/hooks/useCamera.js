import { useState, useRef, useCallback, useEffect } from 'react'

function isSecureContext() {
  return window.isSecureContext || location.protocol === 'https:'
}

function isMediaDevicesSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

export default function useCamera() {
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [flash, setFlash] = useState(false)
  const [showFallback, setShowFallback] = useState(
    !isSecureContext() || !isMediaDevicesSupported()
  )
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    if (!isSecureContext() || !isMediaDevicesSupported()) return
    checkCameraAvailability()
  }, [])

  async function checkCameraAvailability() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasCamera = devices.some(d => d.kind === 'videoinput')
      if (!hasCamera) {
        setShowFallback(true)
        setCameraError('no_camera')
      }
    } catch {
      setShowFallback(true)
      setCameraError('no_camera')
    }
  }

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true)
    setCameraError(null)
    setShowFallback(false)
  }, [])

  const handleUserMediaError = useCallback((err) => {
    console.error('Camera error:', err)
    setCameraError('permission_denied')
    setShowFallback(true)
    setIsCameraReady(false)
  }, [])

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
    setIsCameraReady(false)
  }, [])

  const capture = useCallback(() => {
    if (!webcamRef.current) return null

    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setFlash(true)
      setTimeout(() => setFlash(false), 200)
      return imageSrc
    }
    return null
  }, [])

  const retake = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const handleFileUpload = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        setCapturedImage(dataUrl)
        resolve(dataUrl)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const clearCaptured = useCallback(() => {
    setCapturedImage(null)
  }, [])

  return {
    webcamRef,
    facingMode,
    isCameraReady,
    cameraError,
    capturedImage,
    flash,
    showFallback,
    zoomLevel,
    setZoomLevel,
    handleUserMedia,
    handleUserMediaError,
    switchCamera,
    capture,
    retake,
    handleFileUpload,
    clearCaptured,
  }
}
