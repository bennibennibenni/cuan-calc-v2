import React from 'react';
import heroImage from '@/images/hero.png';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

const HeroIllustration = () => (
  <img
    src={heroImage}
    alt='Cuan calculator hero illustration'
    className='h-auto w-full max-w-[680px] drop-shadow-[0_30px_80px_rgba(124,58,237,0.35)]'
  />
)

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className = '', ...props }, ref) => (
    <header
      ref={ref}
      className={`relative grid max-w-[1180px] mx-auto px-6 pt-12 lg:pt-16 lg:px-8 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center text-center lg:text-start ${className}`.trim()}
      aria-label='Hero'
      {...props}
    >
      <div className='mx-auto lg:mx-0 max-w-2xl'>
        <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold tracking-wide text-violet-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'>
          <span aria-hidden className='leading-none'>✦</span>{' '}
          Smart tools for smarter money
        </div>
        <h1 className='hero-title mt-6 text-5xl md:text-7xl lg:text-[5rem] font-heading-xl leading-[0.95]'>
          Cuan <span className='text-white'>calculator</span>
        </h1>
        <p className='mt-5 max-w-xl font-heading-lg text-2xl md:text-4xl text-gray-100'>
          Track and Forecast Your Gains Effortlessly
        </p>
        <p className='mt-5 max-w-xl text-base md:text-xl leading-8 text-gray-400'>
          Powerful and simple tools to help you make better financial decisions, every step of the way.
        </p>
        <div className='mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
          <a
            href='#tools'
            className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-[0_18px_40px_-20px_rgba(124,58,237,0.95)] transition hover:from-violet-500 hover:to-purple-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
          >
            Get Started{' '}
            <span aria-hidden>→</span>
          </a>
          <span className='text-sm text-gray-400'>No sign up required</span>
        </div>
      </div>
      <div className='relative flex items-center justify-center lg:justify-end lg:translate-y-3'>
        <div className='relative w-[20rem] sm:w-[24rem] lg:w-[31rem] xl:w-[33rem]'>
          <div className='absolute inset-x-[18%] bottom-[11%] h-20 rounded-full bg-violet-600/30 blur-3xl' aria-hidden />
          <div className='absolute right-[4%] top-[7%] h-24 w-24 rounded-full bg-amber-300/20 blur-3xl' aria-hidden />
          <HeroIllustration />
        </div>
      </div>
    </header>
  )
);

Header.displayName = 'Header';
