import React from 'react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className = '', ...props }, ref) => {
    const year = new Date().getFullYear();
    return (
      <footer ref={ref} className={`w-full border-t border-white/5 py-10 backdrop-blur-sm bg-white/[0.02] ${className}`.trim()} role='contentinfo' {...props}>
        <div className='max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 text-center'>
          <p className='font-body-sm text-gray-500'>
            © {year} Benni. All rights reserved
          </p>
          <p className='mt-1 font-body-sm text-gray-500'>
            Crafted with ❤️ using Vite
          </p>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
