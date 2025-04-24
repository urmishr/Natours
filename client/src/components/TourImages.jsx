import tourOne from './../assets/tours/tour-1-1.jpg';
import tourTwo from './../assets/tours/tour-1-2.jpg';
import tourThree from './../assets/tours/tour-1-3.jpg';

export default function TourImages() {
  return (
    <section className='flex flex-col lg:my-10 lg:flex-row'>
      <div className='flex flex-col lg:flex-row'>
        <img
          src={tourOne}
          alt='tour Image 1'
          className='mx-6 my-5 rounded object-cover shadow-xl md:mx-12 md:my-10 lg:mx-6 lg:my-8 lg:w-1/3 lg:transition-all lg:hover:scale-110'
        />
        <img
          src={tourTwo}
          alt='tour Image 2'
          className='mx-6 my-5 rounded object-cover shadow-xl md:mx-12 md:my-10 lg:mx-6 lg:my-8 lg:w-1/3 lg:transition-all lg:hover:scale-110'
        />
        <img
          src={tourThree}
          alt='tour Image 3'
          className='mx-6 my-5 rounded object-cover shadow-xl md:mx-12 md:my-10 lg:mx-6 lg:my-8 lg:w-1/3 lg:transition-all lg:hover:scale-110'
        />
      </div>
    </section>
  );
}
