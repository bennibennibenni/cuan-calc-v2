import { Input } from '@/components/Input'
import { formatIdr } from '@/utils/format'
import { Layout } from '@/components/Layout'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
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
      lot: '',
      dps: '',
      tax: '',
    })
    setValue('devidendTax', '')
    setValue('finalDevidend', '')
  }

  const onSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return
    const { lot, dps, tax } = getValues()
    const lotNumber = Number(lot)
    const dpsNumber = Number(dps)
    const taxNumber = Number(tax)
    if (!Number.isFinite(lotNumber) || !Number.isFinite(dpsNumber) || !Number.isFinite(taxNumber)) {
      setValue('devidendTax', '')
      setValue('finalDevidend', '')
      return
    }
    const devidendTax = (taxNumber / 100) * (lotNumber * 100 * dpsNumber)
    const finalDevidend = lotNumber * 100 * dpsNumber - taxNumber
    setValue('devidendTax', formatIdr(devidendTax, 0))
    setValue('finalDevidend', formatIdr(finalDevidend, 0))
  }

  const calculateAndSet = () => {
    const { lot, dps, tax } = getValues()
    if ((lot ?? '').toString().trim() === '' || (dps ?? '').toString().trim() === '' || (tax ?? '').toString().trim() === '') {
      setValue('devidendTax', '')
      setValue('finalDevidend', '')
      return
    }
    const lotNumber = Number(lot)
    const dpsNumber = Number(dps)
    const taxNumber = Number(tax)
    if (!Number.isFinite(lotNumber) || !Number.isFinite(dpsNumber) || !Number.isFinite(taxNumber)) {
      setValue('devidendTax', '')
      setValue('finalDevidend', '')
      return
    }
    const devidendTax = (taxNumber / 100) * (lotNumber * 100 * dpsNumber)
    const finalDevidend = lotNumber * 100 * dpsNumber - taxNumber
    setValue('devidendTax', formatIdr(devidendTax, 0))
    setValue('finalDevidend', formatIdr(finalDevidend, 0))
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='🏦'
      title='Devidends'
    >
      <div className='relative mt-8'>
        <Controller
          name='lot'
          control={control}
          render={({ field }) => (
              <Input
                label='Lot'
                errorMessage={errors?.lot?.message}
                formatThousands
                {...field}
                type='number'
                inputMode='numeric'
              />
          )}
        />

        <Controller
          name='dps'
          control={control}
          render={({ field }) => (
              <Input
                label='DPS'
                errorMessage={errors?.dps?.message}
                formatThousands
                {...field}
                type='number'
                inputMode='numeric'
              />
          )}
        />

        <Controller
          name='tax'
          control={control}
          render={({ field }) => (
              <Input
                label='Tax (%)'
                errorMessage={errors?.tax?.message}
                {...field}
                type='number'
                inputMode='numeric'
              />
          )}
        />
        {watch('devidendTax') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 font-subheading-sm text-gray-900 dark:text-white'
            >
              Tax Paid for Deviden
            </label>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {watch('devidendTax')}
            </label>
          </div>
        )}
        {watch('finalDevidend') && (
          <div className='mb-6 w-full'>
            <label
              htmlFor='default-input'
              className='block mb-2 font-subheading-sm text-gray-900 dark:text-white'
            >
              Deviden after Tax
            </label>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {watch('finalDevidend')}
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
