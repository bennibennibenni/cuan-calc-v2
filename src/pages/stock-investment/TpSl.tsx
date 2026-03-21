import { Button } from '@/components/Button'
import { FormResult } from '@/components/FormResult'
import { Input } from '@/components/Input'
import { Layout } from '@/components/Layout'
import { formatIdr } from '@/utils/format'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
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
    control,
    resetField,
    setValue,
    getValues,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onReset1 = () => {
    resetField('value1')
    resetField('value2')
    setValue('result1', '')
  }

  const onReset2 = () => {
    resetField('value3')
    resetField('value4')
    setValue('result2', '')
  }

  const onReset3 = () => {
    resetField('value5')
    resetField('value6')
    setValue('result3', '')
  }

  const onReset4 = () => {
    resetField('value7')
    resetField('value8')
    setValue('result4', '')
  }

  const calculate1 = () => {
    const { value1, value2 } = getValues()
    if (
      (value1 ?? '').toString().trim() === '' ||
      (value2 ?? '').toString().trim() === ''
    ) {
      setValue('result1', '')
      return
    }
    const value1Number = Number(value1)
    const value2Number = Number(value2)
    if (!Number.isFinite(value1Number) || !Number.isFinite(value2Number)) {
      setValue('result1', '')
      return
    }
    const tempResult1 = value1Number / 100
    const tempResult2 = tempResult1 * value2Number
    const finalResult = tempResult2 + value2Number
    setValue('result1', formatIdr(finalResult, 0))
  }

  const calculate2 = () => {
    const { value3, value4 } = getValues()
    if (
      (value3 ?? '').toString().trim() === '' ||
      (value4 ?? '').toString().trim() === ''
    ) {
      setValue('result2', '')
      return
    }
    const value3Number = Number(value3)
    const value4Number = Number(value4)
    if (!Number.isFinite(value3Number) || !Number.isFinite(value4Number)) {
      setValue('result2', '')
      return
    }
    const tempResult1 = value3Number / 100
    const tempResult2 = tempResult1 * value4Number
    const finalResult = value4Number - tempResult2
    setValue('result2', formatIdr(finalResult, 0))
  }

  const calculate3 = () => {
    const { value5, value6 } = getValues()
    if (
      (value5 ?? '').toString().trim() === '' ||
      (value6 ?? '').toString().trim() === ''
    ) {
      setValue('result3', '')
      return
    }
    const value5Number = Number(value5)
    const value6Number = Number(value6)
    if (!Number.isFinite(value5Number) || !Number.isFinite(value6Number)) {
      setValue('result3', '')
      return
    }
    const tempResult1 = value5Number / 100
    const finalResult = tempResult1 * value6Number
    setValue('result3', formatIdr(finalResult, 0))
  }

  const calculate4 = () => {
    const { value7, value8 } = getValues()
    if (
      (value7 ?? '').toString().trim() === '' ||
      (value8 ?? '').toString().trim() === ''
    ) {
      setValue('result4', '')
      return
    }
    const value7Number = Number(value7)
    const value8Number = Number(value8)
    if (
      !Number.isFinite(value7Number) ||
      !Number.isFinite(value8Number) ||
      value8Number === 0
    ) {
      setValue('result4', '')
      return
    }
    const tempResult1 = value7Number * 100
    const finalResult = tempResult1 / value8Number
    const formattedPct = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(finalResult)
    setValue('result4', `${formattedPct}%`)
  }

  return (
    <Layout
      backNavigation='/stock-investment'
      icon='🎯'
      title='Take profit and stop loss'
    >
      <div className='relative mt-8'>
        <Controller
          name='value1'
          control={control}
          render={({ field }) => (
            <Input
              label='Increase'
              postfix='%'
              errorMessage={errors?.value1?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value1')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate1()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        <Controller
          name='value2'
          control={control}
          render={({ field }) => (
            <Input
              label='of'
              prefix='Rp'
              errorMessage={errors?.value2?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value2')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate1()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        {watch('result1') && (
          <FormResult
            label='Result'
            value={watch('result1') ?? ''}
          />
        )}
        <Button
          type='button'
          onClick={onReset1}
          variant='secondary'
        >
          Reset
        </Button>
      </div>
      {/* SECTION 2 */}
      <div className='relative mt-8'>
        <Controller
          name='value3'
          control={control}
          render={({ field }) => (
            <Input
              label='Decrease'
              postfix='%'
              errorMessage={errors?.value3?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value3')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate2()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        <Controller
          name='value4'
          control={control}
          render={({ field }) => (
            <Input
              label='of'
              prefix='Rp'
              errorMessage={errors?.value4?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value4')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate2()
              }}
              type='number'
              inputMode='numeric'
            />
          )}
        />
        {watch('result2') && (
          <FormResult
            label='Result'
            value={watch('result2') ?? ''}
          />
        )}
        <Button
          type='button'
          onClick={onReset2}
          variant='secondary'
        >
          Reset
        </Button>
      </div>
      {/* SECTION 3 */}
      <div className='relative mt-8'>
        <Controller
          name='value5'
          control={control}
          render={({ field }) => (
            <Input
              label='What is'
              postfix='%'
              errorMessage={errors?.value5?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value5')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate3()
              }}
            />
          )}
        />
        <Controller
          name='value6'
          control={control}
          render={({ field }) => (
            <Input
              label='of'
              prefix='Rp'
              errorMessage={errors?.value6?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value6')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate3()
              }}
            />
          )}
        />
        {watch('result3') && (
          <FormResult
            label='Result'
            value={watch('result3') ?? ''}
          />
        )}
        <Button
          type='button'
          onClick={onReset3}
          variant='secondary'
        >
          Reset
        </Button>
      </div>
      {/* SECTION 4 */}
      <div className='relative mt-8'>
        <Controller
          name='value7'
          control={control}
          render={({ field }) => (
            <Input
              prefix='Rp'
              errorMessage={errors?.value7?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value7')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate4()
              }}
            />
          )}
        />
        <Controller
          name='value8'
          control={control}
          render={({ field }) => (
            <Input
              label='is what percent of'
              prefix='Rp'
              errorMessage={errors?.value8?.message}
              formatThousands
              value={field.value}
              onChange={(e) => {
                const val = typeof e === 'string' ? e : e.target.value
                field.onChange(val)
                clearErrors('value8')
              }}
              onBlur={(e) => {
                field.onBlur(e)
                calculate4()
              }}
            />
          )}
        />
        {watch('result4') && (
          <FormResult
            label='Result'
            value={watch('result4') ?? ''}
          />
        )}
        <Button
          type='button'
          onClick={onReset4}
          variant='secondary'
        >
          Reset
        </Button>
      </div>
    </Layout>
  )
}
