import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmergencyFund } from '@/pages/money-management/EmergencyFund'
import { MemoryRouter } from 'react-router-dom'

describe('EmergencyFund page', () => {
  it('calculates emergency fund target and shortfall', async () => {
    render(
      <MemoryRouter>
        <EmergencyFund />
      </MemoryRouter>
    )

    // Monthly expenses: Rp 5,000,000
    // Months: 6 -> Target: Rp 30,000,000
    // Current savings: Rp 10,000,000 -> Shortfall: Rp 20,000,000
    // 12 months plan -> Rp 1,666,667 / month
    const exp = screen.getByLabelText('Monthly living expenses') as HTMLInputElement
    const months = screen.getByLabelText('Months of coverage') as HTMLInputElement
    const current = screen.getByLabelText('Current emergency savings') as HTMLInputElement

    fireEvent.change(exp, { target: { value: '5000000' } })
    fireEvent.change(months, { target: { value: '6' } })
    fireEvent.change(current, { target: { value: '10000000' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const targetFund = await screen.findByText(/Rp 30\.000\.000/)
    const shortfall = await screen.findByText(/Rp 20\.000\.000/)

    expect(targetFund).toBeTruthy()
    expect(shortfall).toBeTruthy()
  })
})

