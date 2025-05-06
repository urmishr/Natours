import { IoIosArrowDroprightCircle } from 'react-icons/io';
import Loader from './Loader';
import { useTour } from '../context/TourProvider';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const { myBookings, loading } = useTour();
  const navigate = useNavigate();
  function handleMore(slug) {
    navigate(`/tour/${slug}`);
  }

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {loading && <Loader color='green' className='mt-5 size-12' />}
      {myBookings.length > 0 && (
        <p className='natours-gradient-text text-[16px]'>
          Your purchased Tours
        </p>
      )}
      {myBookings.length === 0 && !loading && (
        <p className='natours-gradient-text text-[16px] font-semibold'>
          No tour purchased yet.
        </p>
      )}
      <ul className='mx-auto flex w-full flex-col lg:mt-5 lg:grid lg:grid-cols-2 lg:gap-5'>
        {!loading &&
          [...myBookings].reverse().map((booking, i) => (
            <li key={i} className='md:mx-auto md:w-1/2 lg:w-full'>
              <div className='my-3 flex w-full items-center justify-between gap-4 rounded bg-white p-5 shadow-sm lg:my-2'>
                <div className='flex items-center gap-4'>
                  <div className='flex size-6 items-center justify-center rounded-full bg-stone-200'>
                    <p className='text-sm font-semibold'>{i + 1}</p>
                  </div>
                  <div className='flex size-12 items-center'>
                    <img
                      className='h-8 rounded shadow-sm'
                      src={`/img/tours/${booking.tour.imageCover}`}
                      alt={`${booking.tour.name}`}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-semibold text-stone-800'>
                      {booking.tour.name}
                    </p>
                    <p className='text-stone-800/50'>${booking.price}</p>
                  </div>
                </div>
                <div className='ml-3 flex flex-col items-center'>
                  <button
                    onClick={() => handleMore(booking.tour.slug)}
                    className='text-natours cursor-pointer rounded-full px-2 font-semibold'
                  >
                    <IoIosArrowDroprightCircle className='m-0 size-6' />
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
