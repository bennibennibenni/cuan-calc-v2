import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ProfitLoss } from '@/pages/stock-investment/ProfitLoss'
import { MemoryRouter } from 'react-router-dom'

describe('ProfitLoss page', () => {
  it('calculates percent on blur and displays formatted result', async () => {
    render(
      <MemoryRouter>
        <ProfitLoss />
      </MemoryRouter>
    )
    const price1 = screen.getByLabelText('Price 1') as HTMLInputElement
    const price2 = screen.getByLabelText('Price 2') as HTMLInputElement

    await userEvent.type(price1, '1000')
    price1.blur()
    await userEvent.type(price2, '1500')
    price2.blur()

    // result should be visible and contain % sign
    const result = await screen.findByText(/%$/)
    expect(result).toBeTruthy()
  })
})
