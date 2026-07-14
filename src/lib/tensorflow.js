import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

let model = null
let isLoading = false
let loadPromise = null

export async function loadModel() {
  if (model) return model
  if (loadPromise) return loadPromise

  isLoading = true
  loadPromise = (async () => {
    await tf.ready()
    model = await cocoSsd.load()
    isLoading = false
    return model
  })()

  return loadPromise
}

export function isModelLoaded() {
  return model !== null
}

export function isLoadingModel() {
  return isLoading
}

export async function detectCats(imageElement) {
  if (!model) await loadModel()
  const predictions = await model.detect(imageElement)
  return predictions.filter(p => p.class === 'cat')
}

export function getLoadingProgress() {
  return isLoading ? 0.5 : model ? 1 : 0
}
