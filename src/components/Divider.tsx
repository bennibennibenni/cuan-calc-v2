import React from 'react';

interface DividerProps {
  readonly className?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className = '', ...props }, ref) => (
    <hr ref={ref} className={`border-t border-gray-700 ${className}`.trim()} {...props} />
  )
);

Divider.displayName = 'Divider';