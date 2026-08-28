import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export function evaluateMathExpression(expr: string): string {
  const sanitized = expr.replace(/\s+/g, '')
  if (!sanitized) return ''

  if (!/^[0-9+\-*/.]+$/.test(sanitized)) {
    return 'Error'
  }

  const tokens: (number | string)[] = []
  let i = 0
  while (i < sanitized.length) {
    const ch = sanitized[i]
    if (['+', '-', '*', '/'].includes(ch)) {
      if (ch === '-' && (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string')) {
        let numStr = '-'
        i++
        while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
          numStr += sanitized[i]
          i++
        }
        const num = Number(numStr)
        if (Number.isNaN(num)) return 'Error'
        tokens.push(num)
        continue
      }
      tokens.push(ch)
      i++
    } else if (/[0-9.]/.test(ch)) {
      let numStr = ''
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        numStr += sanitized[i]
        i++
      }
      const num = Number(numStr)
      if (Number.isNaN(num)) return 'Error'
      tokens.push(num)
    } else {
      return 'Error'
    }
  }

  if (tokens.length === 0) return ''
  if (typeof tokens[tokens.length - 1] === 'string') return 'Error'

  const intermediate: (number | string)[] = []
  let idx = 0
  while (idx < tokens.length) {
    const token = tokens[idx]
    if (token === '*' || token === '/') {
      const prev = intermediate.pop()
      const next = tokens[idx + 1]
      if (typeof prev !== 'number' || typeof next !== 'number') return 'Error'
      if (token === '/') {
        if (next === 0) return 'Cannot divide by 0'
        intermediate.push(prev / next)
      } else {
        intermediate.push(prev * next)
      }
      idx += 2
    } else {
      intermediate.push(token)
      idx++
    }
  }

  let result = intermediate[0]
  if (typeof result !== 'number') return 'Error'
  let j = 1
  while (j < intermediate.length) {
    const op = intermediate[j]
    const next = intermediate[j + 1]
    if (typeof next !== 'number') return 'Error'
    if (op === '+') {
      result += next
    } else if (op === '-') {
      result -= next
    } else {
      return 'Error'
    }
    j += 2
  }

  const rounded = Math.round(result * 1e10) / 1e10
  return String(rounded)
}

export const Calculator: React.FC = () => {
  const navigate = useNavigate()
  const buttonValues = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '⌫'],
  ]
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleClick = (value: string) => {
    if (value === 'C') {
      setInput('')
      setResult('')
    } else if (value === '⌫') {
      setInput((prev) => prev.slice(0, -1))
    } else if (value === '=') {
      setResult(evaluateMathExpression(input))
    } else {
      setInput(input + value)
    }
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && (document.activeElement as HTMLElement).tagName === 'INPUT') return
      const key = e.key
      if (/^[0-9]$/.test(key)) {
        setInput((prev) => prev + key)
      } else if (['+', '-', '*', '/', '.'].includes(key)) {
        setInput((prev) => prev + key)
      } else if (key === 'Enter' || key === '=') {
        handleClick('=')
      } else if (key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1))
      } else if (key.toLowerCase() === 'c') {
        handleClick('C')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input])

  const isOperator = (btn: string) => ['+', '-', '*', '/'].includes(btn)
  const isSpecial = (btn: string) => ['C', '⌫', '='].includes(btn)

  return (
    <Layout className='max-w-[480px]'>
      <section className='space-y-6'>
        {/* Header */}
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🔢</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Calculator</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Standard arithmetic calculator</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        {/* Display Screen */}
        <div className='rounded-2xl border border-white/6 bg-white/[0.03] p-4 md:p-6'>
          <div className='flex min-h-[3rem] items-center justify-end overflow-x-auto text-right font-mono text-xl text-gray-400 md:text-2xl'>
            {input || '0'}
          </div>
          <div className='flex min-h-[2.5rem] items-center justify-end overflow-x-auto text-right font-heading-sm text-2xl text-gray-100 md:font-heading-md md:text-3xl'>
            {result ? `= ${result}` : ''}
          </div>
        </div>

        {/* Keypad */}
        <div className='grid grid-cols-4 gap-2 md:gap-3'>
          {buttonValues.flat().map((btn) => {
            const isWide = btn === 'C' || btn === '⌫'
            let variantStyles = 'border border-white/6 bg-white/[0.03] text-gray-100 hover:bg-white/[0.06] focus-visible:ring-violet-500'

            if (btn === '=') {
              variantStyles = 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 focus-visible:ring-violet-500'
            } else if (isOperator(btn)) {
              variantStyles = 'border border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 focus-visible:ring-violet-500'
            } else if (isSpecial(btn)) {
              variantStyles = 'border border-white/8 bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] focus-visible:ring-violet-500'
            }

            return (
              <button
                key={btn}
                type='button'
                onClick={() => handleClick(btn)}
                className={`
                  h-11 rounded-xl font-subheading-md text-base transition-all cursor-pointer md:h-14 md:text-lg
                  focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                  ${variantStyles}
                  ${isWide ? 'col-span-2' : ''}
                `}
              >
                {btn}
              </button>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}

export default Calculator
