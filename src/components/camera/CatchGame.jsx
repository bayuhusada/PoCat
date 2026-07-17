import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiRefresh } from 'react-icons/hi'

function Pokeball({ size = 100 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(to bottom, #EE1515 0%, #EE1515 50%, #F0F0F0 50%, #F0F0F0 100%)',
        border: '4px solid #333',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 6, background: '#333', transform: 'translateY(-50%)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 30, height: 30,
        borderRadius: '50%', background: 'white',
        border: '4px solid #333', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 14, height: 14,
          borderRadius: '50%', background: 'white',
          border: '3px solid #333',
        }} />
      </div>
    </div>
  )
}

const spring = { type: 'spring', stiffness: 400, damping: 20 }

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

const sparklePositions = [
  { x: -60, y: -60 }, { x: 60, y: -60 }, { x: -80, y: 0 }, { x: 80, y: 0 },
  { x: -60, y: 60 }, { x: 60, y: 60 }, { x: 0, y: -80 }, { x: 0, y: 80 },
]

function ResultContent({ result, onRetry, onContinue }) {
  if (result?.error) {
    return (
      <motion.div
        key="error"
        variants={resultVariants} initial="hidden" animate="visible"
        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 rounded-3xl px-6"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pastel-coral flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-on-dark text-lg font-semibold">Gagal memindai</p>
          <p className="text-on-dark-muted text-sm text-center">
            Coba lagi atau upload foto yang lebih jelas
          </p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-on-dark text-primary rounded-full px-6 py-2.5 text-sm font-medium"
          >
            <HiRefresh size={16} />
            Coba Lagi
          </button>
        </div>
      </motion.div>
    )
  }

  const isCaught = result?.found

  return (
    <motion.div
      key={isCaught ? 'caught' : 'escaped'}
      variants={resultVariants} initial="hidden" animate="visible"
      className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-3xl px-6"
      style={{
        background: isCaught
          ? 'linear-gradient(135deg, rgba(107,203,119,0.92), rgba(5,0,56,0.85))'
          : 'rgba(0,0,0,0.72)',
      }}
    >
      {isCaught ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-on-dark flex items-center justify-center">
              <span className="text-4xl">🐱</span>
            </div>
            {sparklePositions.map((pos, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: pos.x, y: pos.y, opacity: 0, scale: 1.5,
                  transition: { duration: 0.9, delay: i * 0.04 },
                }}
                className="absolute text-xl"
              >✨</motion.span>
            ))}
          </div>
          <p className="text-on-dark text-2xl font-bold">Cat Found! 🐱</p>
          {result.confidence > 0 && (
            <p className="text-on-dark-muted text-sm">{result.confidence}% yakin ini kucing</p>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="bg-on-dark text-primary rounded-full px-10 py-3 text-sm font-bold shadow-card"
          >
            Lanjutkan
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 40, opacity: 0, transition: { duration: 0.8, delay: 0.3 } }}
          >
            <div className="w-20 h-20 rounded-full bg-pastel-coral flex items-center justify-center">
              <span className="text-4xl">😿</span>
            </div>
          </motion.div>
          <p className="text-on-dark text-lg font-semibold">Kucingnya Kabur!</p>
          <p className="text-on-dark-muted text-sm text-center">
            Coba cari kucing lain atau upload foto yang lebih jelas
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex items-center gap-2 bg-on-dark text-primary rounded-full px-6 py-2.5 text-sm font-medium"
          >
            <HiRefresh size={16} />
            Coba Lagi
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

function LoadingOverlay() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 rounded-3xl"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-on-dark-muted border-t-on-dark rounded-full animate-spin" />
        <p className="text-on-dark text-sm font-medium">Memuat AI...</p>
      </div>
    </motion.div>
  )
}

const shakeVariants = {
  shake: {
    x: [0, -12, 12, -8, 8, -4, 4, 0],
    rotate: [0, -8, 8, -5, 5, -2, 2, 0],
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
  },
}

