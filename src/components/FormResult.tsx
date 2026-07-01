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
      <label className='mb-2 block font-subheading-sm text-gray-400' aria-label={label}>{label}</label>
      <div className='rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-4 backdrop-blur-sm'>
        <span className='font-heading-sm text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300' aria-live='polite'>{value}</span>
      </div>
    </div>
  )
);

FormResult.displayName = 'FormResult';
