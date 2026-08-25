import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const defaultValues = {
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  value5: '',
  value6: '',
  value7: '',
  value8: '',
  result1: '',
  result2: '',
  result3: '',
  result4: '',
}

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

export const TpSl = () => {
  const navigate = useNavigate()

  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  // Section 1: Calculate increase
  const calculateIncrease = () => {
    const { value1, value2 } = getValues()
    const value1Number = Number(value1)
    const value2Number = Number(value2)
    if (Number.isFinite(value1Number) && Number.isFinite(value2Number)) {
      const tempResult1 = value1Number / 100
      const tempResult2 = tempResult1 * value2Number
      const finalResult = tempResult2 + value2Number
      setValue('result1', formatIdr(finalResult, 0))
    }
  }

  const resetIncrease = () => {
    setValue('value1', '')
    setValue('value2', '')
    setValue('result1', '')
  }

  // Section 2: Calculate decrease
  const calculateDecrease = () => {
    const { value3, value4 } = getValues()
    const value3Number = Number(value3)
    const value4Number = Number(value4)
    if (Number.isFinite(value3Number) && Number.isFinite(value4Number)) {
      const tempResult1 = value3Number / 100
      const tempResult2 = tempResult1 * value4Number
      const finalResult = value4Number - tempResult2
      setValue('result2', formatIdr(finalResult, 0))
    }
  }

  const resetDecrease = () => {
    setValue('value3', '')
    setValue('value4', '')
    setValue('result2', '')
  }

  // Section 3: Calculate percentage value
  const calculatePercentageValue = () => {
    const { value5, value6 } = getValues()
    const value5Number = Number(value5)
    const value6Number = Number(value6)
    if (Number.isFinite(value5Number) && Number.isFinite(value6Number)) {
      const tempResult1 = value5Number / 100
      const finalResult = tempResult1 * value6Number
      setValue('result3', formatIdr(finalResult, 0))
    }
  }

  const resetPercentageValue = () => {
    setValue('value5', '')
    setValue('value6', '')
    setValue('result3', '')
  }

  // Section 4: Calculate percentage ratio
  const calculatePercentageRatio = () => {
    const { value7, value8 } = getValues()
    const value7Number = Number(value7)
    const value8Number = Number(value8)
    if (Number.isFinite(value7Number) && Number.isFinite(value8Number) && value8Number !== 0) {
      const tempResult1 = value7Number * 100
      const finalResult = tempResult1 / value8Number
      const formattedPct = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(finalResult)
      setValue('result4', `${formattedPct}%`)
    }
  }

  const resetPercentageRatio = () => {
    setValue('value7', '')
    setValue('value8', '')
    setValue('result4', '')
  }

  const result1 = watch('result1')
  const result2 = watch('result2')
  const result3 = watch('result3')
  const result4 = watch('result4')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🎯</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Take Profit & Stop Loss</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate percentage-based price targets and gains</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <div className='space-y-6'>
          {/* Section 1: Increase */}
          <div className='space-y-4 rounded-3xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Calculate Price After Increase</h2>
            <Controller
              name='value1'
              control={control}
              render={({ field }) => (
                <FieldRow
                  icon={(
                    <FieldIcon>
                      <path d='M12 19V5' />
                      <path d='M5 12l7-7 7 7' />
                    </FieldIcon>
                  )}
                  title='Increase (%)'
                  description='Enter the percentage increase'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value1?.message || ''}
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
            <Controller
              name='value2'
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
                  title='Base price'
                  description='Enter the starting price'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value2?.message || ''}
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
            {result1 && (
              <div className='rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
                <FormResult className='mb-0' label='Result' value={result1} />
              </div>
            )}
            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={resetIncrease}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-12 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='button'
                onClick={calculateIncrease}
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-12 md:min-w-[160px] md:px-6 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Calculate
              </Button>
            </div>
          </div>

          {/* Section 2: Decrease */}
          <div className='space-y-4 rounded-3xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Calculate Price After Decrease</h2>
            <Controller
              name='value3'
              control={control}
              render={({ field }) => (
                <FieldRow
                  icon={(
                    <FieldIcon>
                      <path d='M12 5v14' />
                      <path d='M19 12l-7 7-7-7' />
                    </FieldIcon>
                  )}
                  title='Decrease (%)'
                  description='Enter the percentage decrease'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value3?.message || ''}
                    formatThousands
                    placeholder='e.g. 5'
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
              name='value4'
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
                  title='Base price'
                  description='Enter the starting price'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value4?.message || ''}
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
            {result2 && (
              <div className='rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
                <FormResult className='mb-0' label='Result' value={result2} />
              </div>
            )}
            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={resetDecrease}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-12 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='button'
                onClick={calculateDecrease}
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-12 md:min-w-[160px] md:px-6 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Calculate
              </Button>
            </div>
          </div>

          {/* Section 3: What is X% of Y */}
          <div className='space-y-4 rounded-3xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Calculate Percentage Value</h2>
            <Controller
              name='value5'
              control={control}
              render={({ field }) => (
                <FieldRow
                  icon={(
                    <FieldIcon>
                      <circle cx='12' cy='12' r='8.25' />
                      <path d='M8 8l8 8' />
                      <circle cx='9' cy='9' r='1.5' />
                      <circle cx='15' cy='15' r='1.5' />
                    </FieldIcon>
                  )}
                  title='Percentage'
                  description='What is this percent...'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value5?.message || ''}
                    formatThousands
                    placeholder='e.g. 15'
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
              name='value6'
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
                  title='Of this amount'
                  description='...of this base amount?'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value6?.message || ''}
                    prefix='Rp'
                    formatThousands
                    placeholder='e.g. 50000'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />
            {result3 && (
              <div className='rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
                <FormResult className='mb-0' label='Result' value={result3} />
              </div>
            )}
            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={resetPercentageValue}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-12 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='button'
                onClick={calculatePercentageValue}
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-12 md:min-w-[160px] md:px-6 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Calculate
              </Button>
            </div>
          </div>

          {/* Section 4: X is what % of Y */}
          <div className='space-y-4 rounded-3xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
            <h2 className='text-sm font-semibold text-gray-100 md:font-subheading-md'>Calculate Percentage Ratio</h2>
            <Controller
              name='value7'
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
                  title='This amount'
                  description='Enter the first amount'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value7?.message || ''}
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
              name='value8'
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
                  title='Is what percent of'
                  description='Enter the base amount'
                >
                  <Input
                    containerClassName='mb-0'
                    errorMessage={errors?.value8?.message || ''}
                    prefix='Rp'
                    formatThousands
                    placeholder='e.g. 20000'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldRow>
              )}
            />
            {result4 && (
              <div className='rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'>
                <FormResult className='mb-0' label='Result' value={result4} />
              </div>
            )}
            <div className='flex flex-col-reverse gap-3 border-t border-white/6 pt-4 sm:flex-row sm:justify-between'>
              <Button
                type='button'
                onClick={resetPercentageRatio}
                variant='secondary'
                className='h-11 px-4 text-sm text-gray-200 md:h-12 md:px-5 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>↻</span>
                Reset
              </Button>
              <Button
                type='button'
                onClick={calculatePercentageRatio}
                className='h-11 min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-sm text-white shadow-[0_18px_40px_-18px_rgba(124,58,237,0.95)] hover:from-violet-500 hover:to-purple-500 md:h-12 md:min-w-[160px] md:px-6 md:text-base'
              >
                <span className='mr-1.5 text-base leading-none md:mr-2 md:text-lg'>⊞</span>
                Calculate
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
