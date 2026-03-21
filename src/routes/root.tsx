import { CurrencyConverter } from '@/pages/CurrencyConverter'
import ErrorBoundaryFallback from '@/pages/ErrorBoundaryFallback'
import { Home } from '@/pages/Home'
import { RouteErrorFallback } from '@/pages/RouteErrorFallback'
import { CashbackReward } from '@/pages/money-management/CashbackReward'
import { Deposit } from '@/pages/money-management/Deposit'
import Retirement from '@/pages/money-management/Retirement';
import { MoneyManagement } from '@/pages/MoneyManagement'
import { NotFound } from '@/pages/NotFound'
import { Ratios } from '@/pages/Ratios'
import Calculator from '@/pages/Calculator'
import { Devidends } from '@/pages/stock-investment/Devidends'
import { ProfitLoss } from '@/pages/stock-investment/ProfitLoss'
import { RiskManagement } from '@/pages/stock-investment/RiskManagement'
import { RiskManagementPercentage } from '@/pages/stock-investment/RiskManagementPercentage'
import { CompoundInterest } from '@/pages/stock-investment/CompoundInterest'
import { StockInvestment } from '@/pages/StockInvestment'
import { TpSl } from '@/pages/stock-investment/TpSl'
import { ScrollToTop } from '@/utils/ScrollToTop'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ErrorBoundary } from 'react-error-boundary'
import { createBrowserRouter, Outlet } from 'react-router-dom'

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <div className='pb-12 scroll-smooth'>
      <Navbar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </div>
  </ErrorBoundary>
)

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'stock-investment', element: <StockInvestment /> },
      { path: 'stock-investment/profit-loss', element: <ProfitLoss /> },
      { path: 'stock-investment/tp-sl', element: <TpSl /> },
      { path: 'stock-investment/devidends', element: <Devidends /> },
      { path: 'stock-investment/risk-management', element: <RiskManagement /> },
      { path: 'stock-investment/compound-interest', element: <CompoundInterest /> },
      {
        path: 'stock-investment/risk-management-percentage',
        element: <RiskManagementPercentage />,
      },
      { path: 'money-management', element: <MoneyManagement /> },
      { path: 'money-management/deposit', element: <Deposit /> },
      { path: 'money-management/cashback-reward', element: <CashbackReward /> },
      { path: 'money-management/retirement', element: <Retirement /> },
      { path: 'currency-converter', element: <CurrencyConverter /> },
      { path: 'ratios', element: <Ratios /> },
      { path: 'calculator', element: <Calculator /> },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
