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
  lot: '',
  dps: '',
  tax: '',
  devidendTax: '',
  finalDevidend: '',
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

export const Devidends = () => {
  const navigate = useNavigate()
  const schema = yup.object().shape({
    lot: yup.string().required('Oh noes! field must be fill!'),
    dps: yup.string().required('Oh noes! field must be fill!'),
    tax: yup.string().required('Oh noes! field must be fill!'),
    devidendTax: yup.string(),
    finalDevidend: yup.string(),
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

  const onReset = () => {
    reset(defaultValues)
  }

  const onSubmit = async () => {
    const { lot, dps, tax } = getValues()
    const lotNumber = Number(lot)
    const dpsNumber = Number(dps)
    const taxNumber = Number(tax)
    if (!Number.isFinite(lotNumber) || !Number.isFinite(dpsNumber) || !Number.isFinite(taxNumber)) {
      setValue('devidendTax', '')
      setValue('finalDevidend', '')
      return
    }
    const devidendTax = (taxNumber / 100) * (lotNumber * 100 * dpsNumber)
    const finalDevidend = lotNumber * 100 * dpsNumber - taxNumber
    setValue('devidendTax', formatIdr(devidendTax, 0))
    setValue('finalDevidend', formatIdr(finalDevidend, 0))
  }

  const devidendTax = watch('devidendTax')
  const finalDevidend = watch('finalDevidend')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>🏦</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Devidends</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Enter your details to calculate your dividend returns</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/stock-investment')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close dividends calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 6l12 12' />
              <path d='M18 6L6 18' />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='lot'
            control={control}
            render={({ field }) => (
              <FieldRow
                icon={(
                  <FieldIcon>
                    <rect x='3' y='3' width='7' height='7' rx='1' />
                    <rect x='14' y='3' width='7' height='7' rx='1' />
                    <rect x='3' y='14' width='7' height='7' rx='1' />
                    <rect x='14' y='14' width='7' height='7' rx='1' />
                  </FieldIcon>
                )}
                title='Lot'
                description='Enter the number of lots you own'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.lot?.message || ''}
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
            name='dps'
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
                title='DPS (Dividend Per Share)'
                description='Enter the dividend per share amount'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.dps?.message || ''}
                  formatThousands
                  placeholder='e.g. 500'
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
            name='tax'
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
                title='Tax rate (%)'
                description='Enter the dividend tax rate'
              >
                <Input
                  containerClassName='mb-0'
                  errorMessage={errors?.tax?.message || ''}
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

          {(devidendTax || finalDevidend) && (
            <div className='grid gap-3 rounded-3xl border border-white/6 bg-white/[0.03] p-3 md:p-4 md:grid-cols-2'>
              {devidendTax && (
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Tax Paid for Deviden'
                  value={devidendTax}
                />
              )}
              {finalDevidend && (
                <FormResult
                  className='mb-0 rounded-2xl border border-white/6 bg-white/[0.02] p-3 md:p-4'
                  label='Deviden after Tax'
                  value={finalDevidend}
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
