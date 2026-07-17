let _listeners = []
let _isFull = false

export function isStorageFull() {
  return _isFull
}

export function setStorageFull(value) {
  _isFull = value
  _listeners.forEach(fn => fn(value))
}

export function onStorageFullChange(fn) {
  _listeners.push(fn)
  return () => { _listeners = _listeners.filter(f => f !== fn) }
}
