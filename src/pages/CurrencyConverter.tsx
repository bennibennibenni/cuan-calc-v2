import { Button } from '@/components/Button';
import { FormResult } from '@/components/FormResult';
import { Input } from '@/components/Input';
import { Layout } from '@/components/Layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface CurrencyApiResponse {
  usd: {
    idr: number;
  };
}

/**
 * CurrencyConverter page allows users to convert USD to IDR using the latest exchange rate.
 * Includes loading and error states for user feedback.
 *
 * @component
 * @returns {JSX.Element}
 */
export const CurrencyConverter = (): JSX.Element => {
  const schema = yup.object().shape({
    amount: yup.string().required('Oh noes! field must be filled!'),
    data: yup.mixed(),
    result: yup.string(),
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const {
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const calculateAndSet = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const { data, amount } = getValues();
      if (!amount || !data) {
        setValue('result', '');
        setLoading(false);
        return;
      }
      // Simulate async calculation or fetch
      await new Promise((resolve) => setTimeout(resolve, 500));
      const parseAmountToNumber = Number(String(amount));
      if (!Number.isFinite(parseAmountToNumber)) {
        setValue('result', '');
        setLoading(false);
        return;
      }
      setValue('result', (parseAmountToNumber * data).toString());
      setLoading(false);
    } catch (err) {
      setFetchError('Failed to convert currency. Please try again.');
      setLoading(false);
    }
  };

  const onReset = () => {
    resetField('amount')
    setValue('result', '')
  }

  const onSubmit = () => {
    const { data, amount } = getValues()
    if (amount && data) {
      const parseAmountToNumber = Number.parseFloat(String(amount))
      setValue('result', (parseAmountToNumber * data).toString())
    }
  }

  const fetchMyAPI = async () => {
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
    )
    const data: CurrencyApiResponse = await response.json()
    setValue('data', data?.usd?.idr)
  }
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(today)

  const formatToCurrency = (value: string | number | undefined) => {
    const num = Number.parseFloat(String(value ?? 0))
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  useLayoutEffect(() => {
    fetchMyAPI()
  }, [])

  return (
    <Layout
      backNavigation='/'
      icon='💱'
      title='Currency converter'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='relative mt-8'>
        {(() => {
          const amt = register('amount')
          return (
            <Input
              errorMessage={errors?.amount?.message}
              postfix='USD'
              formatThousands
              {...amt}
              type='number'
              inputMode='numeric'
              onBlur={(e) => {
                amt.onBlur && amt.onBlur(e)
                calculateAndSet()
              }}
            />
          )
        })()}
        {watch('data') != null && (
          <p className='mb-4 font-body-sm text-gray-400'>
            1 USD = {formatToCurrency(String(watch('data')))} IDR — {formattedDate}
          </p>
        )}
        {watch('result') && (
          <FormResult
            label='Result'
            value={`${formatToCurrency(watch('result'))} IDR`}
          />
        )}
        <div className='flex flex-wrap gap-3'>
          <Button type='button' onClick={onReset} variant='secondary' disabled={isSubmitting}>
            Reset
          </Button>
        </div>
      </form>
    </Layout>
  )
}
