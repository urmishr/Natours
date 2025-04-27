import { useEffect } from 'react';
import Loader from '../components/Loader';
import Tour from '../components/Tour';
import { useTour } from '../context/TourProvider';

export default function AllTours() {
  const { loading, error, tours, getAllTours } = useTour();

  useEffect(function () {
    async function getTours() {
      await getAllTours();
    }
    getTours();
  }, []);
  // console.log(tours);
  return (
    <div className='m-5 flex flex-col items-center lg:grid lg:grid-cols-2 lg:items-center xl:grid-cols-3'>
      {loading && (
        <div className='flex h-[calc(100vh-10vh)] items-center justify-center'>
          <Loader
            className={'size-12'}
            color='
        green'
          />
        </div>
      )}
      {!loading && error && <p>{error}</p>}
      {!loading &&
        !error &&
        tours.map((tour) => <Tour key={tour.id} tour={tour} />)}
    </div>
  );
}
