import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Ratios } from '@/pages/Ratios'
import { MemoryRouter } from 'react-router-dom'

describe('Ratios page', () => {
  it('computes missing ratio when three inputs provided', async () => {
    render(
      <MemoryRouter>
        <Ratios />
      </MemoryRouter>
    )
    const val1 = screen.getByLabelText('First value (a)') as HTMLInputElement
    const val2 = screen.getByLabelText('Second value (b)') as HTMLInputElement
    const val3 = screen.getByLabelText('Third value (c)') as HTMLInputElement

    fireEvent.change(val1, { target: { value: '2' } })
    fireEvent.change(val2, { target: { value: '4' } })
    fireEvent.change(val3, { target: { value: '3' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const result = await screen.findByText('6')
    expect(result).toBeTruthy()
  })
})
