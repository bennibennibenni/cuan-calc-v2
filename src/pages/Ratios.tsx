import React from 'react'
import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const defaultValues = {
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  result: '',
}

type FieldCardProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly children: React.ReactNode
}

const FieldCard = ({ icon, title, children }: FieldCardProps) => (
  <div className='rounded-2xl border border-white/6 bg-white/[0.03] p-3 md:p-4'>
    <div className='mb-3 flex items-center gap-2.5 md:gap-3'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/6 text-gray-100 ring-1 ring-white/8 md:h-10 md:w-10'>
        {icon}
      </div>
      <p className='text-xs font-semibold text-gray-100 md:font-subheading-sm'>{title}</p>
    </div>
    {children}
  </div>
)

const FieldIcon = ({ children }: { readonly children: React.ReactNode }) => (
  <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
    {children}
  </svg>
)

export const Ratios = () => {
  const navigate = useNavigate()
  const schema = yup.object().shape({
    value1: yup.string(),
    value2: yup.string(),
    value3: yup.string(),
    value4: yup.string(),
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

  const onReset = () => {
    reset(defaultValues)
  }

  const onSubmit = () => {
    const { value1, value2, value3, value4 } = getValues()
    const values = [value1, value2, value3, value4]
    const emptyField = values.filter(
      (value) => value === undefined || isNaN(Number(value)) || value === ''
    ).length
    if (emptyField > 1) {
      setValue('result', 'Please fill out at least 3 fields')
      return
    }
    if (emptyField === 0) {
      setValue('result', 'Please empty out 1 field')
      return
    }
    const numValue1 = parseFloat(value1 || '0')
    const numValue2 = parseFloat(value2 || '0')
    const numValue3 = parseFloat(value3 || '0')
    const numValue4 = parseFloat(value4 || '0')

    let calculated: number
    if (!value1) {
      calculated = (numValue3 * numValue2) / numValue4
    } else if (!value2) {
      calculated = (numValue1 * numValue4) / numValue3
    } else if (!value3) {
      calculated = (numValue1 * numValue4) / numValue2
    } else {
      calculated = (numValue3 * numValue2) / numValue1
    }

    setValue(
      'result',
      calculated.toLocaleString(undefined, { maximumFractionDigits: 2 })
    )
  }

  const result = watch('result')

  return (
    <Layout className='max-w-[1040px]'>
      <section className='space-y-6'>
        <header className='flex items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center text-white md:h-16 md:w-16'>
              <span className='text-2xl leading-none md:text-4xl' aria-hidden='true'>➗</span>
            </div>
            <div className='min-w-0'>
              <h1 className='font-heading-sm text-gray-100 md:font-heading-md md:text-[2rem]'>Ratios</h1>
              <p className='mt-1 text-xs text-gray-400 md:text-base'>Calculate proportional relationships (fill 3 fields to find the 4th)</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer md:h-12 md:w-12'
            aria-label='Close ratios calculator'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 md:h-6 md:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
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
                  icon={(
                    <FieldIcon>
                      <rect x='3' y='3' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='First value (a)'
                >
                  <Input
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
                  icon={(
                    <FieldIcon>
                      <rect x='14' y='3' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Second value (b)'
                >
                  <Input
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
                  icon={(
                    <FieldIcon>
                      <rect x='3' y='14' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Third value (c)'
                >
                  <Input
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
                  icon={(
                    <FieldIcon>
                      <rect x='14' y='14' width='7' height='7' rx='1' />
                    </FieldIcon>
                  )}
                  title='Fourth value (d)'
                >
                  <Input
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
