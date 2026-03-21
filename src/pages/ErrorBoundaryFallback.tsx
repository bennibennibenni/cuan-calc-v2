import { Layout } from '@/components/Layout'

import { Button } from '@/components/Button'
import type { FallbackProps } from 'react-error-boundary'

const ErrorBoundaryFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-[200px] text-center'>
        <h1 className='font-heading-md text-gray-100 mb-2'>
          Something went wrong
        </h1>
        <p className='font-body-md text-gray-400 mb-6 max-w-md' role='alert'>
          {message}
        </p>
        {resetErrorBoundary && (
          <Button type='button' onClick={resetErrorBoundary}>
            Try again
          </Button>
        )}
      </div>
    </Layout>
  )
}

export default ErrorBoundaryFallback
