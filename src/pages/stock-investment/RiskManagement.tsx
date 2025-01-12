import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
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
    register,
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
      const { marketPrice, takeProfitPrice, stopLossPrice } = getValues()
      const marketPriceNum = parseFloat(marketPrice)
      const takeProfitPriceNum = parseFloat(takeProfitPrice)
      const stopLossPriceNum = parseFloat(stopLossPrice)
      const calcualteProfitPrice1 = takeProfitPriceNum - marketPriceNum
      const calcualteProfitPrice2 =
        (calcualteProfitPrice1 * 100) / marketPriceNum
      const calcualteStopLossPrice1 = marketPriceNum - stopLossPriceNum
      const calcualteStopLossPrice2 =
        (calcualteStopLossPrice1 * 100) / marketPriceNum
      setValue('takeProfitResult', calcualteProfitPrice2 + '%')
      setValue('stopLossResult', calcualteStopLossPrice2 + '%')
    }
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
        <Input
          label='Price'
          errorMessage={errors?.marketPrice?.message}
          prefix='Rp'
          {...register('marketPrice')}
          onChange={() => clearErrors('marketPrice')}
        />
        <Input
          label='Take profit'
          errorMessage={errors?.takeProfitPrice?.message}
          prefix='Rp'
          {...register('takeProfitPrice')}
          onChange={() => clearErrors('takeProfitPrice')}
        />
        <Input
          label='Stop loss'
          errorMessage={errors?.stopLossPrice?.message}
          prefix='Rp'
          {...register('stopLossPrice')}
          onChange={() => clearErrors('stopLossPrice')}
        />
        {watch('takeProfitResult') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Take profit
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('takeProfitResult')}
            </label>
          </div>
        )}
        {watch('stopLossResult') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Stop loss
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('stopLossResult')}
            </label>
          </div>
        )}
        <button
          onClick={onReset}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onSubmit}
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Calculate
        </button>
      </div>
    </Layout>
  )
}
