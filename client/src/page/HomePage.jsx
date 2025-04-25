import { NavLink } from 'react-router-dom';
import scenicImage from './../assets/tours/tour-1-cover.jpg';

export default function HomePage() {
  return (
    <section className='flex flex-col items-center justify-center space-y-7 lg:space-y-12'>
      <div className='my-5 lg:mt-10'>
        <h1 className='natours-gradient-text font-italic my-5 text-center text-3xl font-bold lg:text-4xl'>
          Discover Your next adventure
        </h1>
      </div>
      <div className='relative mx-4 mt-2 overflow-hidden rounded md:w-3/4'>
        <div className='img-clip lg:rounded'>
          <div className='bg-natours/40 absolute h-full w-full'></div>
          <img src={scenicImage} alt='scenic image' className='lg:shadow' />
        </div>
        <p className='md:bottom:12 absolute right-5 bottom-5 md:right-7 md:bottom-14 lg:right-16 lg:bottom-16 lg:text-4xl xl:right-15 xl:bottom-20 xl:text-5xl'>
          <span className='natours-gradient-t px-3 py-2 text-3xl font-light text-white shadow-md'>
            The Forest Hiker
          </span>
        </p>
      </div>
      <div className='my-4 w-3/4'>
        <p className='text-center text-xl text-stone-500 italic lg:text-2xl'>
          "Book tours with trusted guides worldwide"
        </p>
      </div>
      <NavLink
        to='/tours'
        className='btn-primary my-13 rounded-full px-4 py-3 text-xl text-white lg:px-8 lg:py-6'
      >
        Explore Tours
      </NavLink>
    </section>
  );
}
