import React from 'react';
import heroImage from '@/images/hero.png';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  readonly className?: string;
}

const HeroIllustration = () => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // If the image is already cached and loaded by the browser, set loaded immediately
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className='relative w-full aspect-[3/2] flex items-center justify-center'>
      {/* Borderless Image Skeleton Loading Placeholder */}
      {isLoaded && (
        <div
          className='absolute inset-0 w-full h-full rounded-3xl bg-white/[0.03] backdrop-blur-md overflow-hidden animate-pulse'
          aria-label='Loading hero image'
          role='status'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent animate-shimmer' />
        </div>
      )}

      {/* Hero Image */}
      <img
        ref={imgRef}
        src={heroImage}
        alt='Cuan calculator hero illustration'
        width={1536}
        height={1024}
        loading='eager'
        fetchPriority='high'
        decoding='async'
        onLoad={() => setIsLoaded(true)}
        className={`h-auto w-full max-w-[680px] drop-shadow-[0_30px_80px_rgba(124,58,237,0.35)] transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};


export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className = '', ...props }, ref) => (
    <header
      ref={ref}
      className={`relative grid max-w-[1180px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-16 lg:px-8 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 lg:gap-16 items-center text-start ${className}`.trim()}
      aria-label='Hero'
      {...props}
    >
      <div className='mx-auto lg:mx-0 max-w-2xl'>
        <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-violet-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:px-4 sm:py-2'>
          <span aria-hidden className='leading-none'>✦</span>{' '}
          Smart tools for smarter money
        </div>
        <h1 className='hero-title mt-4 sm:mt-6 text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-heading-xl leading-[0.95]'>
          Cuan <span className='text-white'>calculator</span>
        </h1>
        <p className='mt-3 sm:mt-5 max-w-xl font-heading-md sm:font-heading-lg text-xl sm:text-2xl md:text-4xl text-gray-100'>
          Track and Forecast Your Gains Effortlessly
        </p>
        <p className='mt-3 sm:mt-5 max-w-xl text-sm sm:text-base md:text-xl leading-6 sm:leading-8 text-gray-400'>
          Powerful and simple tools to help you make better financial decisions, every step of the way.
        </p>
      </div>
      <div className='relative flex items-center justify-center lg:justify-end lg:translate-y-3'>
        <div className='relative w-full max-w-[18rem] sm:max-w-[24rem] lg:max-w-[31rem] xl:max-w-[33rem]'>
          <div className='absolute inset-x-[18%] bottom-[11%] h-20 rounded-full bg-violet-600/30 blur-3xl' aria-hidden />
          <div className='absolute right-[4%] top-[7%] h-24 w-24 rounded-full bg-amber-300/20 blur-3xl' aria-hidden />
          <HeroIllustration />
        </div>
      </div>
    </header>
  )
);

Header.displayName = 'Header';
