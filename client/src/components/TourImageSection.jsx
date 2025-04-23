import scenicImage from './../assets/tours/tour-1-cover.jpg';
import { LuCalendarClock } from 'react-icons/lu';
import { FaLocationArrow } from 'react-icons/fa6';

export default function TourImageSection() {
  return (
    <section className='relative'>
      {/* tour image */}
      <div className='img-clip relative z-2 md:h-[380px] lg:h-[470px]'>
        <div className='bg-natours/40 absolute h-full w-full'></div>
        <img
          src={scenicImage}
          alt='scenic image'
          className='block h-full w-full object-cover'
        />
      </div>
      {/* tour title  */}
      <div className='absolute inset-0 z-4 flex flex-col items-center justify-center'>
        <p>
          <span className='natours-gradient-t px-3 py-2 text-3xl font-light text-white shadow-md lg:text-4xl'>
            The Forest Hiker
          </span>
        </p>
        <div className='flex gap-2 p-5 lg:gap-5'>
          <p className='flex items-center gap-2 text-lg text-white'>
            <span>
              <LuCalendarClock />
            </span>
            7 Days
          </p>
          <p className='flex items-center gap-2 text-lg text-white'>
            <span>
              <FaLocationArrow />
            </span>
            Miami, Usa
          </p>
        </div>
      </div>
    </section>
  );
}
