import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const ProfitLoss = () => {
  const schema = yup.object().shape({
    price1: yup.string().required('Oh noes! field must be fill!'),
    price2: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
  })

  const {
    register,
    reset,
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async () => {
    const isValid = await trigger()
    if (isValid) {
      const { price1, price2 } = getValues()
      const costPrice = parseFloat(price1)
      const sellingPrice = parseFloat(price2)
      const profit = ((sellingPrice - costPrice) / costPrice) * 100
      setValue('result', parseFloat(profit.toFixed(2)) + '%')
    }
  }

  const onReset = () => {
    reset({
      price1: '',
      price2: '',
      result: '',
    })
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='💰'
      title='Profit and loss'
    >
      <div className='relative mt-8'>
        <Input
          label='Price 1'
          errorMessage={errors?.price1?.message || ''}
          {...register('price1')}
          onChange={() => clearErrors('price1')}
        />
        <Input
          errorMessage={errors?.price2?.message || ''}
          label='Price 2'
          {...register('price2')}
          onChange={() => clearErrors('price2')}
        />
        {watch('result') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm  text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result')}
            </label>
          </div>
        )}
        <button
          type='button'
          onClick={onReset}
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
