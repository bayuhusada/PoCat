import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCamera, HiMap, HiBadgeCheck } from 'react-icons/hi'

const slides = [
  {
    icon: HiCamera,
    title: 'Temukan Kucing',
    description: 'Arahkan kamera ke kucing di sekitarmu, potret, dan koleksi!',
    color: 'bg-pastel-yellow',
  },
  {
    icon: HiBadgeCheck,
    title: 'Koleksi & Badge',
    description: 'Lengkapi CatDex-mu, kumpulkan badge, dan naikkan level!',
    color: 'bg-pastel-teal',
  },
  {
    icon: HiMap,
    title: 'Jelajah Dunia',
    description: 'Tandai lokasi penemuan kucing dan lihat di peta interaktif!',
    color: 'bg-pastel-coral',
  },
]

function OnboardingFlow({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const slide = slides[current]

  function next() {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      onComplete()
    }
  }

  function skip() {
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-canvas flex flex-col safe-top safe-bottom"
    >
      {/* Skip button */}
      <div className="flex justify-end px-4 pt-3">
        <button
          onClick={skip}
          className="text-sm text-slate font-medium px-4 py-2 rounded-full hover:bg-surface transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="flex flex-col items-center gap-6"
          >
            <div className={`w-28 h-28 rounded-3xl ${slide.color} flex items-center justify-center`}>
              <slide.icon size={48} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary text-center">
              {slide.title}
            </h2>
            <p className="text-slate text-sm text-center max-w-[280px] leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + Button */}
      <div className="px-8 pb-8 flex flex-col items-center gap-6">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary' : 'bg-hairline-strong'
              }`}
            />
          ))}
        </div>

        {/* Next / Get Started */}
        <button
          onClick={next}
          className="w-full bg-primary text-on-dark rounded-full py-3.5 text-sm font-medium shadow-card active:scale-[0.98] transition-transform"
        >
          {current < slides.length - 1 ? 'Lanjut' : 'Mulai Hunting!'}
        </button>
      </div>
    </motion.div>
  )
}

export default OnboardingFlow
