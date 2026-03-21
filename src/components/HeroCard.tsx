
interface Props {
  title: string;
  desc: string;
  icon: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const cardClassName = [
  'rounded-xl bg-grey-800 bg-hero-card p-5 flex flex-col gap-4 text-left w-full',
  'shadow-xl ring-2 ring-transparent ring-offset-2 ring-offset-transparent',
  'transition-all duration-200 ease-out',
].join(' ')

const interactiveClassName = [
  'cursor-pointer hover:ring-blue-500/60 hover:ring-offset-gray-900',
  'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
].join(' ')

const disabledClassName = 'cursor-not-allowed opacity-50'

import React from 'react';

export const HeroCard = React.memo(({
  title,
  desc,
  icon,
  onClick,
  disabled = false,
}: Props) => {
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
          className='flex items-center justify-center p-4 rounded-xl w-fit bg-hero-card-icon text-2xl'
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
      </button>
    )
  }

  return (
    <div
      className={[cardClassName, disabled ? disabledClassName : ''].join(' ')}
      aria-disabled={disabled}
    >
      <div
        className='flex items-center justify-center p-4 rounded-xl w-fit bg-hero-card-icon text-2xl'
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
    </div>
  )

});

HeroCard.displayName = "HeroCard";
