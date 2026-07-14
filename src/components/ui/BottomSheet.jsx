import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

function BottomSheet({ isOpen, onClose, title, children, showClose = true }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={backdropVariants}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            variants={sheetVariants}
            className="relative w-full bg-canvas rounded-t-3xl shadow-modal max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              {title && (
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
                >
                  <HiX size={20} className="text-slate" />
                </button>
              )}
            </div>
            <div className="px-5 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomSheet
