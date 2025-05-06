import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from '../context/AuthProvider';
import { useTour } from '../context/TourProvider';
import Loader from './Loader';
import toast from 'react-hot-toast';
import { useReview } from '../context/ ReviewProvider';

export default function TakeUserReview({ tourId }) {
  const [review, setReview] = useState('');
  const [ratings, setRatings] = useState(0);
  const { user } = useAuth();
  const { getCurrentTour, currentTour } = useTour();
  const { loadingWrite, writeReview } = useReview();
  const handleRatings = (rate) => {
    setRatings(rate);
  };

  function validateFields(review, ratings) {
    let value = true;
    if (!ratings && !review) {
      toast.error("You can't submit without review and ratings");
      return (value = false);
    }

    if (review.length < 7) {
      toast.error('Please write atleast two words!');
      return (value = false);
    }
    if (ratings === 0) {
      toast.error('You must select ratings');
      return (value = false);
    }
    return value;
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    const data = {
      review,
      rating: ratings,
      tour: tourId,
      user: user._id,
    };
    if (!validateFields(review, ratings)) return;
    await writeReview(data);
    await getCurrentTour(currentTour.slug);
  }
  return (
    <div className='flex min-h-[300px] max-w-md min-w-[300px] flex-col gap-3 space-y-1 rounded bg-white px-8 py-8 shadow-lg'>
      <form className='space-y-5' onSubmit={handleSubmitReview}>
        <div className='flex items-center gap-5'>
          <img
            className='text-natours size-10 rounded-full shadow'
            src={`/img/users/${user.photo}`}
          />
          <p className='font-semibold text-stone-600'>{user.name}</p>
        </div>
        <div className='w-full'>
          <textarea
            rows={4}
            draggable='false'
            value={review}
            placeholder='Write your review'
            onChange={(e) => setReview(e.target.value)}
            className='focus:ring-natours w-full resize-none rounded border border-stone-400/50 p-2 text-stone-600 outline-none focus:ring-2'
            aria-label='Write your review'
          />
        </div>
        <div className='flex w-full justify-center'>
          <Rating
            size={25}
            className='mx-auto'
            fillColor={'#55c57a'}
            onClick={handleRatings}
          />
        </div>
        <div className='my-1 flex w-full justify-center'>
          <button className='bg-natours w-full cursor-pointer rounded-full px-3 py-2 font-bold text-white'>
            {loadingWrite ? <Loader /> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
