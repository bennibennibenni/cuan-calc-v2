import { CurrencyConverter } from '@/pages/CurrencyConverter'
import ErrorBoundaryFallback from '@/pages/ErrorBoundaryFallback'
import { Home } from '@/pages/Home'
import { CashbackReward } from '@/pages/money-management/CashbackReward'
import { Deposit } from '@/pages/money-management/Deposit'
import { MoneyManagement } from '@/pages/MoneyManagement'
import { NotFound } from '@/pages/NotFound'
import { Ratios } from '@/pages/Ratios'
import { Devidends } from '@/pages/stock-investment/Devidends'
import { ProfitLoss } from '@/pages/stock-investment/ProfitLoss'
import { RiskManagement } from '@/pages/stock-investment/RiskManagement'
import { RiskManagementPercentage } from '@/pages/stock-investment/RiskManagementPercentage'
import { TpSl } from '@/pages/stock-investment/TpSl'
import { StockInvestment } from '@/pages/StockInvestment'
import { ScrollToTop } from '@/utils/ScrollToTop'

import { ErrorBoundary } from 'react-error-boundary'
import { createBrowserRouter, Outlet } from 'react-router-dom'

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <ScrollToTop />
    <Outlet />
  </ErrorBoundary>
)

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'stock-investment', element: <StockInvestment /> },
      { path: 'stock-investment/profit-loss', element: <ProfitLoss /> },
      { path: 'stock-investment/tp-sl', element: <TpSl /> },
      { path: 'stock-investment/devidends', element: <Devidends /> },
      { path: 'stock-investment/risk-management', element: <RiskManagement /> },
      {
        path: 'stock-investment/risk-management-percentage',
        element: <RiskManagementPercentage />,
      },
      { path: 'money-management', element: <MoneyManagement /> },
      { path: 'money-management/deposit', element: <Deposit /> },
      { path: 'money-management/cashback-reward', element: <CashbackReward /> },
      { path: 'currency-converter', element: <CurrencyConverter /> },
      { path: 'ratios', element: <Ratios /> },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
