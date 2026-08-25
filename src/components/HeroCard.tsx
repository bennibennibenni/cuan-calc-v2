import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  desc: string;
  icon: string | React.ReactNode;
  accentClassName?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  to?: string;
  disabled?: boolean;
}

const cardClassName = [
  'group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 sm:p-6 md:p-7 flex flex-col gap-3.5 sm:gap-4 text-left w-full min-h-[200px] sm:min-h-[240px]',
  'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-transparent ring-offset-2 ring-offset-transparent',
  'transition-all duration-300 ease-out backdrop-blur-md',
].join(' ')

const interactiveClassName = [
  'cursor-pointer text-inherit hover:text-inherit hover:-translate-y-2 hover:border-violet-500/30 hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.04] hover:ring-violet-500/50 hover:ring-offset-gray-950 hover:shadow-[0_20px_70px_-15px_rgba(139,92,246,0.4)]',
  'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
].join(' ')

const disabledClassName = 'cursor-not-allowed opacity-50'

export const HeroCard = React.memo(({
  title,
  desc,
  icon,
  accentClassName = 'text-violet-300',
  onClick,
  to,
  disabled = false,
}: Props) => {
  if (to) {
    return (
      <Link
        to={disabled ? '#' : to}
        className={[
          cardClassName,
          'no-underline',
          disabled ? disabledClassName : interactiveClassName,
        ].join(' ')}
        aria-disabled={disabled}
      >
        <span
          className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl sm:text-2xl'
          aria-label={typeof icon === 'string' ? icon : undefined}
          aria-hidden={typeof icon !== 'string'}
        >
          {icon}
        </span>
        <span className='font-heading-sm text-gray-100 leading-tight'>
          {title}
        </span>
        <span className='font-body-sm text-gray-400 leading-relaxed'>
          {desc}
        </span>
        <span className={`mt-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] transition group-hover:border-white/15 ${accentClassName}`} aria-hidden>
          →
        </span>
      </Link>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          cardClassName,
          disabled ? disabledClassName : interactiveClassName,
        ].join(' ')}
      >
        <span
          className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl sm:text-2xl'
          aria-label={typeof icon === 'string' ? icon : undefined}
          aria-hidden={typeof icon !== 'string'}
        >
          {icon}
        </span>
        <span className='font-heading-sm text-gray-100 leading-tight'>
          {title}
        </span>
        <span className='font-body-sm text-gray-400 leading-relaxed'>
          {desc}
        </span>
        <span className={`mt-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] transition group-hover:border-white/15 ${accentClassName}`} aria-hidden>
          →
        </span>
      </button>
    )
  }

  return (
    <div
      className={[cardClassName, disabled ? disabledClassName : ''].join(' ')}
      aria-disabled={disabled}
    >
      <div
        className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl sm:text-2xl'
        aria-hidden
      >
        {icon}
      </div>
      <h3 className='font-heading-sm text-gray-100 leading-tight'>
        {title}
      </h3>
      <p className='font-body-sm text-gray-400 leading-relaxed'>
        {desc}
      </p>
      <span className={`mt-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] ${accentClassName}`} aria-hidden>
        →
      </span>
    </div>
  )

});

HeroCard.displayName = "HeroCard";
