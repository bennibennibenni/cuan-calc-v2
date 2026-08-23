import { HeroCard } from '@/components/HeroCard';
import { useNavigate } from 'react-router-dom';

/**
 * MoneyManagement page provides tools for managing personal finances.
 * Includes navigation to deposit, cashback, and retirement calculators.
 *
 * @component
 * @returns {JSX.Element}
 */
export const MoneyManagement = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='mx-auto max-w-[1200px] px-6 md:px-12'>
        <header className='mt-12 mb-8 flex items-start justify-between gap-3 sm:gap-4 lg:mt-24'>
          <div className='min-w-0'>
            <h1 className='font-heading-lg text-gray-100'>Money Management</h1>
            <p className='mt-2 text-sm text-gray-400 md:text-base'>Choose a calculation feature to manage your finances</p>
          </div>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-gray-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer sm:h-12 sm:w-12'
            aria-label='Back to home'
          >
            <svg aria-hidden viewBox='0 0 24 24' className='h-5 w-5 sm:h-6 sm:w-6' fill='none' stroke='currentColor' strokeWidth={1.9} strokeLinecap='round' strokeLinejoin='round'>
              <path d='M19 12H5' />
              <path d='M12 19l-7-7 7-7' />
            </svg>
          </button>
        </header>
      </div>
      <main
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-12 max-w-[1200px] mx-auto mb-16'
        aria-label='Money management tools'
      >
        <HeroCard
          title='Deposit'
          desc='Calculate returns on fixed deposits based on interest rates and tenure.'
          icon='🏦'
          onClick={() => {
            navigate('/money-management/deposit');
          }}
        />
        <HeroCard
          title='Cashback reward'
          desc='Track and estimate cashback rewards from purchases and spending.'
          icon='🎁'
          onClick={() => {
            navigate('/money-management/cashback-reward');
          }}
        />
        <HeroCard
          title='Retirement'
          desc='Plan and calculate savings for retirement, including growth projections.'
          icon='🛠️'
          onClick={() => {
            navigate('/money-management/retirement');
          }}
        />
      </main>
    </div>
  );
};
