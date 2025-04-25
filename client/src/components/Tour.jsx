import scenicImage from './../assets/tours/tour-1-cover.jpg';
import { FaLocationArrow, FaMapPin, FaPeopleGroup } from 'react-icons/fa6';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

export default function Tour() {
  return (
    <section className='my-10 flex w-full items-center justify-center'>
      {/* image section */}

      <div className='mx-6 max-w-[388px] overflow-clip rounded bg-white shadow-lg'>
        <div className='relative'>
          <div className='img-clip'>
            <div className='bg-natours/40 absolute h-full w-full'></div>
            <img src={scenicImage} alt='scenic image' className='' />
          </div>
          <h3 className='absolute right-5 bottom-6'>
            <span className='natours-gradient-t px-3 py-2 text-2xl font-light text-white shadow-md lg:text-2xl'>
              The Snow Adventurer
            </span>
          </h3>
        </div>

        {/* section info */}

        <div className='space-y-5 p-8'>
          {/* difficulty & description */}
          <div className='space-y-4'>
            <p className='font-semibold text-stone-600'>
              Medium - 10 Days Tour
            </p>
            <p className='font text-stone-800/50 italic'>
              Breathing in Nature in America's most spectacular National Parks
            </p>
          </div>
          {/* location / date stops / num-people */}
          <div className='mt-10 grid grid-cols-2 gap-7'>
            <div className='flex items-center gap-2'>
              <FaLocationArrow className='text-natours size-7' />
              <p className='text-stone-800/50'>Las Vegas, USA</p>
            </div>
            <div className='flex items-center gap-2'>
              <MdOutlineCalendarMonth className='text-natours size-7' />
              <p className='text-stone-800/50'>August, 2025</p>
            </div>
            <div className='flex items-center gap-2'>
              <FaMapPin className='text-natours size-7' />
              <p className='text-stone-800/50'>4 Stops</p>
            </div>
            <div className='flex items-center gap-2'>
              <FaPeopleGroup className='text-natours size-7' />
              <p className='text-stone-800/50'>15 People</p>
            </div>
          </div>
        </div>

        {/* Pricing and details */}

        <div className='flex w-full items-center border-t border-stone-600/30 bg-stone-400/10 p-8'>
          {/* pricings */}
          <div className='w-1/2 justify-baseline'>
            <p className='text-lg font-bold text-stone-600'>
              $1499{' '}
              <span className='ml-1 text-sm font-medium text-stone-800/50'>
                Per person
              </span>
            </p>
            <p className='text-lg font-bold text-stone-600'>
              4.7
              <span className='ml-1 text-sm font-medium text-stone-800/50'>
                Ratings
              </span>
            </p>
          </div>
          <div className='flex w-1/2 items-center justify-center'>
            <NavLink to='/tour/test' className='btn-primary px-8 py-3'>
              Details
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
