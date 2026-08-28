import { useState } from 'react'
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
  <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
    {children}
  </svg>
)

const defaultValues = {
  propertyPrice: '',
  downPaymentPercent: '20',
  annualInterestRate: '7.5',
  tenureYears: '15',
}

export const LoanCalculator = () => {
  const navigate = useNavigate()

  const schema = yup.object().shape({
    propertyPrice: yup.string().required('Total loan / property price is required'),
    downPaymentPercent: yup.string().required('Down payment is required'),
    annualInterestRate: yup.string().required('Interest rate is required'),
    tenureYears: yup.string().required('Loan tenure is required'),
  })

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const [results, setResults] = useState<{
    monthlyInstallment: string
    principalLoan: string
    downPaymentAmount: string
    totalInterest: string
    totalRepayment: string
    recommendedIncome: string
  } | null>(null)

  const onSubmit = () => {
    const { propertyPrice, downPaymentPercent, annualInterestRate, tenureYears } = getValues()
    const price = Number(propertyPrice)
    const dpPct = Number(downPaymentPercent)
    const annualRate = Number(annualInterestRate)
    const years = Number(tenureYears)

    if (!Number.isFinite(price) || !Number.isFinite(dpPct) || !Number.isFinite(annualRate) || !Number.isFinite(years)) return
    if (price <= 0 || years <= 0) return

    const dpAmount = (dpPct / 100) * price
    const principal = price - dpAmount
    const totalMonths = years * 12
    const monthlyRate = (annualRate / 100) / 12

    let monthlyInstallment = 0
    if (monthlyRate === 0) {
      monthlyInstallment = principal / totalMonths
    } else {
      // Annuity Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const factor = Math.pow(1 + monthlyRate, totalMonths)
      monthlyInstallment = principal * (monthlyRate * factor) / (factor - 1)
    }

    const totalRepayment = monthlyInstallment * totalMonths
    const totalInterest = Math.max(0, totalRepayment - principal)
    const recommendedIncome = monthlyInstallment / 0.3 // Standard 30% DTI (Debt-to-Income) ratio

    setResults({
      monthlyInstallment: formatIdr(monthlyInstallment, 0),
      principalLoan: formatIdr(principal, 0),
      downPaymentAmount: formatIdr(dpAmount, 0),
      totalInterest: formatIdr(totalInterest, 0),
      totalRepayment: formatIdr(totalRepayment + dpAmount, 0),
      recommendedIncome: `${formatIdr(recommendedIncome, 0)} / month`,
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
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🏠</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Loan & KPR Calculator</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate monthly installments, interest costs, and minimum income for mortgage / vehicle loans</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/money-management')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close loan calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='propertyPrice'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='loan-price-input'
                icon={(
                  <FieldIcon>
                    <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                    <polyline points='9 22 9 12 15 12 15 22' />
                  </FieldIcon>
                )}
                title='Property / Total loan price'
                description='Total purchase price or loan requirement'
              >
                <Input
                  id='loan-price-input'
                  aria-label='Property / Total loan price'
                  containerClassName='mb-0'
                  errorMessage={errors?.propertyPrice?.message || ''}
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 500000000'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='downPaymentPercent'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='loan-dp-input'
                icon={(
                  <FieldIcon>
                    <path d='M4.5 8.5h15v7h-15z' />
                    <path d='M7 8.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75V8.5' />
                  </FieldIcon>
                )}
                title='Down payment (DP %)'
                description='Percentage of price paid upfront'
              >
                <Input
                  id='loan-dp-input'
                  aria-label='Down payment (DP %)'
                  containerClassName='mb-0'
                  errorMessage={errors?.downPaymentPercent?.message || ''}
                  placeholder='e.g. 20'
                  postfix='%'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='annualInterestRate'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='loan-interest-input'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Annual interest rate (%)'
                description='Fixed bank interest rate per year'
              >
                <Input
                  id='loan-interest-input'
                  aria-label='Annual interest rate (%)'
                  containerClassName='mb-0'
                  errorMessage={errors?.annualInterestRate?.message || ''}
                  placeholder='e.g. 7.5'
                  postfix='%'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='tenureYears'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='loan-tenure-input'
                icon={(
                  <FieldIcon>
                    <rect x='4.5' y='5.5' width='15' height='14' rx='2' />
                    <path d='M8 3.75v4.5' />
                    <path d='M16 3.75v4.5' />
                    <path d='M4.5 10h15' />
                  </FieldIcon>
                )}
                title='Loan tenure (Years)'
                description='Duration of the loan in years'
              >
                <Input
                  id='loan-tenure-input'
                  aria-label='Loan tenure (Years)'
                  containerClassName='mb-0'
                  errorMessage={errors?.tenureYears?.message || ''}
                  placeholder='e.g. 15'
                  postfix='years'
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
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
              <FormResult
                className='mb-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4'
                label='Monthly Installment (Cicilan / Bulan)'
                value={results.monthlyInstallment}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Recommended Min. Monthly Income (30% DTI)'
                value={results.recommendedIncome}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Principal Loan Amount (Kredit Pokok)'
                value={results.principalLoan}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Down Payment (DP Paid)'
                value={results.downPaymentAmount}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Total Interest Paid (Bunga Total)'
                value={results.totalInterest}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Total Cost of Property (DP + Repayments)'
                value={results.totalRepayment}
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

export default LoanCalculator

