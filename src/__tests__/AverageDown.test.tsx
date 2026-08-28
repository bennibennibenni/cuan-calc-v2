import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AverageDown } from '@/pages/stock-investment/AverageDown'
import { MemoryRouter } from 'react-router-dom'

describe('AverageDown page', () => {
  it('calculates standard average down price correctly', async () => {
    render(
      <MemoryRouter>
        <AverageDown />
      </MemoryRouter>
    )

    // Purchase 1: 10 lots @ Rp 1000 = Rp 1,000,000 (1000 shares)
    // Purchase 2: 10 lots @ Rp 800  = Rp 800,000   (1000 shares)
    // Total: 20 lots (2000 shares), Total: Rp 1,800,000 -> New Avg: Rp 900.00
    const price1 = screen.getByLabelText('Initial buy price') as HTMLInputElement
    const lots1 = screen.getByLabelText('Initial quantity (lots)') as HTMLInputElement
    const price2 = screen.getByLabelText('Second buy price') as HTMLInputElement
    const lots2 = screen.getByLabelText('Second quantity (lots)') as HTMLInputElement

    fireEvent.change(price1, { target: { value: '1000' } })
    fireEvent.change(lots1, { target: { value: '10' } })
    fireEvent.change(price2, { target: { value: '800' } })
    fireEvent.change(lots2, { target: { value: '10' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const avgResult = await screen.findByText(/Rp 900[.,]00/)
    const totalCost = await screen.findByText(/Rp 1\.800\.000/)
    const totalLots = await screen.findByText(/20 lots/)

    expect(avgResult).toBeTruthy()
    expect(totalCost).toBeTruthy()
    expect(totalLots).toBeTruthy()
  })

  it('switches to target simulator and calculates required lots', async () => {
    render(
      <MemoryRouter>
        <AverageDown />
      </MemoryRouter>
    )

    const targetTabBtn = screen.getByText(/Target Average Simulator/i)
    fireEvent.click(targetTabBtn)

    // Initial: 10 lots @ 1000
    // Current price: 600
    // Target average: 800
    // Formula: Lots2 = 10 * (1000 - 800) / (800 - 600) = 10 * 200 / 200 = 10 lots
    const initialPrice = screen.getByLabelText('Initial buy price') as HTMLInputElement
    const initialLots = screen.getByLabelText('Initial quantity (lots)') as HTMLInputElement
    const currentPrice = screen.getByLabelText('Current market / buy price') as HTMLInputElement
    const targetAverage = screen.getByLabelText('Desired target average') as HTMLInputElement

    fireEvent.change(initialPrice, { target: { value: '1000' } })
    fireEvent.change(initialLots, { target: { value: '10' } })
    fireEvent.change(currentPrice, { target: { value: '600' } })
    fireEvent.change(targetAverage, { target: { value: '800' } })

    const simulateBtn = screen.getByRole('button', { name: /Simulate/i })
    fireEvent.click(simulateBtn)

    const lotsNeeded = await screen.findByText(/10 lots/)
    const addCost = await screen.findByText(/Rp 600\.000/)

    expect(lotsNeeded).toBeTruthy()
    expect(addCost).toBeTruthy()
  })
})

