import { Header } from '@/components/Header'
import { HeroCard } from '@/components/HeroCard'
import { useNavigate } from 'react-router-dom'

/**
 * StockInvestment page provides tools for stock trading calculations.
 * Includes navigation to profit/loss, TP/SL, dividends, and risk management tools.
 *
 * @component
 * @returns {JSX.Element}
 */
export const StockInvestment = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <main
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-12 max-w-[1200px] mx-auto mt-12 lg:mt-24 mb-16'
        aria-label='Stock investment tools'
      >
        <HeroCard
          title='Profit and loss'
          desc='Calculate the potential profit or loss of a trade or investment.'
          icon='💰'
          onClick={() => {
            navigate('/stock-investment/profit-loss')
          }}
        />
        <HeroCard
          title='Take profit and stop loss'
          desc='Set target prices to secure profits or limit losses on trades.'
          icon='🎯'
          onClick={() => {
            navigate('/stock-investment/tp-sl')
          }}
        />
        <HeroCard
          title='Devidends'
          desc='Estimate expected income from dividend-paying investments.'
          icon='🏦'
          onClick={() => {
            navigate('/stock-investment/devidends')
          }}
        />
        <HeroCard
          title='Risk management'
          desc='Calculate position sizes and stop-loss levels to manage risk.'
          icon='🛡️'
          onClick={() => {
            navigate('/stock-investment/risk-management')
          }}
        />
        <HeroCard
          title='Risk management (%)'
          desc=' Determine the optimal risk percentage per trade.'
          icon='📊'
          onClick={() => {
            navigate('/stock-investment/risk-management-percentage')
          }}
        />
        <HeroCard
          title='Compound interest'
          desc='Project the future value of investments with compound interest.'
          icon='🔄'
          onClick={() => {
            navigate('/stock-investment/compound-interest')
          }}
        />
      </main>
    </div>
  )
}
