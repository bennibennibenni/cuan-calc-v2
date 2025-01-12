import { Layout } from '@/components/Layout'

export const NotFound = () => {
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center h-32 text-center text-gray-500'>
        <h1 className='text-4xl font-bold mb-4'>Page not found</h1>
        <label className='text-white px-4 py-2 '>
          You just hit a route that doesn't exist... the sadness.
        </label>
      </div>
    </Layout>
  )
}
