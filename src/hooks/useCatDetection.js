import { useState, useCallback } from 'react'
import { loadModel, detectCats, isLoadingModel } from '../lib/tensorflow'

export default function useCatDetection() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [result, setResult] = useState(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelReady, setModelReady] = useState(false)

  const loadModelAndDetect = useCallback(async (imageSrc) => {
    setIsDetecting(true)
    setResult(null)

    try {
      if (!modelReady) {
        setModelLoading(true)
        await loadModel()
        setModelReady(true)
        setModelLoading(false)
      }

      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageSrc
      })

      const catDetections = await detectCats(img)
      const found = catDetections.length > 0

      setResult({
        found,
        count: catDetections.length,
        detections: catDetections,
        confidence: found ? Math.round(catDetections[0].score * 100) : 0,
      })

      return found
    } catch (err) {
      console.error('Detection error:', err)
      setModelLoading(false)
      setResult({ found: false, error: true, count: 0, detections: [], confidence: 0 })
      return false
    } finally {
      setIsDetecting(false)
    }
  }, [modelReady])

  const reset = useCallback(() => {
    setIsDetecting(false)
    setResult(null)
  }, [])

  return {
    isDetecting,
    result,
    modelLoading,
    modelReady,
    loadModelAndDetect,
    reset,
  }
}
