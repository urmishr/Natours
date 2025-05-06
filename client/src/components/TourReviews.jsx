import { useTour } from '../context/TourProvider';
import { MdRateReview } from 'react-icons/md';
import { FaRegThumbsDown } from 'react-icons/fa6';
import UserReview from './UserReview';
import TakeUserReview from './TakeUserReview';
import { useAuth } from '../context/AuthProvider';
export default function TourReviews() {
  const { currentTour, myBookings } = useTour();
  const { user } = useAuth();

  const purchased = myBookings.find(
    (booking) => booking.tour.id === currentTour.id,
  );

  const canReview =
    user &&
    (currentTour.reviews.length === 0 ||
      !currentTour.reviews.some((review) => review.user._id === user.id)) &&
    user.role === 'user';

  return (
    <section className='natours-gradient flex flex-col items-center justify-center space-y-5 overflow-hidden'>
      <div className='mt-8 flex flex-col items-center'>
        <p className='flex items-center gap-2 text-2xl font-semibold text-white/80'>
          <span>
            <MdRateReview className='mt-1 p-0' />
          </span>
          User Reviews
        </p>
        {currentTour.reviews.length !== 0 && (
          <p className='text-2xl font-semibold text-white'>
            {currentTour.ratingsAverage} / 5
          </p>
        )}
      </div>

      <div className='flex min-h-[40vh] w-full items-center justify-evenly gap-10 overflow-x-auto px-10 py-5 pb-15'>
        {purchased && canReview && <TakeUserReview tourId={currentTour.id} />}
        {currentTour.reviews.length === 0 ? (
          <p className='flex flex-col items-center text-2xl font-bold whitespace-nowrap text-white/80 md:text-3xl'>
            <span>
              <FaRegThumbsDown className='size-12' />
            </span>
            No reviews found!
          </p>
        ) : (
          [...currentTour.reviews]
            .reverse()
            .map((review) => (
              <UserReview
                ratings={review.rating}
                key={review._id}
                userName={review.user.name}
                photo={`/img/users/${review.user.photo}`}
                review={review.review}
              />
            ))
        )}
      </div>
    </section>
  );
}
