import { useTour } from '../context/TourProvider';

export default function TourImages() {
  const { currentTour } = useTour();
  return (
    <section className='flex flex-col lg:my-10 lg:flex-row'>
      <div className='flex w-full flex-col lg:flex-row lg:overflow-auto'>
        {currentTour.images.map((image, i) => (
          <img
            src={`https://natours-aos3.onrender.com/img/tours/${image}`}
            key={i}
            alt='tour Image 1'
            className='mx-6 my-5 rounded object-cover shadow-xl md:mx-12 md:my-10 lg:mx-6 lg:my-8 lg:w-[40vw] lg:transition-all lg:hover:scale-105'
          />
        ))}
      </div>
    </section>
  );
}
