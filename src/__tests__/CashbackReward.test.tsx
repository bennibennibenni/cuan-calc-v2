import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { CashbackReward } from '@/pages/money-management/CashbackReward'
import { MemoryRouter } from 'react-router-dom'

describe('CashbackReward page', () => {
  it('calculates cashback result on blur and shows formatted Rp', async () => {
    render(
      <MemoryRouter>
        <CashbackReward />
      </MemoryRouter>
    )
    const pct = screen.getByLabelText('Cashback percentage') as HTMLInputElement
    const max = screen.getByLabelText('Maximum cashback') as HTMLInputElement

    await userEvent.type(pct, '5')
    pct.blur()
    await userEvent.type(max, '10000')
    max.blur()

    const res = await screen.findByText(/Rp/)
    expect(res).toBeTruthy()
  })
})
