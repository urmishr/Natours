import { FaLocationArrow, FaMapPin, FaPeopleGroup } from 'react-icons/fa6';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Tour({ tour }) {
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <section className='m-7 flex items-center justify-center'>
      {/* image section */}

      <div className='max-w-[388px] overflow-clip rounded bg-white shadow-lg'>
        <div className='relative'>
          <div className='img-clip'>
            <div className='bg-natours/30 absolute h-full w-full'></div>
            <img
              src={`https://natours-aos3.onrender.com/img/tours/${tour.imageCover}`}
              // src={scenicImage}
              alt='scenic image'
              className='min-h-[250px] min-w-[350px]'
            />
          </div>
          <h3 className='absolute right-5 bottom-6'>
            <span className='natours-gradient-t px-3 py-2 text-2xl font-light text-white shadow-md lg:text-2xl'>
              {tour.name}
            </span>
          </h3>
        </div>

        {/* section info */}

        <div className='space-y-5 p-8'>
          {/* difficulty & description */}
          <div className='space-y-4'>
            <p className='font-semibold text-stone-600'>
              {capitalize(tour.difficulty)} - {tour.duration} Days Tour
            </p>
            <p className='font text-stone-800/50 italic'>{tour.summary}</p>
          </div>
          {/* location / date stops / num-people */}
          <div className='mt-10 grid grid-cols-2 gap-7'>
            <div className='flex items-center gap-2'>
              <FaLocationArrow className='text-natours size-7' />
              <p className='text-stone-800/50'>
                {tour.startLocation.description}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <MdOutlineCalendarMonth className='text-natours size-7' />
              <p className='text-stone-800/50'>
                {new Date(tour.startDates[0]).toLocaleString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <FaMapPin className='text-natours size-7' />
              <p className='text-stone-800/50'>{tour.locations.length} Stops</p>
            </div>
            <div className='flex items-center gap-2'>
              <FaPeopleGroup className='text-natours size-7' />
              <p className='text-stone-800/50'>{tour.maxGroupSize} People</p>
            </div>
          </div>
        </div>

        {/* Pricing and details */}

        <div className='flex w-full items-center border-t border-stone-600/30 bg-stone-400/10 p-8'>
          {/* pricings */}
          <div className='w-1/2 justify-baseline'>
            <p className='text-lg font-bold text-stone-600'>
              ${tour.price}
              <span className='ml-1 text-sm font-medium text-stone-800/50'>
                Per person
              </span>
            </p>
            <p className='text-lg font-bold text-stone-600'>
              {tour.ratingsAverage}
              <span className='ml-1 text-sm font-medium text-stone-800/50'>
                Ratings
              </span>
            </p>
          </div>
          <div className='flex w-1/2 items-center justify-center'>
            <NavLink
              to={`/tour/${tour.slug}`}
              className='btn-primary px-8 py-3 shadow-md'
              state={{ tour }}
            >
              Details
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
