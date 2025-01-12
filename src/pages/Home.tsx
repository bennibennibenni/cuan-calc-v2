import { Header } from '@/components/Header'
import { HeroCard } from '@/components/HeroCard'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <main className='grid md:px-12 lg:px-auto px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:mt-24 mt-[-130pxs] max-w-[1200px] mx-auto mb-16 mt-16'>
        <HeroCard
          title='Stock investment'
          desc='Manage your stock investments with tools for profit/loss, take profit/stop loss, dividends, risk assessment, and compound interest.'
          icon='📈'
          onClick={() => {
            navigate('/stock-investment')
          }}
        />
        <HeroCard
          title='Money management'
          desc='Optimize your financial planning by calculating returns from deposito, tracking cashback rewards, and planning for retirement savings.'
          icon='💼'
          onClick={() => {
            navigate('/money-management')
          }}
        />
        <HeroCard
          title='Currency converter'
          desc='Convert USD to IDR at the current exchange rate.'
          icon='💱'
          onClick={() => {
            navigate('/currency-converter')
          }}
        />
        <HeroCard
          title='Ratios'
          desc='Calculate financial ratios to assess business or investment performance.'
          icon='➗'
          onClick={() => {
            navigate('/ratios')
          }}
        />
        <HeroCard
          title='Calculator'
          desc='Perform quick and simple calculations for everyday financial needs.'
          icon='🧮'
          disabled
        />
      </main>
    </>
  )
}
