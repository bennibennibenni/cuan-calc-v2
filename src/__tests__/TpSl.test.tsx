import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TpSl } from '@/pages/stock-investment/TpSl'
import { MemoryRouter } from 'react-router-dom'

describe('TpSl page', () => {
  it('calculates price after increase and shows formatted result', async () => {
    render(
      <MemoryRouter>
        <TpSl />
      </MemoryRouter>
    )
    const inc = screen.getByLabelText('Increase (%)') as HTMLInputElement
    const base = screen.getByLabelText('Base price (Increase)') as HTMLInputElement

    fireEvent.change(inc, { target: { value: '10' } })
    fireEvent.change(base, { target: { value: '10000' } })

    const calculateBtns = screen.getAllByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtns[0])

    const result = await screen.findByText(/Rp 11\.000/)
    expect(result).toBeTruthy()
  })
})
