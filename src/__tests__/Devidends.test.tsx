import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Devidends } from '@/pages/stock-investment/Devidends'
import { MemoryRouter } from 'react-router-dom'

describe('Devidends page', () => {
  it('calculates and displays currency results', async () => {
    render(
      <MemoryRouter>
        <Devidends />
      </MemoryRouter>
    )
    const lot = screen.getByLabelText('Lot') as HTMLInputElement
    const dps = screen.getByLabelText('Devidend per share') as HTMLInputElement
    const tax = screen.getByLabelText('Tax') as HTMLInputElement

    await userEvent.type(lot, '1')
    lot.blur()
    await userEvent.type(dps, '1000')
    dps.blur()
    await userEvent.type(tax, '10')
    tax.blur()

    const result = await screen.findByText(/Rp/)
    expect(result).toBeTruthy()
  })
})
