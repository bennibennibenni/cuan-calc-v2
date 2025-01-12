import { Layout } from '@/components/Layout'

interface FallbackProps {
  error: {
    message: string
  }
  // resetErrorBoundary: () => void
}

const ErrorBoundaryFallback = ({
  error,
  // resetErrorBoundary,
}: FallbackProps) => {
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center h-32 text-center text-gray-500 '>
        <h1 className='text-4xl font-bold m-4'>Something went wrong!</h1>
        <label className='text-white px-4 py-2 '>{error.message}</label>
        {/* <button
          onClick={resetErrorBoundary}
          type='button'
          className='text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900'
        >
          Refresh
        </button> */}
      </div>
    </Layout>
  )
}

export default ErrorBoundaryFallback
