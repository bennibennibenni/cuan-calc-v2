import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export const Calculator: React.FC = () => {
  const navigate = useNavigate()
  const buttonValues = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C'],
  ]
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleClick = (value: string) => {
    if (value === 'C') {
      setInput('')
      setResult('')
    } else if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(input)
        setResult(evalResult.toString())
      } catch {
        setResult('Error')
      }
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

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'>
              <span className='text-4xl leading-none' aria-hidden='true'>🧮</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-md text-gray-100 md:text-[2rem]'>Calculator</h1>
              <p className='mt-1 text-sm text-gray-400 md:text-base'>Basic calculator with keyboard support</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer'
            aria-label='Close calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <div className='mx-auto max-w-md space-y-4'>
          {/* Display */}
          <div className='rounded-3xl border border-white/6 bg-white/[0.03] p-6 space-y-3'>
            <div className='rounded-2xl border border-white/6 bg-[#1a1f2b] p-4 overflow-x-auto'>
              <div className='text-right font-mono text-2xl text-gray-100 md:text-3xl min-h-[2.5rem] flex items-center justify-end whitespace-nowrap'>
                {input || '0'}
              </div>
            </div>
            {result && (
              <div className='rounded-2xl border border-white/6 bg-violet-500/10 p-4 overflow-x-auto'>
                <div className='text-right font-mono text-xl text-violet-300 md:text-2xl whitespace-nowrap'>
                  = {result}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className='rounded-3xl border border-white/6 bg-white/[0.03] p-4'>
            <div className='grid grid-cols-4 gap-3'>
              {buttonValues.flat().map((val, idx) => {
                const isOperator = ['+', '-', '*', '/'].includes(val)
                const isEquals = val === '='
                const isClear = val === 'C'

                return (
                  <button
                    key={idx}
                    onClick={() => handleClick(val)}
                    className={`
                      h-14 rounded-xl font-subheading-md text-lg transition-all cursor-pointer
                      focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                      ${isClear 
                        ? 'col-span-4 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 focus-visible:ring-red-500' 
                        : isEquals
                        ? 'border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 focus-visible:ring-green-500'
                        : isOperator
                        ? 'border border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 focus-visible:ring-violet-500'
                        : 'border border-white/6 bg-white/[0.03] text-gray-100 hover:bg-white/[0.06] focus-visible:ring-violet-500'
                      }
                    `}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className='rounded-2xl border border-white/6 bg-white/[0.03] p-4'>
            <p className='text-center text-sm text-gray-400'>
              <span className='font-medium text-gray-300'>Keyboard shortcuts:</span> Numbers, operators, Enter/= to calculate, C to clear, Backspace to delete
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Calculator
