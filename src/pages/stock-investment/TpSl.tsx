import { Input } from '@/components/Input.tsx'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const TpSl = () => {
  const schema = yup.object().shape({
    value1: yup.string().required('Oh noes! field must be fill!'),
    value2: yup.string().required('Oh noes! field must be fill!'),
    value3: yup.string().required('Oh noes! field must be fill!'),
    value4: yup.string().required('Oh noes! field must be fill!'),
    value5: yup.string().required('Oh noes! field must be fill!'),
    value6: yup.string().required('Oh noes! field must be fill!'),
    value7: yup.string().required('Oh noes! field must be fill!'),
    value8: yup.string().required('Oh noes! field must be fill!'),
    result1: yup.string(),
    result2: yup.string(),
    result3: yup.string(),
    result4: yup.string(),
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

  const onReset1 = () => {
    reset({
      value1: '',
      value2: '',
    })
  }

  const onReset2 = () => {
    reset({
      value3: '',
      value4: '',
    })
  }

  const onReset3 = () => {
    reset({
      value5: '',
      value6: '',
    })
  }

  const onReset4 = () => {
    reset({
      value7: '',
      value8: '',
    })
  }

  const onSubmit1 = async () => {
    const isValid = await trigger(['value1', 'value2'])
    if (isValid) {
      const { value1, value2 } = getValues()
      const value1Number = parseFloat(value1)
      const value2Number = parseFloat(value2)
      const tempResult1 = value1Number / 100
      const tempResult2 = tempResult1 * value2Number
      const finalResult = tempResult2 + value2Number
      setValue('result1', 'Rp' + ' ' + finalResult)
    }
  }

  const onSubmit2 = async () => {
    const isValid = await trigger(['value3', 'value4'])
    if (isValid) {
      const { value3, value4 } = getValues()
      const value3Number = parseFloat(value3)
      const value4Number = parseFloat(value4)
      const tempResult1 = value3Number / 100
      const tempResult2 = tempResult1 * value4Number
      const finalResult = value4Number - tempResult2
      setValue('result2', 'Rp' + ' ' + finalResult)
    }
  }

  const onSubmit3 = async () => {
    const isValid = await trigger(['value5', 'value6'])
    if (isValid) {
      const { value5, value6 } = getValues()
      const value5Number = parseFloat(value5)
      const value6Number = parseFloat(value6)
      const tempResult1 = value5Number / 100
      const finalResult = tempResult1 * value6Number
      setValue('result3', 'Rp' + ' ' + finalResult)
    }
  }

  const onSubmit4 = async () => {
    const isValid = await trigger(['value7', 'value8'])
    if (isValid) {
      const { value7, value8 } = getValues()
      const value7Number = parseFloat(value7)
      const value8Number = parseFloat(value8)
      const tempResult1 = value7Number * 100
      const finalResult = tempResult1 / value8Number
      setValue('result4', finalResult + ' ' + '%')
    }
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='🎯'
      title='Take profit and stop loss'
    >
      <div className='relative mt-8'>
        <Input
          label='Increase'
          postfix='%'
          errorMessage={errors?.value1?.message}
          {...register('value1')}
          onChange={() => clearErrors('value1')}
        />
        <Input
          label='of'
          prefix='Rp'
          errorMessage={errors?.value2?.message}
          {...register('value2')}
          onChange={() => clearErrors('value2')}
        />
        {watch('result1') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result1')}
            </label>
          </div>
        )}
        <button
          onClick={onReset1}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onSubmit1}
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Calculate
        </button>
      </div>
      {/* SECTION 2 */}
      <div className='relative mt-8'>
        <Input
          label='Decrease'
          postfix='%'
          errorMessage={errors?.value3?.message}
          {...register('value3')}
          onChange={() => clearErrors('value3')}
        />
        <Input
          label='of'
          prefix='Rp'
          errorMessage={errors?.value4?.message}
          {...register('value4')}
          onChange={() => clearErrors('value4')}
        />
        {watch('result2') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result2')}
            </label>
          </div>
        )}
        <button
          onClick={onReset2}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onSubmit2}
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Calculate
        </button>
      </div>
      {/* SECTION 3 */}
      <div className='relative mt-8'>
        <Input
          label='What is'
          postfix='%'
          errorMessage={errors?.value5?.message}
          {...register('value5')}
          onChange={() => clearErrors('value5')}
        />
        <Input
          label='of'
          prefix='Rp'
          errorMessage={errors?.value6?.message}
          {...register('value6')}
          onChange={() => clearErrors('value6')}
        />
        {watch('result3') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result3')}
            </label>
          </div>
        )}
        <button
          onClick={onReset3}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onSubmit3}
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Calculate
        </button>
      </div>
      {/* SECTION 4 */}
      <div className='relative mt-8'>
        <Input
          prefix='Rp'
          errorMessage={errors?.value7?.message}
          {...register('value7')}
          onChange={() => clearErrors('value7')}
        />
        <Input
          label='is what percent of'
          prefix='Rp'
          errorMessage={errors?.value8?.message}
          {...register('value8')}
          onChange={() => clearErrors('value8')}
        />
        {watch('result4') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Result
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('result4')}
            </label>
          </div>
        )}
        <button
          onClick={onReset4}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Reset
        </button>
        <button
          type='button'
          onClick={onSubmit4}
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Calculate
        </button>
      </div>
    </Layout>
  )
}
