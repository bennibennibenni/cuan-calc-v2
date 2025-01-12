export const Header = () => {
  return (
    <header className='grid grid-cols-1 text-center lg:text-start lg:grid-cols-2 max-w-[1100px] flex mx-auto mt-20 px-4'>
      <div className='mt-56 lg:mt-0'>
        <div className='text-[50px] md:text-[56px] font-bold'>
          <h1 id='test'>Cuan calculator</h1>
        </div>
        <div className='text-[35px] md:text-[45px] font-[700] mb-4 max-w-[550px] mx-auto sm:px-20 text-center md:text-start md:px-0 text-gray-100'>
          <h1 className='leading-none '>
            Track and Forecast Your Gains Effortlessly
          </h1>
        </div>
        <div className='font-[500] text-[20px] md:text-[24px] text-gray-400 max-w-[550px] mx-auto'>
          <h1>Quickly calculate your profit or revenue.</h1>
        </div>
        {/* <div className="flex pt-8 justify-center flex-wrap lg:justify-start space-x-6 gap-y-4 font-[600] text-[14px] text-white">
          <button className="shadow-xl border border-gray-600 bg-button-color rounded-2xl p-2 px-4 w-fit">
            Get Started
          </button>
          <button className="shadow-xl border border-gray-600 bg-button-color-2 rounded-2xl p-2 px-4 w-fit">
            Why Vite?
          </button>
          <button className="shadow-xl border border-gray-600 bg-button-color-2 rounded-2xl p-2 px-4 w-fit">
            View On GitHub
          </button>
        </div> */}
      </div>
      <div className='flex justify-center'>
        <div
          id='test2'
          className='md:mt-10'
        ></div>
        <img
          id='test3'
          className=''
          src='https://vitejs.dev/logo-with-shadow.png'
          alt='Vite'
          data-v-d43214f0=''
        />
      </div>
    </header>
  )
}
