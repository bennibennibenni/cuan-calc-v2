import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { Controller, useForm } from 'react-hook-form'

export default function Retirement() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      monthlyContribution: '',
      annualReturn: '',
      result: '',
    },
  })

  const onReset = () => {
    reset()
    setValue('result', '')
  }

  const calculate = (data: any) => {
    const ageNow = Number.parseInt(data.currentAge)
    const ageRetire = Number.parseInt(data.retirementAge)
    const savings = Number.parseFloat(data.currentSavings)
    const monthly = Number.parseFloat(data.monthlyContribution)
    const returnRate = Number.parseFloat(data.annualReturn) / 100
    const years = ageRetire - ageNow
    if (
      Number.isNaN(ageNow) ||
      Number.isNaN(ageRetire) ||
      Number.isNaN(savings) ||
      Number.isNaN(monthly) ||
      Number.isNaN(returnRate) ||
      years <= 0 ||
      ageNow < 0 ||
      ageRetire <= 0 ||
      savings < 0 ||
      monthly < 0 ||
      returnRate < 0
    ) {
      setValue('result', 'Please enter valid values.')
      return
    }
    let total = savings
    for (let i = 0; i < years * 12; i++) {
      total += monthly
      total *= 1 + returnRate / 12
      if (!isFinite(total)) {
        setValue('result', 'Please enter valid values.')
        return
      }
    }
    setValue(
      'result',

      total.toLocaleString(undefined, { maximumFractionDigits: 2 })
    )
  }

  return (
    <Layout
      backNavigation='/money-management'
      icon='💰'
      title='Retirement'
    >
      <form
        className='relative mt-8'
        onSubmit={handleSubmit(calculate)}
      >
        <Controller
          name='currentAge'
          control={control}
          render={({ field }) => (
            <Input
              label='Current Age'
              placeholder='e.g. 30'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.currentAge?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='retirementAge'
          control={control}
          render={({ field }) => (
            <Input
              label='Retirement Age'
              placeholder='e.g. 60'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.retirementAge?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='currentSavings'
          control={control}
          render={({ field }) => (
            <Input
              label='Current Savings'
              placeholder='e.g. 50000'
              formatThousands
              type='number'
              inputMode='numeric'
              errorMessage={errors?.currentSavings?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='monthlyContribution'
          control={control}
          render={({ field }) => (
            <Input
              label='Monthly Contribution'
              placeholder='e.g. 1000'
              formatThousands
              type='number'
              inputMode='numeric'
              errorMessage={errors?.monthlyContribution?.message}
              {...field}
            />
          )}
        />
        <Controller
          name='annualReturn'
          control={control}
          render={({ field }) => (
            <Input
              label='Expected Annual Return (%)'
              placeholder='e.g. 7'
              type='number'
              inputMode='numeric'
              errorMessage={errors?.annualReturn?.message}
              {...field}
            />
          )}
        />
        {watch('result') && (
          <FormResult
            label='Projected Savings at Retirement'
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
