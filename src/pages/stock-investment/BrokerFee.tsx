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
  buyPrice: '',
  sellPrice: '',
  lots: '',
  buyFeePercent: '0.15',
  sellFeePercent: '0.25',
}

export const BrokerFee = () => {
  const navigate = useNavigate()

  const schema = yup.object().shape({
    buyPrice: yup.string().required('Buy price is required'),
    sellPrice: yup.string().required('Sell price is required'),
    lots: yup.string().required('Lot count is required'),
    buyFeePercent: yup.string().required('Buy fee is required'),
    sellFeePercent: yup.string().required('Sell fee is required'),
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
    netProfit: string
    netRoi: string
    grossProfit: string
    totalFees: string
    breakEvenPrice: string
    totalCost: string
    totalProceeds: string
    isProfit: boolean
  } | null>(null)

  const onSubmit = () => {
    const { buyPrice, sellPrice, lots, buyFeePercent, sellFeePercent } = getValues()
    const pBuy = Number(buyPrice)
    const pSell = Number(sellPrice)
    const l = Number(lots)
    const fBuy = Number(buyFeePercent) / 100
    const fSell = Number(sellFeePercent) / 100

    if (!Number.isFinite(pBuy) || !Number.isFinite(pSell) || !Number.isFinite(l) || l <= 0) return

    const shares = l * 100
    const grossBuy = pBuy * shares
    const buyFee = grossBuy * fBuy
    const totalCapitalSpent = grossBuy + buyFee

    const grossSell = pSell * shares
    const sellFee = grossSell * fSell
    const netProceeds = grossSell - sellFee

    const totalFees = buyFee + sellFee
    const grossProfit = grossSell - grossBuy
    const netProfit = netProceeds - totalCapitalSpent
    const netRoi = ((netProfit / totalCapitalSpent) * 100).toFixed(2)

    // Break-even formula: pSell * (1 - fSell) = pBuy * (1 + fBuy)
    const breakEven = (pBuy * (1 + fBuy)) / (1 - fSell)

    setResults({
      netProfit: (netProfit >= 0 ? '+ ' : '- ') + formatIdr(Math.abs(netProfit), 0),
      netRoi: `${Number(netRoi) >= 0 ? '+' : ''}${netRoi}%`,
      grossProfit: formatIdr(grossProfit, 0),
      totalFees: formatIdr(totalFees, 0),
      breakEvenPrice: formatIdr(Math.ceil(breakEven), 0),
      totalCost: formatIdr(totalCapitalSpent, 0),
      totalProceeds: formatIdr(netProceeds, 0),
      isProfit: netProfit >= 0,
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
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🧾</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Broker Fee & Net Cuan</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate exact net profit after brokerage commissions, exchange levy, and sales taxes</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close broker fee calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='buyPrice'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='bf-buy-price'
                icon={(
                  <FieldIcon>
                    <circle cx='12' cy='12' r='8.25' />
                    <path d='M9.5 9.5c0-.92.84-1.67 2.5-1.67s2.5.75 2.5 1.67-.82 1.42-2.5 1.83-2.5.9-2.5 1.84.84 1.67 2.5 1.67 2.5-.75 2.5-1.67' />
                    <path d='M12 7.5v9' />
                  </FieldIcon>
                )}
                title='Buy price per share'
                description='Your initial purchase price per share'
              >
                <Input
                  id='bf-buy-price'
                  aria-label='Buy price per share'
                  containerClassName='mb-0'
                  errorMessage={errors?.buyPrice?.message || ''}
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 5000'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='sellPrice'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='bf-sell-price'
                icon={(
                  <FieldIcon>
                    <path d='M4.5 8.5h15v7h-15z' />
                    <path d='M7 8.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75V8.5' />
                    <path d='M7 13h2' />
                  </FieldIcon>
                )}
                title='Selling price per share'
                description='Target or executed selling price per share'
              >
                <Input
                  id='bf-sell-price'
                  aria-label='Selling price per share'
                  containerClassName='mb-0'
                  errorMessage={errors?.sellPrice?.message || ''}
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 5500'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='lots'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='bf-lots'
                icon={(
                  <FieldIcon>
                    <rect x='3' y='3' width='7' height='7' rx='1' />
                    <rect x='14' y='3' width='7' height='7' rx='1' />
                    <rect x='3' y='14' width='7' height='7' rx='1' />
                    <rect x='14' y='14' width='7' height='7' rx='1' />
                  </FieldIcon>
                )}
                title='Quantity (lots)'
                description='Number of lots (1 lot = 100 shares)'
              >
                <Input
                  id='bf-lots'
                  aria-label='Quantity (lots)'
                  containerClassName='mb-0'
                  errorMessage={errors?.lots?.message || ''}
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

          {/* Broker Fee Settings */}
          <div className='grid gap-4 rounded-2xl border border-white/6 bg-white/[0.02] p-3 sm:grid-cols-2 md:p-4'>
            <Controller
              name='buyFeePercent'
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor='bf-buy-fee' className='block mb-1.5 text-xs font-semibold text-gray-200 md:text-sm cursor-pointer'>
                    Broker Buy Fee (%)
                  </label>
                  <Input
                    id='bf-buy-fee'
                    aria-label='Broker Buy Fee (%)'
                    containerClassName='mb-0'
                    errorMessage={errors?.buyFeePercent?.message || ''}
                    placeholder='e.g. 0.15'
                    postfix='%'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-11 rounded-xl border-gray-700 bg-[#1a1f2b] px-3 text-right font-subheading-sm text-gray-100 focus:border-violet-500 focus:ring-violet-500'
                  />
                  <p className='mt-1 text-[11px] text-gray-400'>Standard IDX broker buy fee: 0.15%</p>
                </div>
              )}
            />

            <Controller
              name='sellFeePercent'
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor='bf-sell-fee' className='block mb-1.5 text-xs font-semibold text-gray-200 md:text-sm cursor-pointer'>
                    Broker Sell Fee (%)
                  </label>
                  <Input
                    id='bf-sell-fee'
                    aria-label='Broker Sell Fee (%)'
                    containerClassName='mb-0'
                    errorMessage={errors?.sellFeePercent?.message || ''}
                    placeholder='e.g. 0.25'
                    postfix='%'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-11 rounded-xl border-gray-700 bg-[#1a1f2b] px-3 text-right font-subheading-sm text-gray-100 focus:border-violet-500 focus:ring-violet-500'
                  />
                  <p className='mt-1 text-[11px] text-gray-400'>Standard IDX sell fee + tax: 0.25%</p>
                </div>
              )}
            />
          </div>

          {/* Results */}
          {results && (
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
              <FormResult
                className={`mb-0 rounded-2xl border p-3 md:p-4 ${
                  results.isProfit
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
                label='Net Cuan (Clean Profit / Loss)'
                value={`${results.netProfit} (${results.netRoi})`}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 md:p-4'
                label='Break-Even Price (Min Sell to Not Lose)'
                value={results.breakEvenPrice}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Gross Profit (Before Fees)'
                value={results.grossProfit}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Total Broker Fees & Taxes Paid'
                value={results.totalFees}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Total Capital Spent (Buy + Fee)'
                value={results.totalCost}
              />
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Net Proceeds Received (Sell - Fee)'
                value={results.totalProceeds}
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

export default BrokerFee

