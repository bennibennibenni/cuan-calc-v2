import React from 'react';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

const HeroIllustration = () => (
  <svg
    aria-hidden
    viewBox='0 0 640 520'
    className='h-auto w-full drop-shadow-[0_28px_80px_rgba(124,58,237,0.28)]'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <defs>
      <linearGradient id='hero-arrow' x1='410' y1='140' x2='558' y2='28' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FFD54A' />
        <stop offset='1' stopColor='#F1B21E' />
      </linearGradient>
      <radialGradient id='hero-glow' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(350 375) rotate(90) scale(110 170)'>
        <stop stopColor='#A855F7' stopOpacity='0.75' />
        <stop offset='1' stopColor='#A855F7' stopOpacity='0' />
      </radialGradient>
      <filter id='hero-soft' x='0' y='0' width='640' height='520' filterUnits='userSpaceOnUse'>
        <feGaussianBlur stdDeviation='10' />
      </filter>
    </defs>
    <ellipse cx='350' cy='402' rx='135' ry='34' fill='url(#hero-glow)' filter='url(#hero-soft)' />
    <path d='M396 371C453 308 503 229 540 134' stroke='url(#hero-arrow)' strokeWidth='22' strokeLinecap='round' />
    <path d='M498 92L561 73L543 134' stroke='url(#hero-arrow)' strokeWidth='22' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M190 122C246 92 302 82 357 92C420 104 474 148 513 210' stroke='#F1B21E' strokeOpacity='0.3' strokeWidth='6' strokeLinecap='round' />
    <g transform='translate(205 120) rotate(10 140 145)'>
      <rect x='38' y='18' width='250' height='332' rx='34' fill='#2B2F45' />
      <rect x='53' y='33' width='220' height='66' rx='16' fill='#202438' />
      <rect x='76' y='56' width='175' height='35' rx='9' fill='#111527' stroke='#3D4262' strokeWidth='2' />
      <text x='163' y='82' textAnchor='middle' fontFamily='Inter, system-ui, sans-serif' fontSize='42' fontWeight='700' fill='#8E72FF'>$</text>
      <g fill='#404868'>
        <circle cx='95' cy='142' r='16' />
        <circle cx='152' cy='142' r='16' />
        <circle cx='209' cy='142' r='16' />
        <circle cx='267' cy='142' r='16' />
        <circle cx='95' cy='199' r='16' />
        <circle cx='152' cy='199' r='16' />
        <circle cx='209' cy='199' r='16' />
        <circle cx='267' cy='199' r='16' fill='#8B63FF' />
        <circle cx='95' cy='256' r='16' />
        <circle cx='152' cy='256' r='16' />
        <circle cx='209' cy='256' r='16' />
        <circle cx='267' cy='256' r='16' />
      </g>
      <path d='M73 124h177' stroke='#1A1E31' strokeWidth='3' strokeLinecap='round' opacity='0.7' />
    </g>
    <g opacity='0.9'>
      <circle cx='140' cy='160' r='2.5' fill='#8E63FF' />
      <circle cx='170' cy='160' r='2.5' fill='#8E63FF' />
      <circle cx='200' cy='160' r='2.5' fill='#8E63FF' />
      <circle cx='230' cy='160' r='2.5' fill='#8E63FF' />
      <circle cx='140' cy='190' r='2.5' fill='#8E63FF' />
      <circle cx='170' cy='190' r='2.5' fill='#8E63FF' />
      <circle cx='200' cy='190' r='2.5' fill='#8E63FF' />
      <circle cx='230' cy='190' r='2.5' fill='#8E63FF' />
      <circle cx='140' cy='220' r='2.5' fill='#8E63FF' />
      <circle cx='170' cy='220' r='2.5' fill='#8E63FF' />
      <circle cx='200' cy='220' r='2.5' fill='#8E63FF' />
      <circle cx='230' cy='220' r='2.5' fill='#8E63FF' />
    </g>
    <circle cx='556' cy='104' r='3' fill='#F8D34B' />
    <circle cx='566' cy='300' r='2' fill='#8E63FF' />
    <circle cx='88' cy='78' r='2.5' fill='#8E63FF' />
  </svg>
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
