import { useTour } from '../context/TourProvider';

import UserReview from './UserReview';
export default function TourReviews() {
  const { currentTour } = useTour();
  return (
    <section className='natours-gradient flex flex-col items-center justify-center space-y-5 overflow-hidden'>
      <div className='mt-8 flex flex-col items-center'>
        <p className='text-2xl font-semibold text-white/80'>User Reviews!</p>
        <p className='text-2xl font-semibold text-white'>
          {currentTour.ratingsAverage} / 5
        </p>
      </div>

      <div className='flex min-h-[40vh] w-full gap-10 overflow-x-auto px-10 py-5 pb-15'>
        {currentTour.reviews.length === 0 ? (
          <p className='mx-auto text-2xl font-bold text-white md:text-3xl'>
            No reviews found!
          </p>
        ) : (
          currentTour.reviews.map((review) => (
            <UserReview
              ratings={review.rating}
              key={review._id}
              userName={review.user.name}
              photo={`https://natours-production-23d3.up.railway.app/img/users/${review.user.photo}`}
              review={review.review}
            />
          ))
        )}
      </div>
    </section>
  );
}
