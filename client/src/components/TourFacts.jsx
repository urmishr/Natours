import { FaPeopleGroup } from 'react-icons/fa6';

import { IoTrendingUpOutline } from 'react-icons/io5';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { FaStarHalfAlt } from 'react-icons/fa';
import { useTour } from '../context/TourProvider';
function TourFacts() {
  const { currentTour } = useTour();
  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <div className='my-4 items-center justify-center space-y-6'>
      <h1 className='natours-gradient-text font-italic w-full text-center text-3xl font-bold lg:text-3xl'>
        Tour Facts
      </h1>

      <div className='flex items-center gap-2'>
        <MdOutlineCalendarMonth className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Next Date
          <span className='ml-3 font-medium text-stone-800/50'>
            {new Date(currentTour.startDates[0]).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <IoTrendingUpOutline className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Difficulty
          <span className='ml-3 font-medium text-stone-800/50'>
            {capitalize(currentTour.difficulty)}
          </span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <FaPeopleGroup className='text-natours size-7' />

        <p className='font-semibold text-stone-600'>
          Participants
          <span className='ml-3 font-medium text-stone-800/50'>
            {currentTour.maxGroupSize}
          </span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <FaStarHalfAlt className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Ratings
          <span className='ml-3 font-medium text-stone-800/50'>
            {currentTour.ratingsAverage} / 5
          </span>
        </p>
      </div>
    </div>
  );
}
export default TourFacts;
