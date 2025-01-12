import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const Devidends = () => {
  const schema = yup.object().shape({
    lot: yup.string().required('Oh noes! field must be fill!'),
    dps: yup.string().required('Oh noes! field must be fill!'),
    tax: yup.string().required('Oh noes! field must be fill!'),
    devidendTax: yup.string(),
    finalDevidend: yup.string(),
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
      lot: '',
      dps: '',
      tax: '',
    })
  }

  const onSubmit = async () => {
    const isValid = await trigger()
    if (isValid) {
      const { lot, dps, tax } = getValues()
      const lotNumber = parseFloat(lot)
      const dpsNumber = parseFloat(dps)
      const taxNumber = parseFloat(tax)
      const devidendTax = (taxNumber / 100) * (lotNumber * 100 * dpsNumber)
      const finalDevidend = lotNumber * 100 * dpsNumber - taxNumber
      setValue('devidendTax', 'Rp' + ' ' + devidendTax)
      setValue('finalDevidend', 'Rp' + ' ' + finalDevidend)
    }
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='🏦'
      title='Devidends'
    >
      <div className='relative mt-8'>
        <Input
          label='Lot'
          errorMessage={errors?.lot?.message}
          {...register('lot')}
          onChange={() => clearErrors('lot')}
        />
        <Input
          label='Devidend per share'
          errorMessage={errors?.dps?.message}
          prefix='Rp'
          {...register('dps')}
          onChange={() => clearErrors('dps')}
        />
        <Input
          label='Tax'
          errorMessage={errors?.tax?.message}
          postfix='%'
          {...register('tax')}
          onChange={() => clearErrors('tax')}
        />
        {watch('devidendTax') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Tax Paid for Deviden
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('devidendTax')}
            </label>
          </div>
        )}
        {watch('finalDevidend') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Deviden after Tax
            </label>
            <label className='block mb-2 text-sm  text-gray-900 dark:text-white'>
              {watch('finalDevidend')}
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
