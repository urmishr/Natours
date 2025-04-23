import { NavLink } from 'react-router-dom';
import scenicImage from './../assets/tours/tour-1-cover.jpg';

export default function HomePage() {
  return (
    <section className='flex flex-col items-center justify-center space-y-7 lg:space-y-12'>
      <div className='mt-5 lg:mt-10'>
        <h1 className='natours-gradient-text font-italic p-3 text-center text-4xl font-bold lg:text-5xl'>
          Discover Your next adventure
        </h1>
      </div>
      <div className='relative mx-4 mt-2 lg:w-3/4'>
        <div className='img-clip lg:rounded'>
          <div className='bg-natours/40 absolute h-full w-full'></div>
          <img src={scenicImage} alt='scenic image' className='lg:shadow' />
        </div>
        <p className='lg: md:bottom:12 absolute right-5 bottom-5 md:right-7 md:bottom-14 lg:right-16 lg:bottom-16 lg:text-4xl xl:right-15 xl:bottom-27 xl:text-5xl'>
          <span className='natours-gradient-t px-3 py-2 text-3xl font-light text-white shadow-md'>
            The Forest Hiker
          </span>
        </p>
      </div>
      <div className='w-3/4'>
        <p className='text-center text-xl text-stone-500 italic'>
          "Book tours with trusted guides worldwide"
        </p>
      </div>
      <NavLink
        to='/tours'
        className='btn-primary my-8 rounded-full px-4 py-3 text-xl text-white lg:px-8 lg:py-6'
      >
        Explore Tours
      </NavLink>
    </section>
  );
}
