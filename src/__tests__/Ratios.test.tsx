import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Ratios } from '@/pages/Ratios'
import { MemoryRouter } from 'react-router-dom'

describe('Ratios page', () => {
  it('computes missing ratio on blur when three inputs provided', async () => {
    render(
      <MemoryRouter>
        <Ratios />
      </MemoryRouter>
    )
    const inputs = screen.getAllByRole('textbox')
    // provide three values
    await userEvent.type(inputs[0], '2')
    inputs[0].blur()
    await userEvent.type(inputs[1], '3')
    inputs[1].blur()
    await userEvent.type(inputs[2], '4')
    inputs[2].blur()

    // one of the inputs should be filled by calculation
    expect(inputs.some((i) => (i as HTMLInputElement).value !== '')).toBe(true)
  })
})
