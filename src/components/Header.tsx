import React from 'react';
import Logo from '@/images/cuan-cal.svg'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className = '', ...props }, ref) => (
    <header
      ref={ref}
      className={`grid max-w-[1100px] mx-auto mt-8 px-4 grid-cols-1 lg:grid-cols-2 gap-8 items-center text-center lg:text-start min-h-0 py-4 lg:py-0 ${className}`.trim()}
      aria-label='Hero'
      {...props}
    >
      <div className='mt-0 lg:mt-8'>
        <h1 className='hero-title text-[80px] md:text-[110px] font-heading-xl'>
          Cuan calculator
        </h1>
        <p className='font-heading-lg text-[36px] md:text-[48px] text-gray-100 max-w-[800px] mx-auto lg:mx-0 mt-6'>
          Track and Forecast Your Gains Effortlessly
        </p>
        <p className='font-body-lg text-[28px] md:text-[36px] text-gray-400 max-w-[800px] mx-auto lg:mx-0 mt-6'>
          Quickly calculate your profit or revenue.
        </p>
      </div>
      <div className='flex justify-center items-center relative'>
        {/* <div className='hero-glow absolute w-16 h-16 md:w-20 md:h-20 bg-black bg-opacity-40' aria-hidden /> */}
        <img
          src={Logo}
          alt='Cuan calculator'
          className='hero-image relative w-50 h-50 md:w-65 md:h-65 drop-shadow-lg contrast-125'
        />
      </div>
    </header>
  )
);

Header.displayName = 'Header';
