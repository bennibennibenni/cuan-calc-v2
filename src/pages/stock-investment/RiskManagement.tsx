import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

export const RiskManagement = () => {
  const schema = yup.object({
    marketPrice: yup.string().required('Oh noes! field must be fill!'),
    takeProfitPrice: yup.string().required('Oh noes! field must be fill!'),
    stopLossPrice: yup.string().required('Oh noes! field must be fill!'),
    takeProfitResult: yup.string(),
    stopLossResult: yup.string(),
  })

  const {
    control,
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return
    const { marketPrice, takeProfitPrice, stopLossPrice } = getValues()
    const marketPriceNum = Number(marketPrice)
    const takeProfitPriceNum = Number(takeProfitPrice)
    const stopLossPriceNum = Number(stopLossPrice)
    if (!Number.isFinite(marketPriceNum) || marketPriceNum === 0) return
    const calcualteProfitPrice1 = takeProfitPriceNum - marketPriceNum
    const calcualteProfitPrice2 = (calcualteProfitPrice1 * 100) / marketPriceNum
    const calcualteStopLossPrice1 = marketPriceNum - stopLossPriceNum
    const calcualteStopLossPrice2 = (calcualteStopLossPrice1 * 100) / marketPriceNum
    const fmtProfit = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calcualteProfitPrice2)
    const fmtStop = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calcualteStopLossPrice2)
    setValue('takeProfitResult', `${fmtProfit}%`)
    setValue('stopLossResult', `${fmtStop}%`)
  }

  const calculateAndSet = () => {
    const { marketPrice, takeProfitPrice, stopLossPrice } = getValues()
    if (
      (marketPrice ?? '').toString().trim() === '' ||
      (takeProfitPrice ?? '').toString().trim() === '' ||
      (stopLossPrice ?? '').toString().trim() === ''
    ) {
      setValue('takeProfitResult', '')
      setValue('stopLossResult', '')
      return
    }
    const marketPriceNum = Number(marketPrice)
    const takeProfitPriceNum = Number(takeProfitPrice)
    const stopLossPriceNum = Number(stopLossPrice)
    if (!Number.isFinite(marketPriceNum) || marketPriceNum === 0) {
      setValue('takeProfitResult', '')
      setValue('stopLossResult', '')
      return
    }
    const calcualteProfitPrice1 = takeProfitPriceNum - marketPriceNum
    const calcualteProfitPrice2 = (calcualteProfitPrice1 * 100) / marketPriceNum
    const calcualteStopLossPrice1 = marketPriceNum - stopLossPriceNum
    const calcualteStopLossPrice2 = (calcualteStopLossPrice1 * 100) / marketPriceNum
    const fmtProfit = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calcualteProfitPrice2)
    const fmtStop = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calcualteStopLossPrice2)
    setValue('takeProfitResult', `${fmtProfit}%`)
    setValue('stopLossResult', `${fmtStop}%`)
  }

  const onReset = () => {
    reset({
      marketPrice: '',
      takeProfitPrice: '',
      stopLossPrice: '',
      takeProfitResult: '',
      stopLossResult: '',
    })
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='🛡️'
      title='Risk management'
    >
      <div className='relative mt-8'>
        <Controller
          name='marketPrice'
          control={control}
          render={({ field }) => (
            <Input
              label='Price'
              errorMessage={errors?.marketPrice?.message}
              prefix='Rp'
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('marketPrice')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />

        <Controller
          name='takeProfitPrice'
          control={control}
          render={({ field }) => (
            <Input
              label='Take profit'
              errorMessage={errors?.takeProfitPrice?.message}
              prefix='Rp'
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('takeProfitPrice')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />

        <Controller
          name='stopLossPrice'
          control={control}
          render={({ field }) => (
            <Input
              label='Stop loss'
              errorMessage={errors?.stopLossPrice?.message}
              prefix='Rp'
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('stopLossPrice')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        {watch('takeProfitResult') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 font-subheading-sm text-gray-900 dark:text-white'
            >
              Take profit
            </label>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {watch('takeProfitResult')}
            </label>
          </div>
        )}
        {watch('stopLossResult') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 font-subheading-sm text-gray-900 dark:text-white'
            >
              Stop loss
            </label>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {watch('stopLossResult')}
            </label>
          </div>
        )}
        <button
          onClick={onReset}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-hidden focus:ring-purple-300 font-subheading-sm rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        
      </div>
    </Layout>
  )
}
