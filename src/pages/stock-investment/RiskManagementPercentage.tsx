import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

export const RiskManagementPercentage = () => {
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
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async () => {
    const isValid = await trigger()
    if (isValid) {
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
  }

  const calculateAndSet = () => {
    const { marketPrice, takeProfitPercentage, stopLossPercentage } =
      getValues()
    if (
      (marketPrice ?? '').toString().trim() === '' ||
      (takeProfitPercentage ?? '').toString().trim() === '' ||
      (stopLossPercentage ?? '').toString().trim() === ''
    ) {
      setValue('takeProfitResult', '')
      setValue('stopLossResult', '')
      return
    }
    const marketPriceNumber = Number(marketPrice)
    const takeProfitPercentageNumber = Number(takeProfitPercentage)
    const stopLossPercentageNumber = Number(stopLossPercentage)
    if (!Number.isFinite(marketPriceNumber) || marketPriceNumber === 0) {
      setValue('takeProfitResult', '')
      setValue('stopLossResult', '')
      return
    }
    const calculateProfitPrice1 = takeProfitPercentageNumber / 100
    const calculateProfitPrice2 = calculateProfitPrice1 * marketPriceNumber
    const calculateStopLossPrice1 = stopLossPercentageNumber / 100
    const calculateStopLossPrice2 = calculateStopLossPrice1 * marketPriceNumber
    setValue('takeProfitResult', formatIdr(marketPriceNumber + calculateProfitPrice2, 0))
    setValue('stopLossResult', formatIdr(marketPriceNumber - calculateStopLossPrice2, 0))
  }

  const onReset = () => {
    reset({
      marketPrice: '',
      takeProfitPercentage: '',
      stopLossPercentage: '',
      takeProfitResult: '',
      stopLossResult: '',
    })
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='📊'
      title='Risk management (%)'
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
            />
          )}
        />

        <Controller
          name='takeProfitPercentage'
          control={control}
          render={({ field }) => (
            <Input
              label='Take profit'
              errorMessage={errors?.takeProfitPercentage?.message}
              postfix='%'
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('takeProfitPercentage')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
            />
          )}
        />

        <Controller
          name='stopLossPercentage'
          control={control}
          render={({ field }) => (
            <Input
              label='Stop loss'
              errorMessage={errors?.stopLossPercentage?.message}
              postfix='%'
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('stopLossPercentage')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
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
            <p className='font-body-sm'>{getValues('takeProfitResult')}</p>
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
            <p className='font-body-sm'>{getValues('stopLossResult')}</p>
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
