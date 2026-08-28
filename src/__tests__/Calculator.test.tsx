import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Calculator } from '@/pages/Calculator'
import { MemoryRouter } from 'react-router-dom'

describe('Calculator page', () => {
  it('evaluates basic arithmetic operations safely', async () => {
    render(
      <MemoryRouter>
        <Calculator />
      </MemoryRouter>
    )

    const btn2 = screen.getByRole('button', { name: '2' })
    const btnPlus = screen.getByRole('button', { name: '+' })
    const btn3 = screen.getByRole('button', { name: '3' })
    const btnEq = screen.getByRole('button', { name: '=' })

    fireEvent.click(btn2)
    fireEvent.click(btnPlus)
    fireEvent.click(btn3)
    fireEvent.click(btnEq)

    const res = await screen.findByText('= 5')
    expect(res).toBeTruthy()
  })

  it('handles division by zero gracefully', async () => {
    render(
      <MemoryRouter>
        <Calculator />
      </MemoryRouter>
    )

    const btn5 = screen.getByRole('button', { name: '5' })
    const btnDiv = screen.getByRole('button', { name: '/' })
    const btn0 = screen.getByRole('button', { name: '0' })
    const btnEq = screen.getByRole('button', { name: '=' })

    fireEvent.click(btn5)
    fireEvent.click(btnDiv)
    fireEvent.click(btn0)
    fireEvent.click(btnEq)

    const res = await screen.findByText('= Cannot divide by 0')
    expect(res).toBeTruthy()
  })
})

