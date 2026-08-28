import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const defaultValues = {
  marketPrice: '',
  takeProfitPercentage: '',
  stopLossPercentage: '',
  takeProfitResult: '',
  stopLossResult: '',
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
  <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
    {children}
  </svg>
)

export const RiskManagementPercentage = () => {
  const navigate = useNavigate()
  const schema = yup.object().shape({
    marketPrice: yup.string().required('Oh noes! field must be fill!'),
    takeProfitPercentage: yup.string().required('Oh noes! field must be fill!'),
    stopLossPercentage: yup.string().required('Oh noes! field must be fill!'),
    takeProfitResult: yup.string(),
    stopLossResult: yup.string(),
  })

  const {
    control,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const onSubmit = async () => {
    const { marketPrice, takeProfitPercentage, stopLossPercentage } =
      getValues()
    const marketPriceNumber = Number(marketPrice)
    const takeProfitPercentageNumber = Number(takeProfitPercentage)
    const stopLossPercentageNumber = Number(stopLossPercentage)
    const calculateProfitPrice1 = takeProfitPercentageNumber / 100
    const calculateProfitPrice2 = calculateProfitPrice1 * marketPriceNumber
    const calculateStopLossPrice1 = stopLossPercentageNumber / 100
    const calculateStopLossPrice2 =
      calculateStopLossPrice1 * marketPriceNumber
    setValue('takeProfitResult', formatIdr(marketPriceNumber + calculateProfitPrice2, 0))
    setValue('stopLossResult', formatIdr(marketPriceNumber - calculateStopLossPrice2, 0))
  }

  const onReset = () => {
    reset(defaultValues)
  }

  const takeProfitResult = watch('takeProfitResult')
  const stopLossResult = watch('stopLossResult')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>📊</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Risk Management (%)</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate take profit and stop loss prices from percentage targets</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close risk management calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='marketPrice'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='rm-market-price'
                icon={(
                  <FieldIcon>
                    <path d='M3 3v18h18' />
                    <path d='M7 16l4-8 4 4 4-8' />
                  </FieldIcon>
                )}
                title='Market price'
                description='Enter the current market price'
              >
                <Input
                  id='rm-market-price'
                  aria-label='Market price'
                  containerClassName='mb-0'
                  errorMessage={errors?.marketPrice?.message || ''}
                  prefix='Rp'
                  formatThousands
                  placeholder='e.g. 10000'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          <Controller
            name='takeProfitPercentage'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='rm-take-profit-pct'
                icon={(
                  <FieldIcon>
                    <path d='M12 19V5' />
                    <path d='M5 12l7-7 7 7' />
                  </FieldIcon>
                )}
                title='Take profit (%)'
                description='Enter your target take profit percentage'
              >
                <Input
                  id='rm-take-profit-pct'
                  aria-label='Take profit (%)'
                  containerClassName='mb-0'
                  errorMessage={errors?.takeProfitPercentage?.message || ''}
                  formatThousands
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
            name='stopLossPercentage'
            control={control}
            render={({ field }) => (
              <FieldRow
                htmlFor='rm-stop-loss-pct'
                icon={(
                  <FieldIcon>
                    <path d='M12 5v14' />
                    <path d='M19 12l-7 7-7-7' />
                  </FieldIcon>
                )}
                title='Stop loss (%)'
                description='Enter your target stop loss percentage'
              >
                <Input
                  id='rm-stop-loss-pct'
                  aria-label='Stop loss (%)'
                  containerClassName='mb-0'
                  errorMessage={errors?.stopLossPercentage?.message || ''}
                  formatThousands
                  placeholder='e.g. 10'
                  postfix='%'
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                />
              </FieldRow>
            )}
          />

          {(takeProfitResult || stopLossResult) && (
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:grid-cols-2 md:p-4'>
              {takeProfitResult && (
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Take profit'
                  value={takeProfitResult}
                />
              )}
              {stopLossResult && (
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Stop loss'
                  value={stopLossResult}
                />
              )}
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

export default RiskManagementPercentage
