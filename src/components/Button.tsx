import React from 'react';
export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly children: React.ReactNode;
}

const baseClass =
  'inline-flex items-center justify-center font-subheading-sm rounded-lg px-5 py-2.5 transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'text-white border-0 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 focus-visible:ring-purple-500 transition-all duration-300',
  secondary:
    'text-gray-200 border border-gray-600/50 bg-white/[0.03] hover:bg-white/[0.08] hover:border-gray-500/70 backdrop-blur-sm focus-visible:ring-violet-500 transition-all duration-300',
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
