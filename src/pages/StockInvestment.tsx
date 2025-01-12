import { Header } from '@/components/Header'
import { HeroCard } from '@/components/HeroCard'
import { useNavigate } from 'react-router-dom'

export const StockInvestment = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <main className='grid md:px-12 lg:px-auto px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:mt-24 mt-[-130pxs] max-w-[1200px] mx-auto mb-16 mt-16'>
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
          desc=' Estimate expected income from dividend-paying investments.'
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
          disabled
        />
      </main>
    </div>
  )
}
