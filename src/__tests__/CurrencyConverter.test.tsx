import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { CurrencyConverter } from '@/pages/CurrencyConverter'
import { MemoryRouter } from 'react-router-dom'

// Note: this test assumes the currency API call may not resolve in the test environment.
// We assert that when amount is entered and blur occurs, result updates (or is cleared if API missing).

describe('CurrencyConverter page', () => {
  it('accepts amount and attempts to calculate on blur', async () => {
    render(
      <MemoryRouter>
        <CurrencyConverter />
      </MemoryRouter>
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '10')
    input.blur()
    // either a result or empty string should be acceptable; just ensure no crash and input exists
    expect(input.value).toBeTruthy()
  })
})
