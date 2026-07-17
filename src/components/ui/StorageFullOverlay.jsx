import { motion } from 'framer-motion'

function StorageFullOverlay({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center px-8"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="text-7xl mb-6"
      >😿</motion.span>
      <h1 className="text-2xl font-bold text-on-dark text-center mb-3 leading-relaxed">
        Maaf, penyimpanan web penuh
      </h1>
      <p className="text-on-dark-muted text-sm text-center max-w-[280px] mb-8 leading-relaxed">
        Maklum gratisan, developernya ga modal hehe
      </p>
      <p className="text-on-dark-muted text-xs text-center mb-5 max-w-[260px]">
        hapus beberapa foto lama biar bisa hunting lagi 🐱, 
      </p>
      <p className="text-on-dark-muted text-xl text-center max-w-[260px]">
        Doain biar developernya cepet kaya ya, "AMIN" 
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-10 px-6 py-2.5 rounded-full bg-on-dark/20 text-on-dark text-sm font-medium active:scale-95 transition-transform"
        >
          Tutup
        </button>
      )}
    </motion.div>
  )
}

export default StorageFullOverlay
