import Loader from '../components/Loader';
import Tour from '../components/Tour';
import { useTour } from '../context/TourProvider';
import { motion } from 'motion/react';

export default function AllTours() {
  const { loading, error, tours } = useTour();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='lg:grid lg:grid-cols-2 xl:grid-cols-3'
    >
      {loading && (
        <div className='flex h-[calc(100vh-10vh)] w-screen items-center justify-center'>
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
    </motion.div>
  );
}
