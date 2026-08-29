import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

type ExchangeRateResponse = {
  result: string
  rates: {
    [key: string]: number
  }
}

type FieldRowProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly description: string
  readonly children: React.ReactNode
  readonly htmlFor?: string
}

const FieldRow = ({ icon, title, description, children, htmlFor }: FieldRowProps) => (
  <div className='grid gap-3 rounded-xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] md:items-center md:gap-6 md:p-4'>
    <div className='flex items-start gap-2.5 md:gap-4'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-gray-100 ring-1 ring-white/8 md:h-12 md:w-12'>
        {icon}
      </div>
      <div className='min-w-0'>
        {htmlFor ? (
          <label htmlFor={htmlFor} className='text-xs font-semibold text-gray-100 md:font-subheading-sm cursor-pointer block'>
            {title}
          </label>
        ) : (
          <p className='text-xs font-semibold text-gray-100 md:font-subheading-sm'>{title}</p>
        )}
        <p className='mt-0.5 text-xs leading-4 text-gray-400 md:mt-1 md:text-sm md:leading-5'>{description}</p>
      </div>
    </div>
    <div className='md:justify-self-end md:w-full'>{children}</div>
  </div>
)

const FieldIcon = ({ children }: { readonly children: React.ReactNode }) => (
  <svg
    aria-hidden
    viewBox='0 0 24 24'
    className='h-5 w-5'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.9}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    {children}
  </svg>
)

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
]

const DEFAULT_FALLBACK_RATES: { [key: string]: number } = {
  USD: 16300,
  SGD: 12200,
  EUR: 17800,
  JPY: 108,
  MYR: 3700,
  GBP: 21000,
  AUD: 10800,
  CNY: 2250,
  SAR: 4350,
}

const defaultValues = {
  amount: '',
  sourceCurrency: 'USD',
  direction: 'toIdr',
}

