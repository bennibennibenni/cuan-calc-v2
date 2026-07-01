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
export const StockInvestment = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <div className='mx-auto max-w-[1200px] px-6 md:px-12'>
        <header className='mt-12 mb-8 flex items-start justify-between gap-3 sm:gap-4 lg:mt-24'>
          <div className='min-w-0'>
            <h1 className='font-heading-lg text-gray-100'>Stock Investment</h1>
            <p className='mt-2 text-sm text-gray-400 md:text-base'>Choose a calculation feature to manage your stock investments</p>
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
