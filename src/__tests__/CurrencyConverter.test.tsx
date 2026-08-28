import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CurrencyConverter } from '@/pages/CurrencyConverter'
import { MemoryRouter } from 'react-router-dom'

describe('CurrencyConverter page', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            result: 'success',
            rates: { IDR: 16300, SGD: 1.34, EUR: 0.92 },
          }),
      } as Response)
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('accepts amount and converts currency using live rates', async () => {
    render(
      <MemoryRouter>
        <CurrencyConverter />
      </MemoryRouter>
    )

    const input = screen.getByLabelText('Amount (USD)') as HTMLInputElement
    fireEvent.change(input, { target: { value: '10' } })

    const convertBtn = screen.getByRole('button', { name: /⊞Convert/i })
    fireEvent.click(convertBtn)

    const result = await screen.findByText(/Converted to IDR/)
    expect(result).toBeTruthy()
  })

  it('toggles conversion direction to IDR -> USD', async () => {
    render(
      <MemoryRouter>
        <CurrencyConverter />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByText(/⇄/)
    fireEvent.click(toggleBtn)

    const idrInput = screen.getByLabelText('Amount (IDR)') as HTMLInputElement
    fireEvent.change(idrInput, { target: { value: '163000' } })

    const convertBtn = screen.getByRole('button', { name: /⊞Convert/i })
    fireEvent.click(convertBtn)

    const result = await screen.findByText(/Converted to USD/)
    expect(result).toBeTruthy()
  })
})
