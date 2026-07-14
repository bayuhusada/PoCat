import toast from 'react-hot-toast'

const frameOverlay = {
  classic: { color: '#050038', width: 8 },
  pink: { color: '#F472B6', width: 8 },
  pixel: { color: '#6BCB77', width: 8 },
  nature: { color: '#10B981', width: 8 },
  neon: { color: '#00FF88', width: 8 },
  halloween: { color: '#FF6B35', width: 8 },
  christmas: { color: '#EF4444', width: 8 },
  legendary: { color: '#FFD700', width: 10 },
}

async function generateShareCard(cat) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = 1080
  canvas.height = 1350

  // Background
  ctx.fillStyle = '#050038'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Load cat photo
  const img = await loadImage(cat.photo)

  // Photo area (rounded rect)
  const photoSize = 800
  const photoX = (canvas.width - photoSize) / 2
  const photoY = 180

  ctx.save()
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 40)
  ctx.clip()
  ctx.drawImage(img, photoX, photoY, photoSize, photoSize)
  ctx.restore()

  // Frame overlay
  const frame = frameOverlay[cat.frame] || frameOverlay.classic
  ctx.save()
  ctx.strokeStyle = frame.color
  ctx.lineWidth = frame.width * 2
  roundRect(ctx, photoX + 4, photoY + 4, photoSize - 8, photoSize - 8, 36)
  ctx.stroke()
  ctx.restore()

  // Glow effect for legendary
  if (cat.frame === 'legendary') {
    ctx.save()
    ctx.shadowColor = '#FFD700'
    ctx.shadowBlur = 40
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 6
    roundRect(ctx, photoX + 2, photoY + 2, photoSize - 4, photoSize - 4, 38)
    ctx.stroke()
    ctx.restore()
  }

  // "CAT FOUND" header
  ctx.fillStyle = '#FFD02A'
  ctx.font = 'bold 36px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('CAT FOUND', canvas.width / 2, 110)

  // Cat emoji
  ctx.font = '64px system-ui, sans-serif'
  ctx.fillText('🐱', canvas.width / 2, 170)

  // Name
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 56px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(cat.name, canvas.width / 2, 1100)

  // Location
  if (cat.latitude && cat.longitude) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '32px system-ui, sans-serif'
    const loc = cat.location_name
      ? cat.location_name
      : `${cat.latitude.toFixed(4)}, ${cat.longitude.toFixed(4)}`
    ctx.fillText(`📍 ${loc}`, canvas.width / 2, 1160)
  }

  // Date
  const date = new Date(cat.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '28px system-ui, sans-serif'
  ctx.fillText(date, canvas.width / 2, 1210)

  // Logo
  ctx.fillStyle = '#FFD02A'
  ctx.font = 'bold 28px system-ui, sans-serif'
  ctx.fillText('PokeCat', canvas.width / 2, 1280)

  // Bottom bar
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, canvas.height - 8, canvas.width, 8)

  return canvas
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export async function shareCat(cat) {
  try {
    const canvas = await generateShareCard(cat)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) { toast.error('Gagal membuat kartu'); return }

    // Try Web Share API
    if (navigator.share && navigator.canShare({ files: [new File([blob], 'pokecat-card.png', { type: 'image/png' })] })) {
      const file = new File([blob], 'pokecat-card.png', { type: 'image/png' })
      await navigator.share({
        title: `PokeCat - ${cat.name}`,
        text: `Aku menemukan ${cat.name}! 🐱`,
        files: [file],
      })
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pokecat-${cat.name.toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Kartu berhasil di-download!')
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      toast.error('Gagal membagikan')
    }
  }
}

export default generateShareCard
