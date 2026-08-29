import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

/** Format raw number string with dot thousands (e.g. 1000 → "1.000", 1000.5 → "1.000,5") */
function formatThousands(raw: string): string {
  if (raw === '' || raw === ',' || raw === '.') return raw
  const isComma = raw.includes(',')
  const separator = isComma ? ',' : '.'
  const [intPart = '', decPart] = raw.includes('.') && isComma
    ? raw.split(',')
    : raw.split(separator)
  const digitsOnly = intPart.replace(/\D/g, '')
  const withSeparator = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  if (decPart !== undefined) {
    const decimal = decPart.replace(/\D/g, '')
    return `${withSeparator},${decimal}`
  }
  return withSeparator
}

/** Parse displayed value back to raw number string for form state */
function parseFormatted(display: string): string {
  return display.replace(/\./g, '').replace(/,/g, '.')
}

/** Normalize user input to a valid raw number string (digits and at most one decimal point) */
function toRawInput(value: string): string {
  const normalized = value.replace(/\./g, '') // strip thousand dots
  const parts = normalized.split(',')
  if (parts.length > 2)
    return toRawInput(parts[0] + ',' + parts.slice(1).join(''))
  const intPart = (parts[0] ?? '').replace(/\D/g, '')
  const decPart = parts[1] !== undefined ? parts[1].replace(/\D/g, '') : undefined
  if (decPart === undefined) return intPart
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
  readonly containerClassName?: string;
  /** When true, display numbers with thousand separators (e.g. 1,000); form still receives raw value */
  readonly formatThousands?: boolean;
};

const inputBaseClass =
  'block w-full p-3 font-body-md text-gray-100 bg-white/[0.03] border border-gray-700/50 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-lg focus:shadow-violet-500/10 hover:border-gray-600/70 hover:bg-white/[0.04] outline-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    onChange,
    errorMessage,
    prefix,
    postfix,
    containerClassName = '',
    formatThousands: enableFormat = false,
    id: idProp,
    value: valueProp,
    type: typeProp,
    style: styleProp,
    ...props
  }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const inputRef = useRef<HTMLInputElement>(null)
    const prefixRef = useRef<HTMLDivElement>(null)
    const postfixRef = useRef<HTMLDivElement>(null)
    const [prefixWidth, setPrefixWidth] = useState<number | undefined>()
    const [postfixWidth, setPostfixWidth] = useState<number | undefined>()

    const [displayValue, setDisplayValue] = useState(() =>
      enableFormat && valueProp != null && valueProp !== ''
        ? formatThousands(String(valueProp))
        : ''
    )

    useImperativeHandle(ref, () => inputRef.current!);

    // Measure prefix and postfix width dynamically
    useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth + 14)
      }
      if (postfixRef.current) {
        setPostfixWidth(postfixRef.current.offsetWidth + 14)
      }
    }, [prefix, postfix])

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
      return String(valueProp ?? '')
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
        inputValue = String(valueProp)
      }
    } else {
      // For formatted input, show formatted controlled value or internal display
      if (isControlled && valueProp != null) {
        inputValue = formatThousands(String(valueProp))
      } else {
        inputValue = displayValue
      }
    }

    // Compute safe fallback paddings based on affix content
    const fallbackPrefixPadding = prefix ? 44 : undefined
    const fallbackPostfixPadding = postfix
      ? typeof postfix === 'string'
        ? Math.max(48, postfix.length * 10 + 24)
        : 56
      : undefined

    const computedPaddingLeft = prefix ? (prefixWidth ?? fallbackPrefixPadding) : undefined
    const computedPaddingRight = postfix ? (postfixWidth ?? fallbackPostfixPadding) : undefined

    const inputElement = (
      <input
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck={false}
        {...props}
        ref={inputRef}
        id={id}
        type={type}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          paddingLeft: computedPaddingLeft,
          paddingRight: computedPaddingRight,
          ...styleProp,
        }}
        className={`${inputBaseClass} ${props.className ?? ''}`.trim()}
      />
    );

    const hasAffix = prefix || postfix
    const wrappedInput = hasAffix ? (
      <div className='relative flex items-center'>
        {prefix && (
          <div
            ref={prefixRef}
            className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 font-body-sm text-gray-400 select-none'
          >
            {prefix}
          </div>
        )}
        {inputElement}
        {postfix && (
          <div
            ref={postfixRef}
            className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5 font-body-sm text-gray-400 select-none'
          >
            {postfix}
          </div>
        )}
      </div>
    ) : (
      inputElement
    )

    return (
      <div className={`mb-6 w-full ${containerClassName}`.trim()}>
        {label && (
          <label
            htmlFor={id}
            className='block mb-2 font-subheading-sm text-gray-100'
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
