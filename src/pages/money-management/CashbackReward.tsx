import { Input } from '@/components/Input'
import { formatIdr } from '@/utils/format'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

export const CashbackReward = () => {
  const schema = yup.object().shape({
    cashbackPercentage: yup.string().required('Oh noes! field must be fill!'),
    maxCashback: yup.string().required('Oh noes! field must be fill!'),
    result: yup.string(),
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

  const onReset = () => {
    reset({
      cashbackPercentage: '',
      maxCashback: '',
    })
    setValue('result', '')
  }

  const onSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return
    const { cashbackPercentage, maxCashback } = getValues()
    const parseCashbackPercentagetToNumber = Number(cashbackPercentage)
    const parseMaxCashbackToNumber = Number(maxCashback)
    if (!Number.isFinite(parseCashbackPercentagetToNumber) || !Number.isFinite(parseMaxCashbackToNumber)) {
      setValue('result', '')
      return
    }
    const tempResult = parseCashbackPercentagetToNumber / 100
    const tempResult2 = parseMaxCashbackToNumber / tempResult
    setValue('result', formatIdr(tempResult2, 0))
  }

  const calculateAndSet = () => {
    const { cashbackPercentage, maxCashback } = getValues()
    if ((cashbackPercentage ?? '').toString().trim() === '' || (maxCashback ?? '').toString().trim() === '') {
      setValue('result', '')
      return
    }
    const parseCashbackPercentagetToNumber = Number(cashbackPercentage)
    const parseMaxCashbackToNumber = Number(maxCashback)
    if (!Number.isFinite(parseCashbackPercentagetToNumber) || !Number.isFinite(parseMaxCashbackToNumber)) {
      setValue('result', '')
      return
    }
    const tempResult = parseCashbackPercentagetToNumber / 100
    const tempResult2 = parseMaxCashbackToNumber / tempResult
    setValue('result', formatIdr(tempResult2, 0))
  }

  return (
    <Layout
      backNavigation='/money-management'
      icon='🎁'
      title='Cashback reward'
    >
      <div className='relative mt-8'>
        <Controller
          name='cashbackPercentage'
          control={control}
          render={({ field }) => (
            <Input
              label='Cashback percentage'
              postfix='%'
              errorMessage={errors?.cashbackPercentage?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('cashbackPercentage')
              }}
                type='number'
                inputMode='numeric'
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
            />
          )}
        />

        <Controller
          name='maxCashback'
          control={control}
          render={({ field }) => (
            <Input
              label='Maximum cashback'
              errorMessage={errors?.maxCashback?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('maxCashback')
              }}
                type='number'
                inputMode='numeric'
              onBlur={(e) => {
                field.onBlur(e)
                calculateAndSet()
              }}
            />
          )}
        />
        {watch('result') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 font-subheading-sm text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {watch('result')}
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
