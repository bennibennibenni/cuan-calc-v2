import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

export const CompoundInterest: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      principal: '',
      rate: '',
      times: '',
      years: '',
      result: '',
    },
  })

  const onReset = () => {
    reset()
    setValue('result', '')
  }

  const calculate = (data: any) => {
    const P = Number.parseFloat(data.principal)
    const r = Number.parseFloat(data.rate) / 100
    const n = Number.parseFloat(data.times)
    const t = Number.parseFloat(data.years)
    if (
      Number.isNaN(P) ||
      Number.isNaN(r) ||
      Number.isNaN(n) ||
      Number.isNaN(t) ||
      P <= 0 ||
      n <= 0 ||
      t <= 0
    ) {
      setValue('result', 'Please enter valid numbers.')
      return
    }
    // Prevent division by zero or invalid math
    const base = 1 + r / n;
    if (!isFinite(base) || base <= 0) {
      setValue('result', 'Please enter valid numbers.')
      return;
    }
    const amount = P * Math.pow(base, n * t);
    if (!isFinite(amount)) {
      setValue('result', 'Please enter valid numbers.')
      return;
    }
    setValue(
      'result',
      amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    )
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='📈'
      title='Compound Interest'
    >
      <form
        className='relative mt-8'
        onSubmit={handleSubmit(calculate)}
      >
        <Controller
          name='principal'
          control={control}
          render={({ field }) => (
            <Input
              label='Principal (Initial Amount)'
              placeholder='e.g. 10000'
              formatThousands
              type='number'
              inputMode='numeric'
              errorMessage={errors?.principal?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='rate'
          control={control}
          render={({ field }) => (
            <Input
              label='Annual Rate (%)'
              placeholder='e.g. 8'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.rate?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='times'
          control={control}
          render={({ field }) => (
            <Input
              label='Times Compounded Per Year'
              placeholder='e.g. 4'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.times?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='years'
          control={control}
          render={({ field }) => (
            <Input
              label='Years'
              placeholder='e.g. 10'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.years?.message}
              {...field}
            />
          )}
        />
        {watch('result') && (
          <FormResult
            label='Final amount'
            value={watch('result') ?? ''}
          />
        )}
        <div className='flex flex-wrap gap-3'>
          <Button
            type='button'
            onClick={onReset}
            variant='secondary'
          >
            Reset
          </Button>
          <Button
            type='submit'
            variant='secondary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Calculating…' : 'Calculate'}
          </Button>
        </div>
      </form>
    </Layout>
  )
}

export default CompoundInterest
