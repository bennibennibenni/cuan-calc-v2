import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

type FieldRowProps = {
  readonly icon: ReactNode
  readonly title: string
  readonly description: string
  readonly children: ReactNode
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
  <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
    {children}
  </svg>
)

const defaultValues = {
  monthlyExpenses: '',
  profile: 'single', // 'single' (3-6 mo), 'married' (6 mo), 'family' (9 mo), 'freelance' (12 mo)
  monthsTarget: '6',
  currentSavings: '',
  targetMonthsToSave: '12',
}

export const EmergencyFund = () => {
  const navigate = useNavigate()

  const schema = yup.object().shape({
    monthlyExpenses: yup.string().required('This field is required'),
    profile: yup.string().required('This field is required'),
    monthsTarget: yup.string().required('This field is required'),
    currentSavings: yup.string(),
    targetMonthsToSave: yup.string(),
  })
  type EmergencyFormData = yup.InferType<typeof schema>

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

  const [results, setResults] = useState<{
    targetFund: string
    currentSavingsFormatted: string
    shortfall: string
    monthlySavingNeeded: string
    progressPct: number
  } | null>(null)

  const selectedProfile = watch('profile')

  const handleProfileChange = (profile: string) => {
    setValue('profile', profile)
    if (profile === 'single') setValue('monthsTarget', '6')
    else if (profile === 'married') setValue('monthsTarget', '6')
    else if (profile === 'family') setValue('monthsTarget', '9')
    else if (profile === 'freelance') setValue('monthsTarget', '12')
  }

  const onSubmit = (data: EmergencyFormData) => {
    const exp = Number(data.monthlyExpenses)
    const months = Number(data.monthsTarget)
    const saved = data.currentSavings ? Number(data.currentSavings) : 0
    const planMonths = data.targetMonthsToSave ? Number(data.targetMonthsToSave) : 12

    if (!Number.isFinite(exp) || !Number.isFinite(months) || months <= 0) return

    const targetFund = exp * months
    const shortfall = Math.max(0, targetFund - saved)
    const monthlySavingNeeded = planMonths > 0 ? shortfall / planMonths : shortfall
    const progressPct = targetFund > 0 ? Math.min(100, Math.round((saved / targetFund) * 100)) : 0

    setResults({
      targetFund: formatIdr(targetFund, 0),
      currentSavingsFormatted: formatIdr(saved, 0),
      shortfall: shortfall === 0 ? 'Goal Reached! 🎉' : formatIdr(shortfall, 0),
      monthlySavingNeeded: formatIdr(monthlySavingNeeded, 0),
      progressPct,
    })
  }

  const onReset = () => {
    reset(defaultValues)
    setResults(null)
  }

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        {/* Header */}
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🛡️</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Emergency Fund (Dana Darurat)</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate your ideal financial safety net based on lifestyle and monthly expenses</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/money-management')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close emergency fund calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='space-y-4'>
          {/* Lifestyle / Profile Selector */}
          <div className='space-y-2 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <p className='text-xs font-semibold text-gray-200 md:text-sm'>Select your lifestyle status:</p>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              {[
                { id: 'single', label: 'Single / Belum Menikah', months: '3–6 mo' },
                { id: 'married', label: 'Menikah (No Kids)', months: '6 mo' },
                { id: 'family', label: 'Menikah + Anak', months: '9–12 mo' },
                { id: 'freelance', label: 'Freelancer / Bisnis', months: '12 mo' },
              ].map((p) => (
                <button
                  key={p.id}
                  type='button'
                  onClick={() => handleProfileChange(p.id)}
                  className={`flex flex-col items-start justify-center rounded-xl p-3 text-left transition-all cursor-pointer border ${
                    selectedProfile === p.id
                      ? 'border-violet-500 bg-violet-600/20 text-violet-200 ring-1 ring-violet-500'
                      : 'border-white/6 bg-white/[0.03] text-gray-400 hover:border-white/12 hover:text-gray-200'
                  }`}
                >
                  <span className='font-subheading-sm text-xs font-semibold text-gray-100'>{p.label}</span>
                  <span className='mt-1 text-[11px] text-gray-400'>Rec: {p.months}</span>
                </button>
              ))}
            </div>
          </div>

          <Controller
            name='monthlyExpenses'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='ef-monthly-expenses'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Monthly living expenses'
                description='Your average total expenses per month'
              >
                <Input
                  id='ef-monthly-expenses'
                  aria-label='Monthly living expenses'
                  containerClassName='mb-0'
                  errorMessage={errors?.monthlyExpenses?.message || ''}
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 5000000'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='monthsTarget'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='ef-months-target'
                icon={(
                  <FieldIcon>
                    <rect x='4.5' y='5.5' width='15' height='14' rx='2' />
                    <path d='M8 3.75v4.5' />
                    <path d='M16 3.75v4.5' />
                    <path d='M4.5 10h15' />
                  </FieldIcon>
                )}
                title='Months of coverage'
                description='How many months of expenses to save?'
              >
                <Input
                  id='ef-months-target'
                  aria-label='Months of coverage'
                  containerClassName='mb-0'
                  errorMessage={errors?.monthsTarget?.message || ''}
                  placeholder='e.g. 6'
                  postfix='months'
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
                htmlFor='ef-current-savings'
                icon={(
                  <FieldIcon>
                    <path d='M4.5 8.5h15v7h-15z' />
                    <path d='M7 8.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75V8.5' />
                    <path d='M7 13h2' />
                  </FieldIcon>
                )}
                title='Current emergency savings (optional)'
                description='Amount already saved for emergencies'
              >
                <Input
                  id='ef-current-savings'
                  aria-label='Current emergency savings'
                  containerClassName='mb-0'
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 10000000'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='targetMonthsToSave'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='ef-target-months'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M12 6v6l4 2' />
                  </FieldIcon>
                )}
                title='Target timeline to reach goal'
                description='In how many months do you want to complete this fund?'
              >
                <Input
                  id='ef-target-months'
                  aria-label='Target timeline'
                  containerClassName='mb-0'
                  placeholder='e.g. 12'
                  postfix='months'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          {/* Results */}
          {results && (
            <div className='space-y-4 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:p-4'>
              {/* Progress bar */}
              <div className='space-y-1.5'>
                <div className='flex justify-between text-xs font-semibold text-gray-300'>
                  <span>Emergency Fund Progress</span>
                  <span className='text-violet-400'>{results.progressPct}%</span>
                </div>
                <div className='h-3 w-full overflow-hidden rounded-full bg-white/10'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500'
                    style={{ width: `${results.progressPct}%` }}
                  />
                </div>
              </div>

              <div className='grid gap-3 md:grid-cols-2'>
                <FormResult
                  className='mb-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4'
                  label='Target Emergency Fund'
                  value={results.targetFund}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Remaining to Save'
                  value={results.shortfall}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Monthly Savings Needed'
                  value={`${results.monthlySavingNeeded} / month`}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Current Savings'
                  value={results.currentSavingsFormatted}
                />
              </div>
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

export default EmergencyFund

