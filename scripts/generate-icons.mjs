import { readFileSync, writeFileSync } from 'fs'
import { deflateSync, inflateSync } from 'zlib'

// CRC32 table
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  }
  crcTable[n] = c
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF]
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

function decodePng(buf) {
  let offset = 8
  let width, height, bitDepth, colorType
  const idatChunks = []

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)
    const data = buf.subarray(offset + 8, offset + 8 + length)
    offset += 12 + length

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  const idatCombined = Buffer.concat(idatChunks)
  const inflated = inflateSync(idatCombined)

  const bpp = colorType === 6 ? 4 : (colorType === 2 ? 3 : 4)
  const rowBytes = width * bpp
  const rgba = new Uint8Array(width * height * 4)

  let srcPos = 0
  const prior = new Uint8Array(rowBytes)
  const current = new Uint8Array(rowBytes)

  for (let y = 0; y < height; y++) {
    const filter = inflated[srcPos++]
    for (let i = 0; i < rowBytes; i++) {
      current[i] = inflated[srcPos++]
    }

    if (filter === 0) {
      // None
    } else if (filter === 1) {
      // Sub
      for (let x = bpp; x < rowBytes; x++) {
        current[x] = (current[x] + current[x - bpp]) & 0xFF
      }
    } else if (filter === 2) {
      // Up
      for (let x = 0; x < rowBytes; x++) {
        current[x] = (current[x] + prior[x]) & 0xFF
      }
    } else if (filter === 3) {
      // Average
      for (let x = 0; x < rowBytes; x++) {
        const left = x >= bpp ? current[x - bpp] : 0
        const up = prior[x]
        current[x] = (current[x] + Math.floor((left + up) / 2)) & 0xFF
      }
    } else if (filter === 4) {
      // Paeth
      for (let x = 0; x < rowBytes; x++) {
        const left = x >= bpp ? current[x - bpp] : 0
        const up = prior[x]
        const upLeft = x >= bpp ? prior[x - bpp] : 0
        current[x] = (current[x] + paeth(left, up, upLeft)) & 0xFF
      }
    }

    prior.set(current)

    // Convert to RGBA
    const dstRowOffset = y * width * 4
    if (bpp === 4) {
      rgba.set(current, dstRowOffset)
    } else if (bpp === 3) {
      for (let x = 0; x < width; x++) {
        const si = x * 3
        const di = dstRowOffset + x * 4
        rgba[di] = current[si]
        rgba[di + 1] = current[si + 1]
        rgba[di + 2] = current[si + 2]
        rgba[di + 3] = 255
      }
    }
  }

  return { width, height, rgba }
}

