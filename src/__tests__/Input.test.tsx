import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Input } from '@/components/Input'

describe('Input component', () => {
  it('renders with label and formats on blur', async () => {
    render(<Input label="Test Amount" formatThousands />)
    const input = screen.getByLabelText('Test Amount') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1000' } })
    fireEvent.blur(input)
    expect(input.value.includes('.') || input.value.includes(',')).toBe(true)
  })
})