export const CurrencyConverter = () => {
  const navigate = useNavigate()
  const [rates, setRates] = useState<{ [key: string]: number }>(DEFAULT_FALLBACK_RATES)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [detailedResult, setDetailedResult] = useState<{
    convertedAmount: string
    rateUsed: string
    formula: string
  } | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchRates = async () => {
      try {
        setLoading(true)
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json: ExchangeRateResponse = await res.json()
        if (json.result === 'success' && isMounted) {
          const usdToIdr = json.rates.IDR || DEFAULT_FALLBACK_RATES.USD
          const calculatedRates: { [key: string]: number } = {}
          POPULAR_CURRENCIES.forEach((curr) => {
            if (curr.code === 'USD') {
              calculatedRates.USD = usdToIdr
            } else if (json.rates[curr.code]) {
              calculatedRates[curr.code] = usdToIdr / json.rates[curr.code]
            } else {
              calculatedRates[curr.code] = DEFAULT_FALLBACK_RATES[curr.code] || 1
            }
          })
          setRates(calculatedRates)
          setLastUpdated(new Date().toLocaleTimeString())
        }
      } catch {
        // Fallback rates will be preserved
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchRates()
    return () => {
      isMounted = false
    }
  }, [])

  const schema = yup.object().shape({
    amount: yup.string().required('This field is required'),
    sourceCurrency: yup.string().required('This field is required'),
    direction: yup.string().required('This field is required'),
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const selectedCurrency = watch('sourceCurrency')
  const selectedDirection = watch('direction')
  const currentRate = rates[selectedCurrency] || DEFAULT_FALLBACK_RATES[selectedCurrency] || 16300

  const handleToggleDirection = () => {
    const nextDir = selectedDirection === 'toIdr' ? 'fromIdr' : 'toIdr'
    setValue('direction', nextDir)
    setResult(null)
    setDetailedResult(null)
  }

  const onSubmit = (data: typeof defaultValues) => {
    const amountNum = Number(data.amount)
    if (!Number.isFinite(amountNum) || amountNum <= 0) return

    const rate = rates[data.sourceCurrency] || DEFAULT_FALLBACK_RATES[data.sourceCurrency] || 16300

    if (data.direction === 'toIdr') {
      const idrTotal = amountNum * rate
      const formatted = formatIdr(idrTotal, 0)
      setResult(formatted)
      setDetailedResult({
        convertedAmount: formatted,
        rateUsed: `1 ${data.sourceCurrency} = ${formatIdr(rate, 2)}`,
        formula: `${amountNum.toLocaleString()} ${data.sourceCurrency} × ${formatIdr(rate, 2)}`,
      })
    } else {
      const foreignTotal = amountNum / rate
      const formatted = `${new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(foreignTotal)} ${data.sourceCurrency}`
      setResult(formatted)
      setDetailedResult({
        convertedAmount: formatted,
        rateUsed: `1 ${data.sourceCurrency} = ${formatIdr(rate, 2)}`,
        formula: `${formatIdr(amountNum, 0)} ÷ ${formatIdr(rate, 2)}`,
      })
    }
  }

  const onReset = () => {
    reset(defaultValues)
    setResult(null)
    setDetailedResult(null)
  }

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        {/* Header */}
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>💱</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>
                Currency Converter
              </h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>
                Convert USD, SGD, EUR, JPY and more to IDR with live exchange rates
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close currency converter'
          >
            <svg
              aria-hidden
              viewBox='0 0 24 24'
              className='h-5 w-5 md:h-6 md:w-6'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.9}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        {/* Live Rate Status Banner */}
        <div className='flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-xs md:p-4 md:text-sm'>
          <div className='flex items-center gap-2 text-violet-200'>
            <span className='inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
            <span className='font-semibold'>
              1 {selectedCurrency} = {formatIdr(currentRate, 2)}
            </span>
          </div>
          <div className='text-gray-400 text-[11px] md:text-xs'>
            {loading ? 'Fetching live rates…' : lastUpdated ? `Updated at ${lastUpdated}` : 'Live rates active'}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='space-y-4'>
          {/* Currency Selector */}
          <div className='space-y-2 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <label className='block text-xs font-semibold text-gray-200 md:text-sm'>
              Select Currency:
            </label>
            <div className='grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9'>
              {POPULAR_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  type='button'
                  onClick={() => {
                    setValue('sourceCurrency', curr.code)
                    setResult(null)
                    setDetailedResult(null)
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all cursor-pointer border ${
                    selectedCurrency === curr.code
                      ? 'border-violet-500 bg-violet-600/20 text-white ring-1 ring-violet-500'
                      : 'border-white/6 bg-white/[0.03] text-gray-400 hover:border-white/12 hover:text-gray-200'
                  }`}
                >
                  <span className='font-bold text-xs md:text-sm'>{curr.code}</span>
                  <span className='text-[10px] text-gray-400 truncate max-w-full'>{curr.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className='flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] p-3'>
            <span className='text-xs font-semibold text-gray-200 md:text-sm'>
              Conversion Direction:
            </span>
            <button
              type='button'
              onClick={handleToggleDirection}
              className='flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 cursor-pointer'
            >
              <span>{selectedDirection === 'toIdr' ? `${selectedCurrency} ➔ IDR` : `IDR ➔ ${selectedCurrency}`}</span>
              <span className='text-sm leading-none'>⇄</span>
            </button>
          </div>

          {/* Amount input */}
          <Controller
            name='amount'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='currency-amount-input'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title={selectedDirection === 'toIdr' ? `Amount (${selectedCurrency})` : 'Amount (IDR)'}
                description={
                  selectedDirection === 'toIdr'
                    ? `Enter amount in ${selectedCurrency}`
                    : 'Enter amount in Indonesian Rupiah'
                }
              >
                <Input
                  id='currency-amount-input'
                  aria-label={selectedDirection === 'toIdr' ? `Amount (${selectedCurrency})` : 'Amount (IDR)'}
                  containerClassName='mb-0'
                  errorMessage={errors?.amount?.message || ''}
                  formatThousands
                  placeholder='e.g. 100'
                  prefix={selectedDirection === 'fromIdr' ? 'Rp' : undefined}
                  postfix={selectedDirection === 'toIdr' ? selectedCurrency : 'IDR'}
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          {/* Result */}
          {result && detailedResult && (
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
              <FormResult
                className='mb-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4'
                label={selectedDirection === 'toIdr' ? 'Converted to IDR' : `Converted to ${selectedCurrency}`}
                value={detailedResult.convertedAmount}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Exchange Rate Applied'
                value={detailedResult.rateUsed}
              />
            </div>
          )}

          <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
            <Button
              type='button'
              onClick={onReset}
              variant='secondary'
              disabled={isSubmitting}
              className='h-11 px-4 text-sm text-gray-200 md:h-14 md:px-5 md:text-base'
            >
              <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>{' '}
              Reset
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-14 md:min-w-[180px] md:px-7 md:text-base'
            >
              <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
              Convert
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default CurrencyConverter
