import { FaPeopleGroup } from 'react-icons/fa6';

import { IoTrendingUpOutline } from 'react-icons/io5';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { FaStarHalfAlt } from 'react-icons/fa';
function TourFacts() {
  return (
    <div className='my-4 items-center justify-center space-y-6'>
      <h1 className='natours-gradient-text font-italic w-full text-center text-3xl font-bold lg:text-3xl'>
        Tour Facts
      </h1>

      <div className='flex items-center gap-2'>
        <MdOutlineCalendarMonth className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Next Date
          <span className='ml-3 font-medium text-stone-800/50'>June 2025</span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <IoTrendingUpOutline className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Difficulty
          <span className='ml-3 font-medium text-stone-800/50'>Medium</span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <FaPeopleGroup className='text-natours size-7' />

        <p className='font-semibold text-stone-600'>
          Participants
          <span className='ml-3 font-medium text-stone-800/50'>15</span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <FaStarHalfAlt className='text-natours size-7' />
        <p className='font-semibold text-stone-600'>
          Ratings
          <span className='ml-3 font-medium text-stone-800/50'>4.7 . 5</span>
        </p>
      </div>
    </div>
  );
}
export default TourFacts;
