import { useParams } from 'react-router-dom';
import BookTour from '../components/BookTour';
import TourImages from '../components/TourImages';
import TourImageSection from '../components/TourImageSection';
import TourInformation from '../components/TourInformation';
import TourMap from '../components/TourMap';
import TourReviews from '../components/TourReviews';
import { useTour } from '../context/TourProvider';
import Loader from '../components/Loader';
import { useEffect } from 'react';

export default function TourOverview() {
  const { slug } = useParams();
  console.log(slug);
  const { tours, currentTour, loading, getCurrentTour, getAllTours } =
    useTour();

  console.log(currentTour);
  useEffect(() => {
    async function fetchData() {
      // If tours are not loaded yet, load them
      if (!tours.length) {
        await getAllTours();
      }

      // Find the tour with the matching slug

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
      <p className='text-stone-600 md:text-xl'>Loading Tour. . .</p>
    </div>
  ) : (
    <>
      <TourImageSection />
      <TourInformation />
      <TourImages />
      <TourMap />
      <TourReviews />
      <BookTour />
    </>
  );
}
