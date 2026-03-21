import { describe, it, expect } from 'vitest'
import { formatIdr } from '@/utils/format'

describe('formatIdr', () => {
  it('formats integer values with dots and prefix', () => {
    expect(formatIdr(1000000)).toBe('Rp 1.000.000')
  })

  it('formats with decimals when requested', () => {
    expect(formatIdr(1234.5, 2)).toBe('Rp 1.234,50')
  })
})
