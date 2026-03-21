/** Format number with Indonesian-style thousands (e.g. 1.000.000) and optional decimals */
export function formatIdr(value: number, decimals = 0): string {
  const fixed = value.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return decPart ? `Rp ${withDots},${decPart}` : `Rp ${withDots}`
}
