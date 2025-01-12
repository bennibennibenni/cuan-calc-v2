import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const CashbackReward = () => {
  const schema = yup.object().shape({
    cashbackPercentage: yup.string().required('Oh noes! field must be fill!'),
    maxCashback: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
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

  const onReset = () => {
    reset({
      cashbackPercentage: '',
      maxCashback: '',
    })
  }

  const onSubmit = async () => {
    const isValid = await trigger()
    if (isValid) {
      const { cashbackPercentage, maxCashback } = getValues()
      const parseCashbackPercentagetToNumber = parseFloat(
        cashbackPercentage as string
      )
      const parseMaxCashbackToNumber = parseFloat(maxCashback as string)
      const tempResult = parseCashbackPercentagetToNumber / 100
      const tempResult2 = parseMaxCashbackToNumber / tempResult
      setValue('result', 'Rp' + ' ' + tempResult2)
    }
  }

  return (
    <Layout
      backNavigation='/money-management'
      icon='🎁'
      title='Cashback reward'
    >
      <div className='relative mt-8'>
        <Input
          label='Cashback percentage'
          postfix='%'
          errorMessage={errors?.cashbackPercentage?.message}
          {...register('cashbackPercentage')}
          onChange={() => clearErrors('cashbackPercentage')}
        />
        <Input
          label='Maximum cashback'
          errorMessage={errors?.maxCashback?.message}
          {...register('maxCashback')}
          onChange={() => clearErrors('maxCashback')}
        />
        {watch('result') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result')}
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
