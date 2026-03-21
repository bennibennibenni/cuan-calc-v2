import { Header } from '@/components/Header';
import { HeroCard } from '@/components/HeroCard';
import { useNavigate } from 'react-router-dom';

/**
 * Home page provides quick access to all main financial tools.
 * Includes navigation to stock investment, money management, currency converter, ratios, and calculator.
 *
 * @component
 * @returns {JSX.Element}
 */
export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <main
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-12 max-w-[1200px] mx-auto mt-12 lg:mt-24 mb-16'
        aria-label='Main financial tools'
      >
        <HeroCard
          title='Stock investment'
          desc='Manage your stock investments with tools for profit/loss, take profit/stop loss, dividends, risk assessment, and compound interest.'
          icon='📈'
          onClick={() => {
            navigate('/stock-investment');
          }}
        />
        <HeroCard
          title='Money management'
          desc='Optimize your financial planning by calculating returns from deposito, tracking cashback rewards, and planning for retirement savings.'
          icon='💼'
          onClick={() => {
            navigate('/money-management');
          }}
        />
        <HeroCard
          title='Currency converter'
          desc='Convert USD to IDR at the current exchange rate.'
          icon='💱'
          onClick={() => {
            navigate('/currency-converter');
          }}
        />
        <HeroCard
          title='Ratios'
          desc='Calculate financial ratios to assess business or investment performance.'
          icon='➗'
          onClick={() => {
            navigate('/ratios');
          }}
        />
        <HeroCard
          title='Calculator'
          desc='Perform quick and simple calculations for everyday financial needs.'
          icon='🧮'
             onClick={() => {
            navigate('/calculator');
          }}
        />
      </main>
    </>
  );
};
