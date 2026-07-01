import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';

/**
 * NotFound page displays a user-friendly message when a route does not exist.
 * Includes a link to return to the home page.
 *
 * @component
 * @returns {JSX.Element}
 */
export const NotFound = () => {
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-[200px] text-center'>
        <h1 className='font-heading-lg text-gray-100 mb-2' role='heading' aria-level={1}>
          Page not found
        </h1>
        <p className='font-body-md text-gray-400 mb-6' role='alert' aria-live='assertive'>
          You just hit a route that doesn&apos;t exist.
        </p>
        <Link
          to='/'
          className='font-subheading-sm text-blue-400 hover:text-blue-300 underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
          aria-label='Back to home page'
        >
          Back to home
        </Link>
      </div>
    </Layout>
  );
};
