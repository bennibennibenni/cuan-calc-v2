import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { RiskManagement } from '@/pages/stock-investment/RiskManagement'
import { MemoryRouter } from 'react-router-dom'

describe('RiskManagement page', () => {
  it('displays percentage results on blur', async () => {
    render(
      <MemoryRouter>
        <RiskManagement />
      </MemoryRouter>
    )
    const market = screen.getByLabelText('Price') as HTMLInputElement
    const tp = screen.getByLabelText('Take profit') as HTMLInputElement
    const sl = screen.getByLabelText('Stop loss') as HTMLInputElement

    await userEvent.type(market, '10000')
    market.blur()
    await userEvent.type(tp, '11000')
    tp.blur()
    await userEvent.type(sl, '9000')
    sl.blur()

    const results = await screen.findAllByText(/%$/)
    expect(results.length).toBeGreaterThanOrEqual(2)
  })
})
