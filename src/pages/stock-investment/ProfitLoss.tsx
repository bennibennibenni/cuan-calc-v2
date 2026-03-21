import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

export const ProfitLoss = () => {
  const schema = yup.object().shape({
    price1: yup.string().required('Oh noes! field must be fill!'),
    price2: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
  })

  const {
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price1: '',
      price2: '',
      result: '',
    },
  })

  const calculateProfit = (costPrice: number, sellingPrice: number): string => {
    if (!Number.isFinite(costPrice) || !Number.isFinite(sellingPrice)) return ''
    if (costPrice === 0) return '∞%'
    const profit = ((sellingPrice - costPrice) / costPrice) * 100
    const profitValue = Number(profit.toFixed(2))
    const formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(profitValue)
    return `${formatted}%`
  }

  const calculateAndSet = () => {
    const { price1, price2 } = getValues() as { price1: string; price2: string }
    if (price1.trim() === '' || price2.trim() === '') {
      setValue('result', '')
      return
    }
    const costPrice = Number(price1)
    const sellingPrice = Number(price2)
    if (!Number.isFinite(costPrice) || !Number.isFinite(sellingPrice)) {
      setValue('result', '')
      return
    }
    setValue('result', calculateProfit(costPrice, sellingPrice))
  }

  const onReset = () => {
    reset()
    setValue('result', '')
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='💰'
      title='Profit and loss'
    >
      <div className='relative mt-8'>
        <Controller
          name='price1'
          control={control}
          render={({ field }) => (
            <Input
              label='Price 1'
                type='number'
                inputMode='numeric'
              errorMessage={errors?.price1?.message || ''}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
            />
          )}
        />
        <Controller
          name='price2'
          control={control}
          render={({ field }) => (
            <Input
              label='Price 2'
                type='number'
                inputMode='numeric'
              errorMessage={errors?.price2?.message || ''}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
            />
          )}
        />
        {watch('result') && (
          <FormResult label='Result' value={watch('result') ?? ''} />
        )}
        <div className='flex flex-wrap gap-3'>
          <Button type='button' onClick={onReset} variant='secondary'>
            Reset
          </Button>
        </div>
      </div>
    </Layout>
  )
}
