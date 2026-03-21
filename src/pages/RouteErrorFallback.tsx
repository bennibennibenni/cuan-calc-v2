import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import { useRouteError, useNavigate } from 'react-router-dom'

/**
 * Route-level error UI (React Router v7 errorElement).
 * useRouteError() provides the error thrown from loaders, actions, or route components.
 * Renders full shell (Navbar + content + Footer) since errorElement replaces the route element.
 *
 * @component
 * @returns {JSX.Element}
 */
export function RouteErrorFallback(): JSX.Element {
  const error = useRouteError();
  const navigate = useNavigate();
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className='pb-12 scroll-smooth'>
      <Navbar />
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center px-4'>
        <h1 className='font-heading-md text-gray-100 mb-2' role='heading' aria-level={1}>
          Something went wrong
        </h1>
        <p className='font-body-md text-gray-400 mb-6 max-w-md' role='alert' aria-live='assertive'>
          {message}
        </p>
        <div className='flex flex-wrap gap-3 justify-center'>
          <Button type='button' variant='secondary' onClick={() => navigate(-1)} aria-label='Go back to previous page'>
            Go back
          </Button>
          <Button type='button' onClick={() => navigate(0)} aria-label='Reload the page'>
            Reload
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
