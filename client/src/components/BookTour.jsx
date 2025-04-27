import { useTour } from '../context/TourProvider';
import { useAuth } from '../context/AuthProvider';

export default function BookTour() {
  const { currentTour } = useTour();
  const { isAuthenticated } = useAuth();
  return (
    <section className='px-5 py-7 md:px-10 lg:px-20'>
      <div className='relative flex flex-col justify-center overflow-hidden rounded-3xl bg-stone-300/20 py-10 shadow-lg'>
        <div className='flex flex-col items-center justify-evenly space-y-5 md:flex-row'>
          <div className='flex flex-col items-center justify-baseline space-y-5 px-5 md:px-10'>
            <h1 className='natours-gradient-text font-italic text-center text-2xl font-bold md:text-2xl lg:text-4xl'>
              What are you waiting for?
            </h1>
            <p className='text-center text-stone-800/50 italic'>
              <span className='font-semibold text-stone-600'>
                {currentTour.duration} days. 1 adventure
              </span>
              .
              <br />
              Infinite memories. Make it yours today! <br />
              <span className='text-red-400'>
                {!isAuthenticated && 'Login To book tour'}
              </span>
            </p>
          </div>
          <button className='btn-primary h-fit w-fit px-4 py-2 lg:py-4'>
            Book Yours Now!
          </button>
        </div>
      </div>
    </section>
  );
}
