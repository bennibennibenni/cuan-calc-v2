import React from 'react';
import { useNavigate } from 'react-router-dom'

export interface LayoutProps {
  readonly children?: React.ReactNode;
  readonly backNavigation?: string;
  readonly icon?: string;
  readonly title?: string;
  readonly className?: string;
}

const Layout = React.forwardRef<HTMLElement, LayoutProps>(
  ({
    children,
    title,
    backNavigation,
    icon,
    className = '',
    ...props
  }, ref) => {
    const navigate = useNavigate();
    return (
      <main ref={ref} className={`px-6 md:px-8 lg:px-12 lg:mt-28 mt-10 max-w-[1200px] mx-auto mb-20 ${className}`.trim()} {...props}>
        <div className='rounded-2xl bg-grey-800 bg-hero-card p-6 md:p-8 shadow-xl ring-2 ring-transparent'>
          {(title ?? icon ?? backNavigation) !== undefined && (
            <header className='grid grid-cols-3 items-center gap-4'>
              <div className='flex justify-start'>
                {icon ? (
                  <span
                    className='flex items-center justify-center h-12 w-12 rounded-xl bg-hero-card-icon text-2xl'
                    aria-hidden
                  >
                    {icon}
                  </span>
                ) : (
                  <span className='h-12 w-12' aria-hidden />
                )}
              </div>
              <div className='flex items-center justify-center'>
                {title ? (
                  <h1 className='font-heading-md text-gray-100 text-center text-sm md:text-lg lg:text-xl'>
                    {title}
                  </h1>
                ) : (
                  <span aria-hidden />
                )}
              </div>
              <div className='flex justify-end'>
                {backNavigation ? (
                  <button
                    type='button'
                    onClick={() => navigate(backNavigation)}
                    className='flex items-center justify-center h-12 w-12 rounded-xl bg-hero-card-icon text-gray-400 outline-hidden transition hover:text-gray-200 hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800'
                    aria-label='Go back'
                  >
                    <svg
                      aria-hidden
                      viewBox='0 0 24 24'
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      xmlns='http://www.w3.org/2000/svg'
                    >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              ) : (
                <span className='h-12 w-12' />
              )}
            </div>
          </header>
        )}
        {children}
      </div>
    </main>
  );
});

Layout.displayName = 'Layout';

export { Layout };
