import { useReview } from '../context/ ReviewProvider';

import Loader from './Loader';
import MyReviewTemplate from './MyReviewTemplate';

export default function MyReviews() {
  const { myReviews, loading } = useReview();

  if (loading) return <Loader color='green' />;
  return (
    <section className='w-full'>
      <div className='flex justify-center'>
        {myReviews.length > 0 && (
          <p className='natours-gradient-text text-[16px]'>Your reviews</p>
        )}
        {myReviews.length === 0 && !loading && (
          <p className='natours-gradient-text text-center text-[16px] font-semibold'>
            No review available.
            <br />
            <br />
            You can add your review in tour detail page.
          </p>
        )}
      </div>
      {[...myReviews].reverse().map((review, i) => (
        <MyReviewTemplate key={i} myReview={review} i={i} />
      ))}
    </section>
  );
}
