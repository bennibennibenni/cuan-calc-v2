import { writeFileSync } from 'fs'

const icons = {
  'public/icons/icon-192.svg': `<svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="192" y2="192" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#22D3EE"/><stop offset="50%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#FCD34D"/></linearGradient></defs><rect width="192" height="192" rx="36" fill="url(#g)"/><rect x="36" y="36" width="120" height="120" rx="18" fill="#0e1221"/><text x="96" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="900" fill="#C4B5FD">$</text></svg>`,
  'public/icons/icon-512.svg': `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#22D3EE"/><stop offset="50%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#FCD34D"/></linearGradient></defs><rect width="512" height="512" rx="96" fill="url(#g)"/><rect x="96" y="96" width="320" height="320" rx="48" fill="#0e1221"/><text x="256" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="256" font-weight="900" fill="#C4B5FD">$</text></svg>`,
  'public/icons/icon-maskable-192.svg': `<svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="192" height="192" rx="36" fill="#0e1221"/><text x="96" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="900" fill="#C4B5FD">$</text></svg>`,
  'public/icons/icon-maskable-512.svg': `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="96" fill="#0e1221"/><text x="256" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="256" font-weight="900" fill="#C4B5FD">$</text></svg>`,
}

for (const [path, content] of Object.entries(icons)) {
  writeFileSync(path, content)
  console.log(`Created ${path}`)
}