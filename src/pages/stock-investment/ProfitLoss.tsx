import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

type FieldRowProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly description: string
  readonly children: React.ReactNode
}

const FieldRow = ({ icon, title, description, children }: FieldRowProps) => (
  <div className='grid gap-4 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] md:items-center md:gap-6 md:p-4'>
    <div className='flex items-start gap-3 md:gap-4'>
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-gray-100 ring-1 ring-white/8'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='font-subheading-sm text-gray-100'>{title}</p>
        <p className='mt-1 text-sm leading-5 text-gray-400'>{description}</p>
      </div>
    </div>
    <div className='md:justify-self-end md:w-full'>{children}</div>
  </div>
)

const FieldIcon = ({ children }: { readonly children: React.ReactNode }) => (
  <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
    {children}
  </svg>
)

const defaultValues = {
  price1: '',
  price2: '',
  result: '',
}

export const ProfitLoss = () => {
  const navigate = useNavigate()
  const schema = yup.object().shape({
    price1: yup.string().required('Oh noes! field must be fill!'),
    price2: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
  })

  const {
    control,
    reset,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const calculateProfit = (costPrice: number, sellingPrice: number): string => {
    if (!Number.isFinite(costPrice) || !Number.isFinite(sellingPrice)) return ''
    if (costPrice === 0) return '∞%'
    const profit = ((sellingPrice - costPrice) / costPrice) * 100
    const profitValue = Number(profit.toFixed(2))
    const formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(profitValue)
    return `${formatted}%`
  }

  const onSubmit = () => {
    const { price1, price2 } = getValues() as { price1: string; price2: string }
    if (price1.trim() === '' || price2.trim() === '') {
      setValue('result', '')
      return
    }
    const costPrice = Number(price1)
    const sellingPrice = Number(price2)
    if (!Number.isFinite(costPrice) || !Number.isFinite(sellingPrice)) {
      setValue('result', '')
      return
    }
    setValue('result', calculateProfit(costPrice, sellingPrice))
  }

  const onReset = () => {
    reset(defaultValues)
  }

  const result = watch('result')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'>
              <span className='text-4xl leading-none' aria-hidden='true'>💰</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-md text-gray-100 md:text-[2rem]'>Profit and Loss</h1>
              <p className='mt-1 text-sm text-gray-400 md:text-base'>Calculate your profit or loss percentage</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer'
            aria-label='Close profit and loss calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='price1'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <path d='M4.5 8.5h15v7h-15z' />
                    <path d='M7 8.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75V8.5' />
                    <path d='M7 13h2' />
                  </FieldIcon>
                )}
                title='Cost price'
                description='Enter the original price'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.price1?.message || ''}
                  formatThousands
                  placeholder='e.g. 100'
                  postfix='$'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-14 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-md text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='price2'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <path d='M4.5 8.5h15v7h-15z' />
                    <path d='M7 8.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75V8.5' />
                    <path d='M7 13h2' />
                  </FieldIcon>
                )}
                title='Selling price'
                description='Enter the selling price'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.price2?.message || ''}
                  formatThousands
                  placeholder='e.g. 120'
                  postfix='$'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-14 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-md text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500'
                />
              </FieldRow>
            )}
          />

          {result && (
            <div className='grid gap-3 rounded-3xl border border-white/6 bg-white/[0.03] p-4'>
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-4'
                label='Result'
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
              className='h-14 px-5 text-gray-200'
            >
              <span className='mr-2 text-lg leading-none'>↻</span>{' '}
              Reset
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-14 min-w-[180px] bg-gradient-to-r from-violet-600 to-purple-600 px-7 text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500'
            >
              <span className='mr-2 text-lg leading-none'>⊞</span>
              {isSubmitting ? 'Calculating…' : 'Calculate'}
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  )
}
