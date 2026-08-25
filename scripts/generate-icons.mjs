import { readFileSync, writeFileSync } from 'fs'

const canonicalIcon = readFileSync('public/favicon.svg', 'utf8')
const icons = {
  'public/icons/icon-192.svg': canonicalIcon,
  'public/icons/icon-512.svg': canonicalIcon,
  'public/icons/icon-maskable-192.svg': canonicalIcon,
  'public/icons/icon-maskable-512.svg': canonicalIcon,
}

for (const [path, content] of Object.entries(icons)) {
  writeFileSync(path, content)
  console.log(`Created ${path}`)
}