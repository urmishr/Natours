import TourDescription from './TourDescription';
import TourFacts from './TourFacts';
import TourGuides from './TourGuides';
export default function TourInformation() {
  return (
    <section className='flex -translate-y-17 flex-col items-center justify-center lg:flex-row'>
      {/* description */}
      <TourDescription />

      {/* guides and facts */}
      <div className='mt-10 flex w-full flex-col items-center justify-evenly gap-10 md:my-20 md:flex-row md:items-baseline lg:mt-20 lg:w-1/2 lg:flex-col lg:items-center'>
        {/* facts */}
        <TourFacts />
        {/* guides */}
        <TourGuides />
      </div>
    </section>
  );
}
