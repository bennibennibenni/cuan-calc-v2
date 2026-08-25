import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type FieldRowProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly description: string
  readonly children: React.ReactNode
}

const FieldRow = ({ icon, title, description, children }: FieldRowProps) => (
  <div className='grid gap-3 rounded-xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] md:items-center md:gap-6 md:p-4'>
    <div className='flex items-start gap-2.5 md:gap-4'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-gray-100 ring-1 ring-white/8 md:h-12 md:w-12'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='text-xs font-semibold text-gray-100 md:font-subheading-sm'>{title}</p>
        <p className='mt-0.5 text-xs leading-4 text-gray-400 md:mt-1 md:text-sm md:leading-5'>{description}</p>
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
  currentAge: '',
  retirementAge: '',
  currentSavings: '',
  monthlyContribution: '',
  annualReturn: '',
  result: '',
}

export default function Retirement() {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  })

  const onReset = () => {
    reset(defaultValues)
  }

  const calculate = () => {
    const data = getValues()
    const ageNow = Number.parseInt(data.currentAge)
    const ageRetire = Number.parseInt(data.retirementAge)
    const savings = Number.parseFloat(data.currentSavings)
    const monthly = Number.parseFloat(data.monthlyContribution)
    const returnRate = Number.parseFloat(data.annualReturn) / 100
    const years = ageRetire - ageNow
    if (
      Number.isNaN(ageNow) ||
      Number.isNaN(ageRetire) ||
      Number.isNaN(savings) ||
      Number.isNaN(monthly) ||
      Number.isNaN(returnRate) ||
      years <= 0 ||
      ageNow < 0 ||
      ageRetire <= 0 ||
      savings < 0 ||
      monthly < 0 ||
      returnRate < 0
    ) {
      setValue('result', 'Please enter valid values.')
      return
    }
    let total = savings
    for (let i = 0; i < years * 12; i++) {
      total += monthly
      total *= 1 + returnRate / 12
      if (!isFinite(total)) {
        setValue('result', 'Please enter valid values.')
        return
      }
    }
    setValue(
      'result',
      total.toLocaleString(undefined, { maximumFractionDigits: 2 })
    )
  }

  const result = watch('result')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🛠️</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Retirement</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Plan your retirement savings projection</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/money-management')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close retirement calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(calculate)} className='space-y-4'>
          <Controller
            name='currentAge'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='8' r='4' />
                    <path d='M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6' />
                  </FieldIcon>
                )}
                title='Current age'
                description='Enter your current age'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.currentAge?.message || ''}
                  placeholder='e.g. 30'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='retirementAge'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <rect x='4.5' y='5.5' width='15' height='14' rx='2' />
                    <path d='M8 3.75v4.5' />
                    <path d='M16 3.75v4.5' />
                    <path d='M4.5 10h15' />
                    <path d='M8.25 13.5h.01' />
                    <path d='M12 13.5h.01' />
                    <path d='M15.75 13.5h.01' />
                  </FieldIcon>
                )}
                title='Retirement age'
                description='At what age do you plan to retire?'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.retirementAge?.message || ''}
                  placeholder='e.g. 60'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='currentSavings'
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
                title='Current savings'
                description='How much have you saved so far?'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.currentSavings?.message || ''}
                  formatThousands
                  placeholder='e.g. 50000'
                  postfix='$'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='monthlyContribution'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Monthly contribution'
                description='How much will you contribute each month?'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.monthlyContribution?.message || ''}
                  formatThousands
                  placeholder='e.g. 1000'
                  postfix='$'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='annualReturn'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Expected annual return (%)'
                description='Enter the expected annual return rate'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.annualReturn?.message || ''}
                  placeholder='e.g. 7'
                  postfix='%'
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
                label='Projected Savings at Retirement'
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
              disabled={isSubmitting}
              className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-14 md:min-w-[180px] md:px-7 md:text-base'
            >
              <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
              {isSubmitting ? 'Calculating…' : 'Calculate'}
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  )
}