function CatchGame({ isDetecting, result, modelLoading, onRetry, onContinue }) {
  const gameType = useRef(Math.floor(Math.random() * 3)).current
  const [phase, setPhase] = useState('idle')
  const [ballPhase, setBallPhase] = useState('idle')
  const [tapCount, setTapCount] = useState(0)
  const [paws, setPaws] = useState([])
  const [swipeProgress, setSwipeProgress] = useState(0)
  const containerRef = useRef(null)

  const aiDone = !isDetecting && result != null

  useEffect(() => {
    if (aiDone && phase !== 'result') {
      const delay = phase === 'playing' ? 500 : 0
      const timer = setTimeout(() => setPhase('result'), delay)
      return () => clearTimeout(timer)
    }
  }, [aiDone, phase])

  const handlePokeballTap = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('playing')
    setBallPhase('thrown')
    setTimeout(() => setBallPhase('shaking'), 600)
  }, [phase])

  const handleRapidTap = useCallback(() => {
    if (phase === 'result') return
    if (phase === 'idle') setPhase('playing')
    setTapCount(c => c + 1)
    const id = Date.now() + Math.random()
    setPaws(prev => [...prev, { id, x: 20 + Math.random() * 60, y: 15 + Math.random() * 30 }])
    setTimeout(() => setPaws(prev => prev.filter(p => p.id !== id)), 1200)
  }, [phase])

  const handlePointerDown = useCallback((e) => {
    if (phase === 'result') return
    if (phase === 'idle') setPhase('playing')
  }, [phase])

  const handlePointerMove = useCallback((e) => {
    if (phase !== 'playing' || gameType !== 2) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const y = e.clientY - rect.top
    const progress = Math.max(0, Math.min(100, ((rect.height - y) / rect.height) * 100))
    setSwipeProgress(progress)
  }, [phase, gameType])

  const handlePointerUp = useCallback(() => {
    if (gameType !== 2) return
  }, [gameType])

  if (modelLoading && !result) {
    return <LoadingOverlay />
  }

  if (phase === 'result' && result) {
    return (
      <AnimatePresence mode="wait">
        <ResultContent key="result" result={result} onRetry={onRetry} onContinue={onContinue} />
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {gameType === 0 && (
        <motion.div
          key="game0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 rounded-3xl"
        >
          {ballPhase === 'idle' ? (
            <motion.button
              onClick={handlePokeballTap}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Pokeball size={96} />
              </motion.div>
              <p className="text-on-dark text-base font-semibold">Tap untuk menangkap!</p>
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <motion.div
                animate={
                  ballPhase === 'thrown'
                    ? { y: -50, scale: 1.2, rotate: 720, transition: { duration: 0.6, ease: 'easeOut' } }
                    : shakeVariants.shake
                }
              >
                <Pokeball size={96} />
              </motion.div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-on-dark-muted border-t-on-dark rounded-full animate-spin" />
                <p className="text-on-dark-muted text-sm">Memindai...</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {gameType === 1 && (
        <motion.div
          key="game1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 rounded-3xl px-6"
        >
          <motion.button
            onClick={handleRapidTap}
            whileTap={{ scale: 0.92 }}
            className="relative flex flex-col items-center gap-4 w-full"
          >
            <div className="relative">
              <motion.span
                className="text-7xl block select-none"
                animate={tapCount > 0 ? { scale: [1, 1.2, 1], transition: { duration: 0.2 } } : {}}
              >🐾</motion.span>
              <AnimatePresence>
                {paws.map(paw => (
                  <motion.span
                    key={paw.id}
                    initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1.2, x: (paw.x - 50) * 0.5, y: -60 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute text-3xl pointer-events-none"
                    style={{ left: '50%', top: '50%' }}
                  >🐾</motion.span>
                ))}
              </AnimatePresence>
            </div>
            {tapCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={tapCount}
                className="text-on-dark text-3xl font-bold"
              >{tapCount}</motion.span>
            )}
            <p className="text-on-dark text-base font-semibold">
              {tapCount === 0 ? 'Tap kucingnya berkali-kali!' : 'Lagi! 🐾'}
            </p>
          </motion.button>
        </motion.div>
      )}

      {gameType === 2 && (
        <motion.div
          key="game2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={containerRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-end bg-black/50 rounded-3xl overflow-hidden select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-3xl"
            style={{
              height: `${swipeProgress}%`,
              background: swipeProgress > 50
                ? 'linear-gradient(to top, rgba(107,203,119,0.7), rgba(107,203,119,0.2))'
                : 'linear-gradient(to top, rgba(107,203,119,0.5), transparent)',
              transition: 'height 0.05s linear',
            }}
          />
          {swipeProgress > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute text-5xl"
              style={{ bottom: `${Math.max(swipeProgress, 10)}%` }}
            >🎣</motion.div>
          )}
          <div className="mb-12 flex flex-col items-center gap-3">
            {swipeProgress === 0 && (
              <>
                <motion.span
                  className="text-5xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >🎣</motion.span>
                <p className="text-on-dark text-base font-semibold">Geser ke atas untuk menjala!</p>
              </>
            )}
            {swipeProgress > 0 && swipeProgress < 50 && (
              <p className="text-on-dark-muted text-sm">Geser lagi!</p>
            )}
            {swipeProgress >= 50 && (
              <p className="text-on-dark text-sm font-medium">Mantap! 🎯</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CatchGame
