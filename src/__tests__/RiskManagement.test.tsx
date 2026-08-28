import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RiskManagement } from '@/pages/stock-investment/RiskManagement'
import { MemoryRouter } from 'react-router-dom'

describe('RiskManagement page', () => {
  it('calculates and displays take profit and stop loss percentages', async () => {
    render(
      <MemoryRouter>
        <RiskManagement />
      </MemoryRouter>
    )
    const market = screen.getByLabelText('Market price') as HTMLInputElement
    const tp = screen.getByLabelText('Take profit price') as HTMLInputElement
    const sl = screen.getByLabelText('Stop loss price') as HTMLInputElement

    fireEvent.change(market, { target: { value: '10000' } })
    fireEvent.change(tp, { target: { value: '12000' } })
    fireEvent.change(sl, { target: { value: '9000' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const tpResult = await screen.findByText(/20[.,]00%/)
    const slResult = await screen.findByText(/10[.,]00%/)
    expect(tpResult).toBeTruthy()
    expect(slResult).toBeTruthy()
  })
})
