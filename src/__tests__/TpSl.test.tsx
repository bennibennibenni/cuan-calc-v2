import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { TpSl } from '@/pages/stock-investment/TpSl'
import { MemoryRouter } from 'react-router-dom'

describe('TpSl page', () => {
  it('shows formatted Rp results on blur', async () => {
    render(
      <MemoryRouter>
        <TpSl />
      </MemoryRouter>
    )
    const inc = screen.getByLabelText('Increase') as HTMLInputElement
    const of = (screen.getAllByLabelText('of') as HTMLInputElement[])[0]

    await userEvent.type(inc, '10')
    inc.blur()
    await userEvent.type(of, '10000')
    of.blur()

    const results = await screen.findAllByText(/Rp/)
    expect(results.length).toBeGreaterThanOrEqual(1)
  })
})
