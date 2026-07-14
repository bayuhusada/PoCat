import { motion, AnimatePresence } from 'framer-motion'
import { HiRefresh } from 'react-icons/hi'

function AIDetection({ isDetecting, result, modelLoading, onRetry, onContinue }) {
  return (
    <AnimatePresence mode="wait">
      {isDetecting && (
        <motion.div
          key="detecting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 rounded-3xl"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-on-dark-muted border-t-on-dark rounded-full animate-spin" />
            <p className="text-on-dark text-sm font-medium">
              {modelLoading ? 'Memuat AI...' : 'Memindai...'}
            </p>
          </div>
        </motion.div>
      )}

      {result && !isDetecting && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 rounded-3xl px-6"
        >
          {result.error ? (
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
          ) : result.found ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
                <span className="text-2xl">🐱</span>
              </div>
              <p className="text-on-dark text-lg font-semibold">Cat Found!</p>
              <p className="text-on-dark-muted text-sm">
                {result.confidence}% yakin ini kucing
              </p>
              <button
                onClick={onContinue}
                className="bg-on-dark text-primary rounded-full px-8 py-2.5 text-sm font-medium shadow-card active:scale-95 transition-transform"
              >
                Lanjutkan
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-pastel-coral flex items-center justify-center">
                <span className="text-2xl">😕</span>
              </div>
              <p className="text-on-dark text-lg font-semibold">No Cat Detected</p>
              <p className="text-on-dark-muted text-sm text-center">
                Pastikan kucing terlihat jelas di foto
              </p>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 bg-on-dark text-primary rounded-full px-6 py-2.5 text-sm font-medium"
              >
                <HiRefresh size={16} />
                Coba Lagi
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AIDetection
