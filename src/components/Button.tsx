import React from 'react';
export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly children: React.ReactNode;
}

const baseClass =
  'inline-flex items-center justify-center font-subheading-sm rounded-lg px-5 py-2.5 transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'text-purple-200 border border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 hover:border-purple-400 focus-visible:ring-purple-500',
  secondary:
    'text-gray-300 border border-gray-600 bg-hero-card hover:bg-gray-700 hover:border-gray-500 focus-visible:ring-blue-500',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    className = '',
    children,
    type = 'button',
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClass} ${variantClass[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
