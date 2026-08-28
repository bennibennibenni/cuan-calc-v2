import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoanCalculator } from '@/pages/money-management/LoanCalculator'
import { MemoryRouter } from 'react-router-dom'

describe('LoanCalculator page', () => {
  it('calculates monthly mortgage installment and principal loan', async () => {
    render(
      <MemoryRouter>
        <LoanCalculator />
      </MemoryRouter>
    )

    // Price: Rp 500,000,000
    // DP: 20% -> DP amount: Rp 100,000,000 -> Principal: Rp 400,000,000
    const price = screen.getByLabelText('Property / Total loan price') as HTMLInputElement
    const dp = screen.getByLabelText('Down payment (DP %)') as HTMLInputElement

    fireEvent.change(price, { target: { value: '500000000' } })
    fireEvent.change(dp, { target: { value: '20' } })

    const calculateBtn = screen.getByRole('button', { name: /Calculate/i })
    fireEvent.click(calculateBtn)

    const principal = await screen.findByText(/Rp 400\.000\.000/)
    const dpAmount = await screen.findByText(/Rp 100\.000\.000/)

    expect(principal).toBeTruthy()
    expect(dpAmount).toBeTruthy()
  })
})

