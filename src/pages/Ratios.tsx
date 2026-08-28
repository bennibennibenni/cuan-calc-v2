import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type FieldCardProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly children: React.ReactNode
  readonly htmlFor?: string
}

const FieldCard = ({ icon, title, children, htmlFor }: FieldCardProps) => (
  <div className='flex flex-col justify-between gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-4 transition-all duration-200 hover:border-violet-500/20 md:p-5'>
    <div className='flex items-center gap-3'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/6 text-gray-100 ring-1 ring-white/8'>
        {icon}
      </div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className='text-sm font-semibold text-gray-100 cursor-pointer block'>
          {title}
        </label>
      ) : (
        <p className='text-sm font-semibold text-gray-100'>{title}</p>
      )}
    </div>
    <div>{children}</div>
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
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  result: '',
}

export const Ratios = () => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  })

  const onSubmit = (data: typeof defaultValues) => {
    const a = Number(data.value1)
    const b = Number(data.value2)
    const c = Number(data.value3)
    const d = Number(data.value4)

    const hasA = data.value1 !== '' && !Number.isNaN(a)
    const hasB = data.value2 !== '' && !Number.isNaN(b)
    const hasC = data.value3 !== '' && !Number.isNaN(c)
    const hasD = data.value4 !== '' && !Number.isNaN(d)

    // Formula: a / b = c / d  =>  a * d = b * c
    let calculated = ''

    if (!hasA && hasB && hasC && hasD) {
      if (d === 0) {
        setValue('result', 'Cannot divide by zero')
        return
      }
      const res = (b * c) / d
      calculated = String(res)
      setValue('value1', String(res))
    } else if (hasA && !hasB && hasC && hasD) {
      if (c === 0) {
        setValue('result', 'Cannot divide by zero')
        return
      }
      const res = (a * d) / c
      calculated = String(res)
      setValue('value2', String(res))
    } else if (hasA && hasB && !hasC && hasD) {
      if (b === 0) {
        setValue('result', 'Cannot divide by zero')
        return
      }
      const res = (a * d) / b
      calculated = String(res)
      setValue('value3', String(res))
    } else if (hasA && hasB && hasC && !hasD) {
      if (a === 0) {
        setValue('result', 'Cannot divide by zero')
        return
      }
      const res = (b * c) / a
      calculated = String(res)
      setValue('value4', String(res))
    }

    setValue('result', calculated)
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
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>⚖️</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>
                Ratio Calculator
              </h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>
                Fill in any 3 values to solve for the 4th (a : b = c : d)
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close ratio calculator'
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

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              name='value1'
              control={control}
              render={({ field }) => (
                <FieldCard
                  htmlFor='ratio-val-1'
                  icon={(
                    <FieldIcon>
                      <rect x='3' y='3' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='First value (a)'
                >
                  <Input
                    id='ratio-val-1'
                    aria-label='First value (a)'
                    containerClassName='mb-0'
                    errorMessage={errors?.value1?.message || ''}
                    formatThousands
                    placeholder='e.g. 2'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldCard>
              )}
            />

            <Controller
              name='value2'
              control={control}
              render={({ field }) => (
                <FieldCard
                  htmlFor='ratio-val-2'
                  icon={(
                    <FieldIcon>
                      <rect x='14' y='3' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Second value (b)'
                >
                  <Input
                    id='ratio-val-2'
                    aria-label='Second value (b)'
                    containerClassName='mb-0'
                    errorMessage={errors?.value2?.message || ''}
                    formatThousands
                    placeholder='e.g. 4'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldCard>
              )}
            />

            <Controller
              name='value3'
              control={control}
              render={({ field }) => (
                <FieldCard
                  htmlFor='ratio-val-3'
                  icon={(
                    <FieldIcon>
                      <rect x='3' y='14' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Third value (c)'
                >
                  <Input
                    id='ratio-val-3'
                    aria-label='Third value (c)'
                    containerClassName='mb-0'
                    errorMessage={errors?.value3?.message || ''}
                    formatThousands
                    placeholder='e.g. 3'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldCard>
              )}
            />

            <Controller
              name='value4'
              control={control}
              render={({ field }) => (
                <FieldCard
                  htmlFor='ratio-val-4'
                  icon={(
                    <FieldIcon>
                      <rect x='14' y='14' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Fourth value (d)'
                >
                  <Input
                    id='ratio-val-4'
                    aria-label='Fourth value (d)'
                    containerClassName='mb-0'
                    errorMessage={errors?.value4?.message || ''}
                    formatThousands
                    placeholder='leave empty'
                    {...field}
                    type='number'
                    inputMode='numeric'
                    className='h-12 rounded-2xl border-gray-700 bg-[#1a1f2b] px-4 text-right font-subheading-sm text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500 md:h-14 md:font-subheading-md'
                  />
                </FieldCard>
              )}
            />
          </div>

          {result && (
            <div className='grid gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:p-4'>
              <FormResult
                className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                label='Calculated Value'
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

export default Ratios