function encodePng(width, height, rgba) {
  const rowLen = width * 4 + 1
  const raw = Buffer.alloc(rowLen * height)

  for (let y = 0; y < height; y++) {
    raw[y * rowLen] = 0 // Filter type 0 (None)
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * rowLen + 1)
  }

  const deflated = deflateSync(raw, { level: 9 })

  function makeChunk(typeStr, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const type = Buffer.from(typeStr, 'ascii')
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(Buffer.concat([type, data])), 0)
    return Buffer.concat([len, type, data, crcBuf])
  }

  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  return Buffer.concat([
    header,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

// Bilinear resize & composite
function renderIcon(src, dstW, dstH, scaleRatio, bgColor = null) {
  const dst = new Uint8Array(dstW * dstH * 4)

  // Fill background
  if (bgColor) {
    for (let i = 0; i < dstW * dstH; i++) {
      dst[i * 4] = bgColor[0]
      dst[i * 4 + 1] = bgColor[1]
      dst[i * 4 + 2] = bgColor[2]
      dst[i * 4 + 3] = bgColor[3]
    }
  }

  const targetW = dstW * scaleRatio
  const targetH = dstH * scaleRatio
  const offsetX = (dstW - targetW) / 2
  const offsetY = (dstH - targetH) / 2

  const xRatio = src.width / targetW
  const yRatio = src.height / targetH

  for (let dy = 0; dy < dstH; dy++) {
    const srcYFloat = (dy - offsetY) * yRatio
    if (srcYFloat < 0 || srcYFloat >= src.height - 1) continue
    const y0 = Math.floor(srcYFloat)
    const y1 = Math.min(y0 + 1, src.height - 1)
    const yWeight = srcYFloat - y0

    for (let dx = 0; dx < dstW; dx++) {
      const srcXFloat = (dx - offsetX) * xRatio
      if (srcXFloat < 0 || srcXFloat >= src.width - 1) continue
      const x0 = Math.floor(srcXFloat)
      const x1 = Math.min(x0 + 1, src.width - 1)
      const xWeight = srcXFloat - x0

      const idx00 = (y0 * src.width + x0) * 4
      const idx10 = (y0 * src.width + x1) * 4
      const idx01 = (y1 * src.width + x0) * 4
      const idx11 = (y1 * src.width + x1) * 4

      // Bilinear interpolation for RGBA
      const outIdx = (dy * dstW + dx) * 4
      const w00 = (1 - xWeight) * (1 - yWeight)
      const w10 = xWeight * (1 - yWeight)
      const w01 = (1 - xWeight) * yWeight
      const w11 = xWeight * yWeight

      const sR = w00 * src.rgba[idx00] + w10 * src.rgba[idx10] + w01 * src.rgba[idx01] + w11 * src.rgba[idx11]
      const sG = w00 * src.rgba[idx00 + 1] + w10 * src.rgba[idx10 + 1] + w01 * src.rgba[idx01 + 1] + w11 * src.rgba[idx11 + 1]
      const sB = w00 * src.rgba[idx00 + 2] + w10 * src.rgba[idx10 + 2] + w01 * src.rgba[idx01 + 2] + w11 * src.rgba[idx11 + 2]
      const sA = (w00 * src.rgba[idx00 + 3] + w10 * src.rgba[idx10 + 3] + w01 * src.rgba[idx01 + 3] + w11 * src.rgba[idx11 + 3]) / 255

      if (sA <= 0) continue

      if (bgColor) {
        // Alpha blend over background
        const bgR = dst[outIdx]
        const bgG = dst[outIdx + 1]
        const bgB = dst[outIdx + 2]
        dst[outIdx] = Math.round(sR * sA + bgR * (1 - sA))
        dst[outIdx + 1] = Math.round(sG * sA + bgG * (1 - sA))
        dst[outIdx + 2] = Math.round(sB * sA + bgB * (1 - sA))
        dst[outIdx + 3] = 255
      } else {
        dst[outIdx] = Math.round(sR)
        dst[outIdx + 1] = Math.round(sG)
        dst[outIdx + 2] = Math.round(sB)
        dst[outIdx + 3] = Math.round(sA * 255)
      }
    }
  }

  return { width: dstW, height: dstH, rgba: dst }
}

// 1. Read base64 source from favicon.svg
const rawSvg = readFileSync('public/favicon.svg', 'utf8')
const match = rawSvg.match(/href="data:image\/png;base64,([^"]+)"/)
if (!match) throw new Error('Could not find base64 image in public/favicon.svg')

const base64Str = match[1]
const srcPngBuf = Buffer.from(base64Str, 'base64')
const srcDecoded = decodePng(srcPngBuf)
console.log(`Source PNG decoded: ${srcDecoded.width}x${srcDecoded.height}`)

// Theme color: #0e1221 -> RGB(14, 18, 33)
const THEME_BG = [14, 18, 33, 255]

// 2. Generate PNGs:
// Maskable icons: 512x512 and 192x192 with safe zone padding (68% scale) + theme background
// Android / Xiaomi maskable safe zone is 80% circle (radius 40% from center).
// 68% scale guarantees the entire 3D calculator and its rounded borders sit comfortably inside the safe zone!
const maskable512 = renderIcon(srcDecoded, 512, 512, 0.68, THEME_BG)
const maskable192 = renderIcon(srcDecoded, 192, 192, 0.68, THEME_BG)

// Apple touch icon: 180x180 with theme background and 74% scale (iOS rounded corners will mask the background, not the calculator)
const appleTouch180 = renderIcon(srcDecoded, 180, 180, 0.74, THEME_BG)

// Any/standard icons: transparent with safe breathing room (82% scale)
const standard512 = renderIcon(srcDecoded, 512, 512, 0.82, null)
const standard192 = renderIcon(srcDecoded, 192, 192, 0.82, null)
const fav32 = renderIcon(srcDecoded, 32, 32, 0.86, null)
const fav16 = renderIcon(srcDecoded, 16, 16, 0.86, null)

// Write PNG files to public/icons/
writeFileSync('public/icons/android-chrome-512x512.png', encodePng(maskable512.width, maskable512.height, maskable512.rgba))
writeFileSync('public/icons/android-chrome-192x192.png', encodePng(maskable192.width, maskable192.height, maskable192.rgba))
writeFileSync('public/icons/icon-maskable-512.png', encodePng(maskable512.width, maskable512.height, maskable512.rgba))
writeFileSync('public/icons/icon-maskable-192.png', encodePng(maskable192.width, maskable192.height, maskable192.rgba))
writeFileSync('public/icons/icon-512.png', encodePng(standard512.width, standard512.height, standard512.rgba))
writeFileSync('public/icons/icon-192.png', encodePng(standard192.width, standard192.height, standard192.rgba))
writeFileSync('public/icons/apple-touch-icon.png', encodePng(appleTouch180.width, appleTouch180.height, appleTouch180.rgba))
writeFileSync('public/icons/favicon-32x32.png', encodePng(fav32.width, fav32.height, fav32.rgba))
writeFileSync('public/icons/favicon-16x16.png', encodePng(fav16.width, fav16.height, fav16.rgba))

// 3. Generate SVGs:
// Maskable SVGs with background rect and 68% scaled image
const maskableSvg512 = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0e1221"/>
  <image width="348" height="348" x="82" y="82" href="data:image/png;base64,${base64Str}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`

const maskableSvg192 = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" fill="#0e1221"/>
  <image width="130" height="130" x="31" y="31" href="data:image/png;base64,${base64Str}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`

// Standard SVGs with breathing room
const standardSvg512 = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <image width="420" height="420" x="46" y="46" href="data:image/png;base64,${base64Str}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`

const standardSvg192 = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 192 192" width="192" height="192">
  <image width="158" height="158" x="17" y="17" href="data:image/png;base64,${base64Str}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`

writeFileSync('public/icons/icon-maskable-512.svg', maskableSvg512)
writeFileSync('public/icons/icon-maskable-192.svg', maskableSvg192)
writeFileSync('public/icons/icon-512.svg', standardSvg512)
writeFileSync('public/icons/icon-192.svg', standardSvg192)
writeFileSync('public/favicon.svg', standardSvg512)

const manifestContent = JSON.stringify({
  name: 'Cuan Calculator — Track and Forecast Your Gains',
  short_name: 'Cuan Calc',
  description: 'Track and forecast your gains with stock investment, money management, currency converter, and financial ratio tools.',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: '/icons/icon-maskable-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
    { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
  ],
  theme_color: '#7c3aed',
  background_color: '#0e1221',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
}, null, 2)

writeFileSync('public/manifest.webmanifest', manifestContent)
writeFileSync('public/icons/site.webmanifest', manifestContent)

console.log('All icons generated successfully!')