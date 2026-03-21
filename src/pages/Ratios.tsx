import { Input } from '@/components/Input';
import { Layout } from '@/components/Layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

/**
 * Ratios page allows users to calculate financial ratios.
 * Includes validation and error feedback for incomplete input.
 *
 * @component
 * @returns {JSX.Element}
 */
export const Ratios = (): JSX.Element => {
  const schema = yup.object().shape({
    value1: yup.string(),
    value2: yup.string(),
    value3: yup.string(),
    value4: yup.string(),
  });

  const [error, setError] = useState('');

  const { control, reset, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({
      value1: '',
      value2: '',
      value3: '',
      value4: '',
    });
    setError('');
  };

  const onSubmit = () => {
    const { value1, value2, value3, value4 } = getValues();
    const values = [value1, value2, value3, value4];
    const emptyField = values.filter(
      (value) => value === undefined || isNaN(Number(value)) || value === ''
    ).length;
    if (emptyField > 1) {
      setError('Please fill out at least 3 fields');
      return;
    }
    if (emptyField === 0) {
      setError('Please empty out 1 field')
      return
    }
    const numValue1 = parseFloat(value1 || '0')
    const numValue2 = parseFloat(value2 || '0')
    const numValue3 = parseFloat(value3 || '0')
    const numValue4 = parseFloat(value4 || '0')

    if (!value1) {
      setValue('value1', ((numValue3 * numValue2) / numValue4).toString())
    } else if (!value2) {
      setValue('value2', ((numValue1 * numValue4) / numValue3).toString())
    } else if (!value3) {
      setValue('value3', ((numValue1 * numValue4) / numValue2).toString())
    } else if (!value4) {
      setValue('value4', ((numValue3 * numValue2) / numValue1).toString())
    }
    setError('')
  }

  const calculateAndSet = () => {
    const { value1, value2, value3, value4 } = getValues()
    const values = [value1, value2, value3, value4]
    const emptyField = values.filter(
      (value) => value === undefined || isNaN(Number(value)) || value === ''
    ).length
    if (emptyField > 1) {
      setError('Please fill out at least 3 fields')
      return
    }
    if (emptyField === 0) {
      setError('Please empty out 1 field')
      return
    }
    const numValue1 = parseFloat(value1 || '0')
    const numValue2 = parseFloat(value2 || '0')
    const numValue3 = parseFloat(value3 || '0')
    const numValue4 = parseFloat(value4 || '0')

    if (!value1) {
      setValue('value1', ((numValue3 * numValue2) / numValue4).toString())
    } else if (!value2) {
      setValue('value2', ((numValue1 * numValue4) / numValue3).toString())
    } else if (!value3) {
      setValue('value3', ((numValue1 * numValue4) / numValue2).toString())
    } else if (!value4) {
      setValue('value4', ((numValue3 * numValue2) / numValue1).toString())
    }
    setError('')
  }

  return (
    <Layout
      backNavigation='/'
      icon='➗'
      title='Ratios'
    >
      <div className='relative mt-8'>
        <div className='flex'>
          <Controller
            name='value1'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => {
                  const val = typeof e === 'string' ? e : e.target.value
                  field.onChange(val)
                  setError('')
                }}
                onBlur={(e) => {
                  field.onBlur(e)
                  calculateAndSet()
                }}
                formatThousands
                type='number'
                inputMode='numeric'
              />
            )}
          />
          <label className='block mb-6 mx-2 font-body-sm text-gray-900 dark:text-white'>
            :
          </label>
          <Controller
            name='value2'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => {
                  const val = typeof e === 'string' ? e : e.target.value
                  field.onChange(val)
                  setError('')
                }}
                onBlur={(e) => {
                  field.onBlur(e)
                  calculateAndSet()
                }}
                formatThousands
                type='number'
                inputMode='numeric'
              />
            )}
          />
        </div>
        <div className='flex'>
          <Controller
            name='value3'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => {
                  const val = typeof e === 'string' ? e : e.target.value
                  field.onChange(val)
                  setError('')
                }}
                onBlur={(e) => {
                  field.onBlur(e)
                  calculateAndSet()
                }}
                formatThousands
                type='number'
                inputMode='numeric'
              />
            )}
          />
          <label className='block mb-2 mx-2 font-body-sm text-gray-900 dark:text-white'>
            :
          </label>
          <Controller
            name='value4'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => {
                  const val = typeof e === 'string' ? e : e.target.value
                  field.onChange(val)
                  setError('')
                }}
                onBlur={(e) => {
                  field.onBlur(e)
                  calculateAndSet()
                }}
                formatThousands
                type='number'
                inputMode='numeric'
              />
            )}
          />
        </div>
        {error && (
          <div className='mb-6 w-full'>
            <label className='block mb-2 font-body-sm text-gray-900 dark:text-white'>
              {error}
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
