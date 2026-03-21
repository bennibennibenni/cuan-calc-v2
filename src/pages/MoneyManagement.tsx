import { Header } from '@/components/Header';
import { HeroCard } from '@/components/HeroCard';
import { useNavigate } from 'react-router-dom';

/**
 * MoneyManagement page provides tools for managing personal finances.
 * Includes navigation to deposit, cashback, and retirement calculators.
 *
 * @component
 * @returns {JSX.Element}
 */
export const MoneyManagement = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <main
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-12 max-w-[1200px] mx-auto mt-12 lg:mt-24 mb-16'
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
