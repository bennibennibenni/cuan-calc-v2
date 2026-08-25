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
      <main ref={ref} className={`px-4 sm:px-6 md:px-8 lg:px-12 lg:mt-28 mt-8 sm:mt-10 max-w-[1200px] mx-auto mb-16 sm:mb-20 ${className}`.trim()} {...props}>
        <div className='relative rounded-2xl border border-white/10 bg-grey-800 bg-hero-card p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-violet-500/30 hover:shadow-[0_20px_70px_-15px_rgba(139,92,246,0.4)] sm:p-6 md:p-8'>
          {(title ?? icon ?? backNavigation) !== undefined && (
            <header className='grid grid-cols-3 items-center gap-4'>
              <div className='flex justify-start'>
                {icon ? (
                  <span
                    className='flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-hero-card-icon text-xl sm:text-2xl'
                    aria-hidden
                  >
                    {icon}
                  </span>
                ) : (
                  <span className='h-10 w-10 sm:h-12 sm:w-12' aria-hidden />
                )}
              </div>
              <div className='flex items-center justify-center'>
                {title ? (
                  <h1 className='font-heading-md text-gray-100 text-center text-xs sm:text-base md:text-lg lg:text-xl'>
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
                    className='flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-hero-card-icon text-gray-400 outline-hidden transition hover:text-gray-200 hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800'
                    aria-label='Go back'
                  >
                    <svg
                      aria-hidden
                      viewBox='0 0 24 24'
                      className='h-5 w-5 sm:h-6 sm:w-6'
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
                <span className='h-10 w-10 sm:h-12 sm:w-12' />
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
