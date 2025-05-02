import { useEffect, useState } from 'react';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import axios from 'axios';
import Loader from './Loader';

export default function MyBookings() {
  // const { user } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function getMyTours() {
      try {
        setLoading(true);
        const res = await axios('/api/v1/bookings', { withCredential: true });
        setMyBookings(res.data.data.docs);
        console.log(res.data.data.docs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getMyTours();
  }, []);
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {loading && <Loader color='green' className='mt-5 size-12' />}
      {myBookings.length > 0 && (
        <p className='natours-gradient-text text-sm'>Your purchased Tours</p>
      )}
      {myBookings.length === 0 && (
        <p className='natours-gradient-text text-sm font-semibold'>
          No tour purchased yet!
        </p>
      )}
      <ul className='mx-auto flex w-full flex-col'>
        {!loading &&
          [...myBookings].reverse().map((booking, i) => (
            <li key={i} className='md:mx-auto md:w-1/2'>
              <div className='my-3 flex w-full items-center justify-between gap-4 rounded bg-white p-5 shadow-sm'>
                <div className='flex items-center gap-4'>
                  <div className='flex size-6 items-center justify-center rounded-full bg-stone-200'>
                    <p className='text-sm font-semibold'>{i + 1}</p>
                  </div>
                  <div className='flex size-12 items-center'>
                    <img
                      className='rounded object-cover shadow-sm'
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
                <div className='ml-3 flex items-center'>
                  <button className='text-natours cursor-pointer rounded-full px-2 font-semibold'>
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
