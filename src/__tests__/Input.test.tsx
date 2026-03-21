import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from '@/components/Input'

describe('Input component', () => {
  it('renders with label and formats on blur', async () => {
    render(<Input label="Test Amount" formatThousands />)
    const input = screen.getByLabelText('Test Amount') as HTMLInputElement
    await userEvent.type(input, '1000')
    input.blur()
    // after blur the input should contain a thousands separator (dot)
    expect(input.value.includes('.') || input.value.includes(',')).toBe(true)
  })
})
