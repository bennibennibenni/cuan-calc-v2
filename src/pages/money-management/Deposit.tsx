import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

export const Deposit = () => {
  const schema = yup.object().shape({
    initialDeposit: yup.string().required('Oh noes! field must be fill!'),
    tenureMonths: yup.string().required('Oh noes! field must be fill!'),
    annualInterestRate: yup.string().required('Oh noes! field must be fill!'),
    annualTaxRate: yup.string().required('Oh noes! field must be fill!'),
    net: yup.string(),
    gross: yup.string(),
    taxOnInterest: yup.string(),
    interestBeforeTax: yup.string(),
  })

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, onReset },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async () => {
    const {
      initialDeposit,
      tenureMonths,
      annualInterestRate,
      annualTaxRate,
    } = getValues()
    const initialDepositNum = Number.parseFloat(initialDeposit)
    const tenureMonthsNum = Number.parseFloat(tenureMonths)
    const annualInterestRateNum = Number.parseFloat(annualInterestRate)
    const annualTaxRateNum = Number.parseFloat(annualTaxRate)
    // Calculate the tenure in years
    const year = tenureMonthsNum / 12
    // Total amount before tax (Gross)
    const gross =
      initialDepositNum * (1 + (annualInterestRateNum / 100) * year)
    // Interest earned before tax
    const interestBeforeTax =
      initialDepositNum * (annualTaxRateNum / 100) * year
    // Tax on interest
    const taxOnInterest = interestBeforeTax * (annualTaxRateNum / 100)
    // Total amount after tax (Net)
    const net = gross - taxOnInterest
    setValue('gross', formatIdr(gross, 2))
    setValue('interestBeforeTax', formatIdr(interestBeforeTax, 2))
    setValue('taxOnInterest', formatIdr(taxOnInterest, 2))
    setValue('net', formatIdr(net, 2))
  }

  return (
    <Layout
      backNavigation='/money-management'
      icon='🏦'
      title='Deposit'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='relative mt-8'>
        <Controller
          name='initialDeposit'
          control={control}
          render={({ field }) => (
            <Input
              label='Initial deposit'
              errorMessage={errors?.initialDeposit?.message || ''}
              formatThousands
              {...field}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        <Controller
          name='tenureMonths'
          control={control}
          render={({ field }) => (
            <Input
              label='Tenure (months)'
              errorMessage={errors?.tenureMonths?.message || ''}
              {...field}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        <Controller
          name='annualInterestRate'
          control={control}
          render={({ field }) => (
            <Input
              label='Annual interest rate (%)'
              errorMessage={errors?.annualInterestRate?.message || ''}
              {...field}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        <Controller
          name='annualTaxRate'
          control={control}
          render={({ field }) => (
            <Input
              label='Annual tax rate (%)'
              errorMessage={errors?.annualTaxRate?.message || ''}
              {...field}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        {watch('gross') && (
          <FormResult
            label='Total amount before tax (Gross)'
            value={watch('gross') ?? ''}
          />
        )}
        {watch('interestBeforeTax') && (
          <FormResult
            label='Interest earned before tax'
            value={watch('interestBeforeTax') ?? ''}
          />
        )}
        {watch('taxOnInterest') && (
          <FormResult
            label='Tax on interest'
            value={watch('taxOnInterest') ?? ''}
          />
        )}
        {watch('net') && (
          <FormResult
            label='Total amount after tax (Net)'
            value={watch('net') ?? ''}
          />
        )}
        <div className='flex flex-wrap gap-3'>
          <Button type='button' onClick={onReset} variant='secondary' disabled={isSubmitting}>
            Reset
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Calculating…' : 'Calculate'}
          </Button>
        </div>
      </form>
    </Layout>
  )
}
