import { useState } from 'react'
import frames from '../../data/frames'
import BottomSheet from '../ui/BottomSheet'

const frameStyles = {
  classic: 'border-4 border-primary',
  pink: 'border-4 border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.5)]',
  pixel: 'border-4 border-success shadow-[inset_0_0_0_2px_rgba(107,203,119,0.5)]',
  nature: 'border-4 border-emerald-500/60',
  neon: 'border-4 border-[#00FF88] shadow-[0_0_16px_rgba(0,255,136,0.5)]',
  halloween: 'border-4 border-[#FF6B35] shadow-[0_0_12px_rgba(255,107,53,0.4)]',
  christmas: 'border-4 border-red-500 shadow-[0_0_12px_rgba(229,57,53,0.4)]',
  legendary: 'border-4 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.6)]',
}

function FramePicker({ isOpen, onClose, onSelect, previewImage }) {
  const [selected, setSelected] = useState('classic')

  function handleSelect(frameId) {
    setSelected(frameId)
    onSelect(frameId)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Pilih Frame">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => handleSelect(frame.id)}
            className={`
              flex-shrink-0 w-28 snap-center rounded-2xl overflow-hidden
              transition-all duration-150
              ${selected === frame.id ? 'ring-2 ring-primary scale-105' : 'opacity-70'}
            `}
          >
            <div className="aspect-[3/4] bg-surface relative overflow-hidden rounded-2xl">
              {previewImage && (
                <img
                  src={previewImage}
                  alt={frame.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className={`absolute inset-0 ${frameStyles[frame.id] || frameStyles.classic}`} />
            </div>
            <p className="text-[11px] font-semibold text-center mt-1.5 text-primary tracking-wider uppercase">
              {frame.name}
            </p>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}

export default FramePicker
