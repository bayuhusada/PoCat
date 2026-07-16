import sharp from 'sharp'
import { existsSync, unlinkSync } from 'fs'
import { resolve } from 'path'

const sizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
]

const input = resolve('cat.png')

if (!existsSync(input)) {
  console.error('cat.png not found in project root!')
  process.exit(1)
}

for (const { name, size } of sizes) {
  const output = resolve('public', name)
  if (existsSync(output) && name !== 'pwa-192x192.png' && name !== 'pwa-512x512.png') {
    unlinkSync(output)
  }
  await sharp(input)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(output)
  console.log(`✅ ${name} (${size}x${size})`)
}

console.log('\n🎉 All icons generated!')
