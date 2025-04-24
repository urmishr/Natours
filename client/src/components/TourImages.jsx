import tourOne from './../assets/tours/tour-1-1.jpg';
import tourTwo from './../assets/tours/tour-1-2.jpg';
import tourThree from './../assets/tours/tour-1-3.jpg';

export default function TourImages() {
  return (
    <section className='mb-10 flex flex-col lg:min-h-[400px] lg:flex-row'>
      <div className='flex -skew-y-5 flex-col lg:-translate-y-45 lg:flex-row lg:py-20'>
        <img
          src={tourOne}
          alt='tour Image 1'
          className='object-cover lg:w-1/3'
        />
        <img
          src={tourTwo}
          alt='tour Image 2'
          className='object-cover lg:w-1/3'
        />
        <img
          src={tourThree}
          alt='tour Image 3'
          className='object-cover lg:w-1/3'
        />
      </div>
    </section>
  );
}

{
  /* <section className='imgclip flex -translate-y-33 flex-col lg:min-h-[400px] lg:flex-row'>
<img src={tourOne} alt='tour Image 1' className='object-cover lg:w-1/3' />
<img src={tourTwo} alt='tour Image 2' className='object-cover lg:w-1/3' />
<img
  src={tourThree}
  alt='tour Image 3'
  className='object-cover lg:w-1/3'
/>
</section> */
}
