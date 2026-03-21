import React from 'react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className = '', ...props }, ref) => {
    const year = new Date().getFullYear();
    return (
      <footer ref={ref} className={`border-t border-gray-700/50 py-8 ${className}`.trim()} role='contentinfo' {...props}>
        <div className='max-w-[1200px] mx-auto px-6 text-center'>
          <p className='font-body-sm text-gray-500'>
            © {year} Benni. All rights reserved
          </p>
          <p className='mt-1 font-body-sm text-gray-500'>
            Crafted with care using Vite
          </p>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
