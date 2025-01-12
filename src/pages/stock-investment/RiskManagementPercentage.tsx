import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
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
      const { marketPrice, takeProfitPercentage, stopLossPercentage } =
        getValues()
      const marketPriceNumber = parseFloat(marketPrice)
      const takeProfitPercentageNumber = parseFloat(takeProfitPercentage)
      const stopLossPercentageNumber = parseFloat(stopLossPercentage)
      const calculateProfitPrice1 = takeProfitPercentageNumber / 100
      const calculateProfitPrice2 = calculateProfitPrice1 * marketPriceNumber
      const calculateStopLossPrice1 = stopLossPercentageNumber / 100
      const calculateStopLossPrice2 =
        calculateStopLossPrice1 * marketPriceNumber
      setValue(
        'takeProfitResult',
        'Rp' + ' ' + (marketPriceNumber + calculateProfitPrice2)
      )
      setValue(
        'stopLossResult',
        'Rp' + ' ' + (marketPriceNumber - calculateStopLossPrice2)
      )
    }
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
        <Input
          label='Price'
          errorMessage={errors?.marketPrice?.message}
          prefix='Rp'
          {...register('marketPrice')}
          onChange={() => clearErrors('marketPrice')}
        />
        <Input
          label='Take profit'
          errorMessage={errors?.takeProfitPercentage?.message}
          postfix='%'
          {...register('takeProfitPercentage')}
          onChange={() => clearErrors('takeProfitPercentage')}
        />
        <Input
          label='Stop loss'
          errorMessage={errors?.stopLossPercentage?.message}
          postfix='%'
          {...register('stopLossPercentage')}
          onChange={() => clearErrors('stopLossPercentage')}
        />
        {watch('takeProfitResult') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Take profit
            </label>
            <p>{getValues('takeProfitResult')}</p>
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
            <p>{getValues('stopLossResult')}</p>
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
