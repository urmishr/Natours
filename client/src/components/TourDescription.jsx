import { useTour } from '../context/TourProvider';

export default function TourDesciption() {
  const { currentTour } = useTour();
  return (
    <div className='flex flex-col bg-stone-300/10 p-10 lg:h-full lg:w-1/2 lg:py-30'>
      <div className='flex flex-col justify-center space-y-4'>
        <h1 className='natours-gradient-text font-italic text-center text-2xl font-bold lg:text-3xl'>
          Discover Your next adventure
        </h1>
        {currentTour.description.split('\n').map((paragraph, i) => (
          <p key={i} className='text-center text-stone-800/50'>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
