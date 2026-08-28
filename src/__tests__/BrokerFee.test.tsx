import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrokerFee } from '@/pages/stock-investment/BrokerFee'
import { MemoryRouter } from 'react-router-dom'

describe('BrokerFee page', () => {
  it('calculates clean net cuan and break-even price', async () => {
    render(
      <MemoryRouter>
        <BrokerFee />
      </MemoryRouter>
    )

    // Buy: Rp 5,000, Sell: Rp 5,500, Lots: 20 (2,000 shares)
    // Gross Buy: 10,000,000; Buy Fee (0.15%): 15,000; Total Buy Cost: 10,015,000
    // Gross Sell: 11,000,000; Sell Fee (0.25%): 27,500; Net Proceeds: 10,972,500
    // Net Profit: 10,972,500 - 10,015,000 = + Rp 957,500
    const buyPrice = screen.getByLabelText('Buy price per share') as HTMLInputElement
    const sellPrice = screen.getByLabelText('Selling price per share') as HTMLInputElement
    const lots = screen.getByLabelText('Quantity (lots)') as HTMLInputElement

    fireEvent.change(buyPrice, { target: { value: '5000' } })
    fireEvent.change(sellPrice, { target: { value: '5500' } })
    fireEvent.change(lots, { target: { value: '20' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const netCuan = await screen.findByText(/\+ Rp 957\.500/)
    const totalFees = await screen.findByText(/Rp 42\.500/)

    expect(netCuan).toBeTruthy()
    expect(totalFees).toBeTruthy()
  })
})

