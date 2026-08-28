import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Devidends } from '@/pages/stock-investment/Devidends'
import { MemoryRouter } from 'react-router-dom'

describe('Devidends page', () => {
  it('calculates and displays dividend and tax results correctly', async () => {
    render(
      <MemoryRouter>
        <Devidends />
      </MemoryRouter>
    )
    const lot = screen.getByLabelText('Lot') as HTMLInputElement
    const dps = screen.getByLabelText('DPS (Dividend Per Share)') as HTMLInputElement
    const tax = screen.getByLabelText('Tax rate (%)') as HTMLInputElement

    fireEvent.change(lot, { target: { value: '1' } })
    fireEvent.change(dps, { target: { value: '1000' } })
    fireEvent.change(tax, { target: { value: '10' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const taxResult = await screen.findByText(/Rp 10\.000/)
    const netResult = await screen.findByText(/Rp 90\.000/)
    expect(taxResult).toBeTruthy()
    expect(netResult).toBeTruthy()
  })
})
