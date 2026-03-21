import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

/** Format raw number string with comma thousands (e.g. 1000 → "1,000", 1000000 → "1,000,000") */
function formatThousands(raw: string): string {
  if (raw === '' || raw === '.') return raw
  const [intPart = '', decPart = ''] = raw.split('.')
  const digitsOnly = intPart.replace(/\D/g, '')
  const withSeparator = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const decimal = decPart.replace(/\D/g, '')
  return decimal ? `${withSeparator}.${decimal}` : withSeparator
}

/** Parse displayed value back to raw number string for form state */
function parseFormatted(display: string): string {
  return display.replace(/,/g, '')
}

/** Normalize user input to a valid raw number string (digits and at most one decimal point) */
function toRawInput(value: string): string {
  const normalized = value.replace(/,/g, '') // strip thousand commas
  const parts = normalized.split('.')
  if (parts.length > 2)
    return toRawInput(parts[0] + '.' + parts.slice(1).join(''))
  const intPart = (parts[0] ?? '').replace(/\D/g, '')
  const decPart = (parts[1] ?? '').replace(/\D/g, '')
  if (decPart === '') return intPart
  return `${intPart}.${decPart}`
}

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'prefix'
> & {
  readonly label?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly errorMessage?: string;
  readonly prefix?: React.ReactNode;
  readonly postfix?: React.ReactNode;
  /** When true, display numbers with thousand separators (e.g. 1,000); form still receives raw value */
  readonly formatThousands?: boolean;
};

const inputBaseClass =
  'block w-full p-2.5 font-body-md text-gray-900 dark:text-white bg-hero-card border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition disabled:opacity-50 disabled:cursor-not-allowed'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    onChange,
    errorMessage,
    prefix,
    postfix,
    formatThousands: enableFormat = false,
    id: idProp,
    value: valueProp,
    type: typeProp,
    ...props
  }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const inputRef = useRef<HTMLInputElement>(null)
    const [displayValue, setDisplayValue] = useState(() =>
      enableFormat && valueProp != null && valueProp !== ''
        ? formatThousands(String(valueProp))
        : ''
    )

    useImperativeHandle(ref, () => inputRef.current!);

    // Keep internal displayValue in sync when controlled valueProp changes
    useEffect(() => {
      if (enableFormat) {
        if (valueProp != null && valueProp !== '') {
          setDisplayValue(formatThousands(String(valueProp)))
        } else {
          setDisplayValue('')
        }
      }
    }, [enableFormat, valueProp])

    const type = enableFormat ? 'text' : (typeProp ?? 'text')
    const isControlled = valueProp !== undefined && valueProp !== null

    const getRawValue = (): string => {
      if (enableFormat) {
        if (isControlled) return parseFormatted(String(valueProp ?? ''))
        return parseFormatted(displayValue)
      }
      return valueProp ?? ''
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (enableFormat) {
        const raw = toRawInput(e.target.value)
        const formatted = formatThousands(raw)
        setDisplayValue(formatted)
        const synthetic = {
          ...e,
          target: { ...e.target, value: raw, name: e.target.name },
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(synthetic)
      } else {
        onChange?.(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (enableFormat) {
        const raw = getRawValue()
        setDisplayValue(formatThousands(raw))
        const synthetic = {
          ...e,
          target: { ...e.target, value: raw, name: e.target.name },
        } as React.FocusEvent<HTMLInputElement>
        props.onBlur?.(synthetic)
      } else {
        props.onBlur?.(e)
      }
    }

    let inputValue: string | undefined
    if (!enableFormat) {
      // Normal unformatted input
      if (!isControlled) {
        inputValue = undefined
      } else {
        inputValue = valueProp as string | undefined
      }
    } else {
      // For formatted input, show formatted controlled value or internal display
      if (isControlled && valueProp != null) {
        inputValue = formatThousands(String(valueProp))
      } else {
        inputValue = displayValue
      }
    }

    const inputElement = (
      <input
        {...props}
        ref={inputRef}
        id={id}
        type={type}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${inputBaseClass} ${prefix ? 'ps-10' : ''} ${postfix ? 'pe-10' : ''} ${props.className ?? ''}`.trim()}
      />
    );

    const hasAffix = prefix || postfix
    const wrappedInput = hasAffix ? (
      <div className='relative'>
        {prefix && (
          <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 font-body-sm text-gray-500'>
            {prefix}
          </div>
        )}
        {inputElement}
        {postfix && (
          <div className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5 font-body-sm text-gray-500'>
            {postfix}
          </div>
        )}
      </div>
    ) : (
      inputElement
    )

    return (
      <div className='mb-6 w-full'>
        {label && (
          <label
            htmlFor={id}
            className='block mb-2 font-subheading-sm text-gray-100'
            aria-label={label}
          >
            {label}
          </label>
        )}
        {wrappedInput}
        {errorMessage && (
          <p className='mt-2 font-body-sm text-red-400' role='alert' aria-live='assertive'>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
