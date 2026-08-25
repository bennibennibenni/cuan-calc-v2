import { Header } from '@/components/Header';
import { HeroCard } from '@/components/HeroCard';

/**
 * Home page provides quick access to all main financial tools.
 * Includes navigation to stock investment, money management, currency converter, ratios, and calculator.
 *
 * @component
 */
export const Home = () => {
  return (
    <main className='relative overflow-hidden min-h-screen'>
      <Header />

      <section id='tools' className='mx-auto mt-10 sm:mt-16 max-w-[1180px] px-4 sm:px-6 pb-16 sm:pb-20 lg:mt-20 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
          <HeroCard
            title='Stock investment'
            desc='Manage your stock investments with tools for profit/loss, take profit/stop loss, dividends, risk assessment, and compound interest.'
            icon='📈'
            accentClassName='text-violet-300'
            to='/stock-investment'
          />
          <HeroCard
            title='Money management'
            desc='Optimize your financial planning by calculating returns from deposits, tracking cashback rewards, and planning for retirement savings.'
            icon='💼'
            accentClassName='text-fuchsia-300'
            to='/money-management'
          />
          <HeroCard
            title='Currency converter'
            desc='Convert USD to IDR at the current exchange rate.'
            icon='💱'
            accentClassName='text-cyan-300'
            to='/currency-converter'
          />
          <HeroCard
            title='Ratios'
            desc='Calculate financial ratios to assess business or investment performance.'
            icon='➗'
            accentClassName='text-violet-300'
            to='/ratios'
          />
          <HeroCard
            title='Calculator'
            desc='Perform quick and simple calculations for everyday financial needs.'
            icon='🧮'
            accentClassName='text-amber-300'
            to='/calculator'
          />
        </div>
      </section>
    </main>
  );
};