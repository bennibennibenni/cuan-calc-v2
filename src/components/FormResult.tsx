import React from 'react';

/**
 * FormResult displays a label and value pair, typically used for showing calculated results.
 *
 * @component
 * @param {string} label - The label describing the result.
 * @param {string} value - The value to display.
 * @returns {JSX.Element}
 */
export interface FormResultProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly label: string;
  readonly value: string;
}

export const FormResult = React.forwardRef<HTMLDivElement, FormResultProps>(
  ({ label, value, className = '', ...props }, ref) => (
    <div ref={ref} className={`mb-6 w-full ${className}`.trim()} {...props}>
      <label className='mb-2 font-subheading-sm text-gray-100' aria-label={label}>{label}</label>
      <div>
        <span className='font-body-md text-gray-300' aria-live='polite'>{value}</span>
      </div>
    </div>
  )
);

FormResult.displayName = 'FormResult';
