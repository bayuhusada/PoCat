import { motion } from 'framer-motion'

const slideVariants = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
}

function ViewStack({ children }) {
  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      className="h-full overflow-y-auto overflow-x-hidden pb-[106px]"
    >
      {children}
    </motion.div>
  )
}

export default ViewStack
