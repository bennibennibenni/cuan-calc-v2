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

const standardDefaultValues = {
  price1: '',
  lots1: '',
  price2: '',
  lots2: '',
  price3: '',
  lots3: '',
}

const targetDefaultValues = {
  initialPrice: '',
  initialLots: '',
  currentPrice: '',
  targetAveragePrice: '',
}

export const AverageDown = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'standard' | 'target'>('standard')

  // Standard Mode Form
  const standardSchema = yup.object().shape({
    price1: yup.string().required('This field is required'),
    lots1: yup.string().required('This field is required'),
    price2: yup.string().required('This field is required'),
    lots2: yup.string().required('This field is required'),
    price3: yup.string(),
    lots3: yup.string(),
  })
  type StandardFormData = yup.InferType<typeof standardSchema>

  const {
    control: standardControl,
    handleSubmit: handleStandardSubmit,
    reset: resetStandard,
    formState: { errors: standardErrors },
  } = useForm({
    resolver: yupResolver(standardSchema),
    defaultValues: standardDefaultValues,
  })

  const [standardResults, setStandardResults] = useState<{
    newAveragePrice: string
    totalLots: string
    totalShares: string
    totalInvestment: string
    priceChange: string
  } | null>(null)

  const onStandardSubmit = (data: StandardFormData) => {
    const p1 = Number(data.price1)
    const l1 = Number(data.lots1)
    const p2 = Number(data.price2)
    const l2 = Number(data.lots2)
    const p3 = data.price3 ? Number(data.price3) : 0
    const l3 = data.lots3 ? Number(data.lots3) : 0

    if (!Number.isFinite(p1) || !Number.isFinite(l1) || !Number.isFinite(p2) || !Number.isFinite(l2)) return
    const totalLots = l1 + l2 + (Number.isFinite(l3) ? l3 : 0)
    if (totalLots <= 0) return

    const totalCost = (p1 * l1 * 100) + (p2 * l2 * 100) + (Number.isFinite(p3) && Number.isFinite(l3) ? p3 * l3 * 100 : 0)
    const totalShares = totalLots * 100
    const newAverage = totalCost / totalShares

    const diff = newAverage - p1
    const diffPct = ((diff / p1) * 100).toFixed(2)
    const changeFormatted = diff < 0
      ? `${formatIdr(Math.abs(diff), 2)} lower (${Math.abs(Number(diffPct))}%)`
      : diff > 0
        ? `${formatIdr(diff, 2)} higher (+${diffPct}%)`
        : 'No change'

    setStandardResults({
      newAveragePrice: formatIdr(newAverage, 2),
      totalLots: `${totalLots.toLocaleString()} lots`,
      totalShares: `${totalShares.toLocaleString()} shares`,
      totalInvestment: formatIdr(totalCost, 0),
      priceChange: changeFormatted,
    })
  }

  const onResetStandard = () => {
    resetStandard(standardDefaultValues)
    setStandardResults(null)
  }

  // Target Mode Form
  const targetSchema = yup.object().shape({
    initialPrice: yup.string().required('This field is required'),
    initialLots: yup.string().required('This field is required'),
    currentPrice: yup.string().required('This field is required'),
    targetAveragePrice: yup.string().required('This field is required'),
  })
  type TargetFormData = yup.InferType<typeof targetSchema>

  const {
    control: targetControl,
    handleSubmit: handleTargetSubmit,
    reset: resetTarget,
    formState: { errors: targetErrors },
  } = useForm({
    resolver: yupResolver(targetSchema),
    defaultValues: targetDefaultValues,
  })

  const [targetResults, setTargetResults] = useState<{
    lotsNeeded: string
    sharesNeeded: string
    additionalCost: string
    totalNewInvestment: string
    totalNewLots: string
    errorMsg?: string
  } | null>(null)

  const onTargetSubmit = (data: TargetFormData) => {
    const p1 = Number(data.initialPrice)
    const l1 = Number(data.initialLots)
    const p2 = Number(data.currentPrice)
    const pTarget = Number(data.targetAveragePrice)

    if (!Number.isFinite(p1) || !Number.isFinite(l1) || !Number.isFinite(p2) || !Number.isFinite(pTarget)) return

    if (p2 >= p1) {
      if (pTarget < p1) {
        setTargetResults({
          lotsNeeded: '-',
          sharesNeeded: '-',
          additionalCost: '-',
          totalNewInvestment: '-',
          totalNewLots: '-',
          errorMsg: 'Current buy price is higher than or equal to initial price. You cannot average down.',
        })
        return
      }
    }

    if (p2 < p1) {
      if (pTarget <= p2) {
        setTargetResults({
          lotsNeeded: '-',
          sharesNeeded: '-',
          additionalCost: '-',
          totalNewInvestment: '-',
          totalNewLots: '-',
          errorMsg: `Target average (${formatIdr(pTarget, 0)}) must be greater than current price (${formatIdr(p2, 0)}).`,
        })
        return
      }
      if (pTarget >= p1) {
        setTargetResults({
          lotsNeeded: '-',
          sharesNeeded: '-',
          additionalCost: '-',
          totalNewInvestment: '-',
          totalNewLots: '-',
          errorMsg: `Target average (${formatIdr(pTarget, 0)}) must be lower than initial price (${formatIdr(p1, 0)}).`,
        })
        return
      }
    }

    // Lots2 = Lots1 * (Price1 - Target) / (Target - Price2)
    const lotsNeeded = (l1 * (p1 - pTarget)) / (pTarget - p2)
    const roundedLots = Math.ceil(lotsNeeded)
    const sharesNeeded = roundedLots * 100
    const additionalCost = roundedLots * 100 * p2
    const totalNewLots = l1 + roundedLots
    const totalNewInvestment = (l1 * 100 * p1) + additionalCost

    setTargetResults({
      lotsNeeded: `${roundedLots.toLocaleString()} lots`,
      sharesNeeded: `${sharesNeeded.toLocaleString()} shares`,
      additionalCost: formatIdr(additionalCost, 0),
      totalNewInvestment: formatIdr(totalNewInvestment, 0),
      totalNewLots: `${totalNewLots.toLocaleString()} lots`,
    })
  }

  const onResetTarget = () => {
    resetTarget(targetDefaultValues)
    setTargetResults(null)
  }

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        {/* Header */}
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>📉</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Average Down & DCA</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>
                Calculate your new average purchase price or simulate required lots to reach a target average
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close average down calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        {/* Tab switcher */}
        <div className='flex rounded-2xl border border-white/6 bg-white/[0.03] p-1.5'>
          <button
            type='button'
            onClick={() => setActiveTab('standard')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer md:text-sm ${
              activeTab === 'standard'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📊 Average Price Calculator
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('target')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer md:text-sm ${
              activeTab === 'target'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🎯 Target Average Simulator
          </button>
        </div>

        {/* Standard Mode */}
        {activeTab === 'standard' && (
          <form onSubmit={handleStandardSubmit(onStandardSubmit)} autoComplete='off' className='space-y-4'>
            {/* Purchase 1 */}
            <div className='space-y-3 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
              <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>First Purchase (Initial)</h2>
              <Controller
                name='price1'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-price1'
                    icon={(
                      <FieldIcon>
                        <circle cx='12' cy='12' r='8.25' />
                        <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                        <path d='M12 7.5v9' />
                      </FieldIcon>
                    )}
                    title='Initial buy price'
                    description='Price per share of initial purchase'
                  >
                    <Input
                      id='avg-price1'
                      aria-label='Initial buy price'
                      containerClassName='mb-0'
                      errorMessage={standardErrors?.price1?.message || ''}
                      prefix='Rp'
                      formatThousands
                      placeholder='e.g. 1000'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
              <Controller
                name='lots1'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-lots1'
                    icon={(
                      <FieldIcon>
                        <rect x='3' y='3' width='7' height='7' rx='1' />
                        <rect x='14' y='3' width='7' height='7' rx='1' />
                        <rect x='3' y='14' width='7' height='7' rx='1' />
                        <rect x='14' y='14' width='7' height='7' rx='1' />
                      </FieldIcon>
                    )}
                    title='Initial quantity (lots)'
                    description='1 lot = 100 shares'
                  >
                    <Input
                      id='avg-lots1'
                      aria-label='Initial quantity (lots)'
                      containerClassName='mb-0'
                      errorMessage={standardErrors?.lots1?.message || ''}
                      formatThousands
                      placeholder='e.g. 10'
                      postfix='lots'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
            </div>

            {/* Purchase 2 */}
            <div className='space-y-3 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
              <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Second Purchase (Average Down)</h2>
              <Controller
                name='price2'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-price2'
                    icon={(
                      <FieldIcon>
                        <circle cx='12' cy='12' r='8.25' />
                        <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                        <path d='M12 7.5v9' />
                      </FieldIcon>
                    )}
                    title='Second buy price'
                    description='Price per share of second purchase'
                  >
                    <Input
                      id='avg-price2'
                      aria-label='Second buy price'
                      containerClassName='mb-0'
                      errorMessage={standardErrors?.price2?.message || ''}
                      prefix='Rp'
                      formatThousands
                      placeholder='e.g. 800'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
              <Controller
                name='lots2'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-lots2'
                    icon={(
                      <FieldIcon>
                        <rect x='3' y='3' width='7' height='7' rx='1' />
                        <rect x='14' y='3' width='7' height='7' rx='1' />
                        <rect x='3' y='14' width='7' height='7' rx='1' />
                        <rect x='14' y='14' width='7' height='7' rx='1' />
                      </FieldIcon>
                    )}
                    title='Second quantity (lots)'
                    description='1 lot = 100 shares'
                  >
                    <Input
                      id='avg-lots2'
                      aria-label='Second quantity (lots)'
                      containerClassName='mb-0'
                      errorMessage={standardErrors?.lots2?.message || ''}
                      formatThousands
                      placeholder='e.g. 20'
                      postfix='lots'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
            </div>

            {/* Purchase 3 (Optional) */}
            <div className='space-y-3 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
              <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Third Purchase (Optional)</h2>
              <Controller
                name='price3'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-price3'
                    icon={(
                      <FieldIcon>
                        <circle cx='12' cy='12' r='8.25' />
                        <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                        <path d='M12 7.5v9' />
                      </FieldIcon>
                    )}
                    title='Third buy price'
                    description='Optional price per share'
                  >
                    <Input
                      id='avg-price3'
                      aria-label='Third buy price'
                      containerClassName='mb-0'
                      prefix='Rp'
                      formatThousands
                      placeholder='e.g. 700'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
              <Controller
                name='lots3'
                control={standardControl}
                render={({ field }) => (
                  <FieldRow
                    htmlFor='avg-lots3'
                    icon={(
                      <FieldIcon>
                        <rect x='3' y='3' width='7' height='7' rx='1' />
                        <rect x='14' y='3' width='7' height='7' rx='1' />
                        <rect x='3' y='14' width='7' height='7' rx='1' />
                        <rect x='14' y='14' width='7' height='7' rx='1' />
                      </FieldIcon>
                    )}
                    title='Third quantity (lots)'
                    description='Optional number of lots'
                  >
                    <Input
                      id='avg-lots3'
                      aria-label='Third quantity (lots)'
                      containerClassName='mb-0'
                      formatThousands
                      placeholder='e.g. 10'
                      postfix='lots'
                      {...field}
                      type='number'
                      inputMode='numeric'
                      className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                    />
                  </FieldRow>
                )}
              />
            </div>

            {/* Results */}
            {standardResults && (
              <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
                <FormResult
                  className='mb-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4'
                  label='New Average Price'
                  value={standardResults.newAveragePrice}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Cost Price Reduction'
                  value={standardResults.priceChange}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Total Lots & Shares'
                  value={`${standardResults.totalLots} (${standardResults.totalShares})`}
                />
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Total Capital Invested'
                  value={standardResults.totalInvestment}
                />
              </div>
            )}

            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={onResetStandard}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-14 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='submit'
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-14 md:min-w-[180px] md:px-7 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Calculate
              </Button>
            </div>
          </form>
        )}

        {/* Target Simulator Mode */}
        {activeTab === 'target' && (
          <form onSubmit={handleTargetSubmit(onTargetSubmit)} autoComplete='off' className='space-y-4'>
            <Controller
              name='initialPrice'
              control={targetControl}
              render={({ field }) => (
                <FieldRow
                  htmlFor='target-initial-price'
                  icon={(
                    <FieldIcon>
                      <circle cx='12' cy='12' r='8.25' />
                      <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                      <path d='M12 7.5v9' />
                    </FieldIcon>
                  )}
                  title='Initial buy price'
                  description='Original price you bought at'
                >
                  <Input
                    id='target-initial-price'
                    aria-label='Initial buy price'
                    containerClassName='mb-0'
                    errorMessage={targetErrors?.initialPrice?.message || ''}
                    prefix='Rp'
                    formatThousands
                    placeholder='e.g. 1000'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />

            <Controller
              name='initialLots'
              control={targetControl}
              render={({ field }) => (
                <FieldRow
                  htmlFor='target-initial-lots'
                  icon={(
                    <FieldIcon>
                      <rect x='3' y='3' width='7' height='7' rx='1' />
                      <rect x='14' y='3' width='7' height='7' rx='1' />
                      <rect x='3' y='14' width='7' height='7' rx='1' />
                      <rect x='14' y='14' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Initial quantity (lots)'
                  description='Number of lots you currently hold'
                >
                  <Input
                    id='target-initial-lots'
                    aria-label='Initial quantity (lots)'
                    containerClassName='mb-0'
                    errorMessage={targetErrors?.initialLots?.message || ''}
                    formatThousands
                    placeholder='e.g. 10'
                    postfix='lots'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />

            <Controller
              name='currentPrice'
              control={targetControl}
              render={({ field }) => (
                <FieldRow
                  htmlFor='target-current-price'
                  icon={(
                    <FieldIcon>
                      <path d='M3 3v18h18' />
                      <path d='M7 16l4-8 4 4 4-8' />
                    </FieldIcon>
                  )}
                  title='Current market / buy price'
                  description='New price available to purchase'
                >
                  <Input
                    id='target-current-price'
                    aria-label='Current market / buy price'
                    containerClassName='mb-0'
                    errorMessage={targetErrors?.currentPrice?.message || ''}
                    prefix='Rp'
                    formatThousands
                    placeholder='e.g. 700'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />

            <Controller
              name='targetAveragePrice'
              control={targetControl}
              render={({ field }) => (
                <FieldRow
                  htmlFor='target-desired-average'
                  icon={(
                    <FieldIcon>
                      <path d='M12 19V5' />
                      <path d='M5 12l7-7 7 7' />
                    </FieldIcon>
                  )}
                  title='Desired target average'
                  description='The target average price you want to achieve'
                >
                  <Input
                    id='target-desired-average'
                    aria-label='Desired target average'
                    containerClassName='mb-0'
                    errorMessage={targetErrors?.targetAveragePrice?.message || ''}
                    prefix='Rp'
                    formatThousands
                    placeholder='e.g. 800'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />

            {/* Target Results */}
            {targetResults && (
              <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
                {targetResults.errorMsg ? (
                  <div className='col-span-full rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300'>
                    {targetResults.errorMsg}
                  </div>
                ) : (
                  <>
                    <FormResult
                      className='mb-0 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4'
                      label='Lots to Buy Needed'
                      value={`${targetResults.lotsNeeded} (${targetResults.sharesNeeded})`}
                    />
                    <FormResult
                      className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                      label='Additional Capital Needed'
                      value={targetResults.additionalCost}
                    />
                    <FormResult
                      className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                      label='Total Portfolio Lots'
                      value={targetResults.totalNewLots}
                    />
                    <FormResult
                      className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                      label='Total Capital Invested'
                      value={targetResults.totalNewInvestment}
                    />
                  </>
                )}
              </div>
            )}

            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={onResetTarget}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-14 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='submit'
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-14 md:min-w-[180px] md:px-7 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Simulate
              </Button>
            </div>
          </form>
        )}
      </section>
    </Layout>
  )
}

export default AverageDown
