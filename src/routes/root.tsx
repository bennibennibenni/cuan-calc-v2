import { lazy, Suspense } from 'react'
import { ScrollToTop } from '@/utils/ScrollToTop'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { RouteErrorFallback } from '@/pages/RouteErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import ErrorBoundaryFallback from '@/pages/ErrorBoundaryFallback'

const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const StockInvestment = lazy(() => import('@/pages/StockInvestment').then(m => ({ default: m.StockInvestment })))
const ProfitLoss = lazy(() => import('@/pages/stock-investment/ProfitLoss').then(m => ({ default: m.ProfitLoss })))
const TpSl = lazy(() => import('@/pages/stock-investment/TpSl').then(m => ({ default: m.TpSl })))
const Devidends = lazy(() => import('@/pages/stock-investment/Devidends').then(m => ({ default: m.Devidends })))
const RiskManagement = lazy(() => import('@/pages/stock-investment/RiskManagement').then(m => ({ default: m.RiskManagement })))
const CompoundInterest = lazy(() => import('@/pages/stock-investment/CompoundInterest').then(m => ({ default: m.CompoundInterest })))
const RiskManagementPercentage = lazy(() => import('@/pages/stock-investment/RiskManagementPercentage').then(m => ({ default: m.RiskManagementPercentage })))
const AverageDown = lazy(() => import('@/pages/stock-investment/AverageDown').then(m => ({ default: m.AverageDown })))
const BrokerFee = lazy(() => import('@/pages/stock-investment/BrokerFee').then(m => ({ default: m.BrokerFee })))
const MoneyManagement = lazy(() => import('@/pages/MoneyManagement').then(m => ({ default: m.MoneyManagement })))
const Deposit = lazy(() => import('@/pages/money-management/Deposit').then(m => ({ default: m.Deposit })))
const CashbackReward = lazy(() => import('@/pages/money-management/CashbackReward').then(m => ({ default: m.CashbackReward })))
const Retirement = lazy(() => import('@/pages/money-management/Retirement'))
const EmergencyFund = lazy(() => import('@/pages/money-management/EmergencyFund').then(m => ({ default: m.EmergencyFund })))
const LoanCalculator = lazy(() => import('@/pages/money-management/LoanCalculator').then(m => ({ default: m.LoanCalculator })))
const CurrencyConverter = lazy(() => import('@/pages/CurrencyConverter').then(m => ({ default: m.CurrencyConverter })))
const Ratios = lazy(() => import('@/pages/Ratios').then(m => ({ default: m.Ratios })))
const Calculator = lazy(() => import('@/pages/Calculator'))
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

const Loading = () => (
  <div className='flex min-h-[60vh] items-center justify-center'>
    <div className='h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent' />
  </div>
)

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <div className='flex min-h-screen flex-col scroll-smooth'>
      <Navbar />
      <ScrollToTop />
      <div className='flex-1'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
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
      // Stock Investment Routes
      { path: 'stock-investment', element: <StockInvestment /> },
      { path: 'stock-investment/profit-loss', element: <ProfitLoss /> },
      { path: 'stock-investment/tp-sl', element: <TpSl /> },
      { path: 'stock-investment/devidends', element: <Devidends /> },
      { path: 'stock-investment/risk-management', element: <RiskManagement /> },
      { path: 'stock-investment/compound-interest', element: <CompoundInterest /> },
      { path: 'stock-investment/risk-management-percentage', element: <RiskManagementPercentage /> },
      { path: 'stock-investment/average-down', element: <AverageDown /> },
      { path: 'stock-investment/broker-fee', element: <BrokerFee /> },
      // Money Management Routes
      { path: 'money-management', element: <MoneyManagement /> },
      { path: 'money-management/deposit', element: <Deposit /> },
      { path: 'money-management/cashback-reward', element: <CashbackReward /> },
      { path: 'money-management/retirement', element: <Retirement /> },
      { path: 'money-management/emergency-fund', element: <EmergencyFund /> },
      { path: 'money-management/loan-calculator', element: <LoanCalculator /> },
      // General Utilities
      { path: 'currency-converter', element: <CurrencyConverter /> },
      { path: 'ratios', element: <Ratios /> },
      { path: 'calculator', element: <Calculator /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])