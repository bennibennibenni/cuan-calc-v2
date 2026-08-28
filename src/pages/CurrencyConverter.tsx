import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { useQuery } from '@/hooks/useQuery'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

type ExchangeRateResponse = {
  data: {
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

const defaultValues = {
  amount: '',
  result: '',
}

export const CurrencyConverter = () => {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_FREE_CURRENCY_API_KEY
  const { data, loading, error } = useQuery<ExchangeRateResponse>(
    apiKey
      ? `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=IDR`
      : ''
  )

  const schema = yup.object().shape({
    amount: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const onSubmit = () => {
    const { amount } = getValues()
    const amountNum = Number(amount)
    if (!Number.isFinite(amountNum)) return

    const rate = data?.data?.IDR
    if (rate && Number.isFinite(rate)) {
      const converted = amountNum * rate
      setValue('result', formatIdr(converted, 0))
    }
  }

  const onReset = () => {
    reset(defaultValues)
  }

  const result = watch('result')
  const exchangeRate = data?.data?.IDR

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
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
                Convert USD to IDR with live exchange rates
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

        {loading && (
          <div className='rounded-2xl border border-white/6 bg-white/[0.02] p-4 text-center text-sm text-gray-400'>
            Fetching live exchange rates...
          </div>
        )}

        {error && (
          <div className='rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400'>
            Failed to fetch exchange rates. Please check your API key.
          </div>
        )}

        {exchangeRate && (
          <div className='rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-center text-sm text-violet-300'>
            Current Rate: 1 USD = {formatIdr(exchangeRate, 2)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='amount'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='usd-amount-input'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Amount (USD)'
                description='Enter the amount in US Dollars'
              >
                <Input
                  id='usd-amount-input'
                  aria-label='Amount (USD)'
                  containerClassName='mb-0'
                  errorMessage={errors?.amount?.message || ''}
                  formatThousands
                  placeholder='e.g. 100'
                  postfix='USD'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          {result && (
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:p-4'>
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Converted to IDR'
                value={result}
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
              disabled={isSubmitting || loading}
              className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-14 md:min-w-[180px] md:px-7 md:text-base'
            >
              <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
              {isSubmitting ? 'Converting…' : 'Convert'}
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default CurrencyConverter
