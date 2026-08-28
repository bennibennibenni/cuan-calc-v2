import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProfitLoss } from '@/pages/stock-investment/ProfitLoss'
import { MemoryRouter } from 'react-router-dom'

describe('ProfitLoss page', () => {
  it('calculates profit percentage and displays formatted result', async () => {
    render(
      <MemoryRouter>
        <ProfitLoss />
      </MemoryRouter>
    )
    const price1 = screen.getByLabelText('Cost price') as HTMLInputElement
    const price2 = screen.getByLabelText('Selling price') as HTMLInputElement

    fireEvent.change(price1, { target: { value: '1000' } })
    fireEvent.change(price2, { target: { value: '1500' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const result = await screen.findByText(/50[.,]00%/)
    expect(result).toBeTruthy()
  })
})
