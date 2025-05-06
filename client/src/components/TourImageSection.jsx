import { LuCalendarClock } from 'react-icons/lu';
import { FaLocationArrow } from 'react-icons/fa6';
import { useTour } from '../context/TourProvider';

export default function TourImageSection() {
  const { currentTour } = useTour();
  return (
    <section className='relative'>
      {/* tour image */}
      <div className='relative z-2 md:h-[380px] lg:h-[470px]'>
        <div className='bg-natours/40 absolute h-full w-full'></div>
        <img
          src={`/img/tours/${currentTour.imageCover}`}
          alt='scenic image'
          className='block h-full w-full object-cover'
        />
      </div>
      {/* tour title  */}
      <div className='absolute inset-0 z-4 flex flex-col items-center justify-center'>
        <div className='natours-gradient-t px-3 py-2 shadow-md'>
          <span className='text-3xl font-light text-white lg:text-4xl'>
            {currentTour.name}
          </span>
        </div>
        <div className='flex gap-2 p-5 lg:gap-5'>
          <p className='flex items-center gap-2 text-lg text-white'>
            <span>
              <LuCalendarClock />
            </span>
            {currentTour.duration} Days
          </p>
          <p className='flex items-center gap-2 text-lg text-white'>
            <span>
              <FaLocationArrow />
            </span>
            {currentTour.startLocation.description}
          </p>
        </div>
      </div>
    </section>
  );
}
