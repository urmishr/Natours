import { useParams } from 'react-router-dom';
import BookTour from '../components/BookTour';
import TourImageSection from '../components/TourImageSection';
import TourInformation from '../components/TourInformation';
// import TourImages from '../components/TourImages';
// import TourMap from '../components/TourMap';
// import TourReviews from '../components/TourReviews';
import { useTour } from '../context/TourProvider';
import Loader from '../components/Loader';
import { lazy, Suspense, useEffect } from 'react';

const TourMap = lazy(() => import('../components/TourMap'));
const TourImages = lazy(() => import('../components/TourImages'));
const TourReviews = lazy(() => import('../components/TourReviews'));
export default function TourOverview() {
  const { slug } = useParams();
  const {
    currentTour,
    loading,
    getCurrentTour,

    myBookings,
  } = useTour();

  useEffect(() => {
    async function fetchData() {
      await getCurrentTour(slug);
    }

    fetchData();
  }, [slug]);

  return loading ? (
    <div className='flex h-[calc(100vh-10vh)] items-center justify-center'>
      <Loader className='size-12' color='green' />
    </div>
  ) : Object.keys(currentTour).length === 0 ? (
    <div className='flex h-[calc(100vh-10vh)] flex-col items-center justify-center gap-3'>
      <Loader className='size-12' color='green' />
      <p className='text-stone-600 md:text-xl'>Loading Tour . . .</p>
    </div>
  ) : (
    <>
      <TourImageSection />
      <TourInformation />
      <Suspense
        fallback={
          <Loader
            color='green'
            className='size-12'
            type='componant'
            text={`Tour Images`}
          />
        }
      >
        <TourImages />
      </Suspense>
      <Suspense
        fallback={
          <Loader
            color='green'
            className='size-12'
            type='componant'
            text={`Map and Review`}
          />
        }
      >
        <TourMap />

        <TourReviews />
      </Suspense>

      <div>
        {!myBookings.find(
          (booking) => currentTour._id === booking.tour._id,
        ) && <BookTour />}
      </div>
    </>
  );
}
