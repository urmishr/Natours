import TourDescription from './TourDescription';
import TourFacts from './TourFacts';
import TourGuides from './TourGuides';
export default function TourInformation() {
  return (
    <section className='flex flex-col items-center justify-center lg:min-h-[500px] lg:flex-row lg:items-start'>
      {/* description */}
      <TourDescription />

      {/* guides and facts */}
      <div className='flex w-full flex-col items-center justify-evenly gap-10 py-10 md:flex-row md:items-baseline lg:h-full lg:w-1/2 lg:flex-col lg:items-center lg:py-5'>
        {/* facts */}
        <TourFacts />
        {/* guides */}
        <TourGuides />
      </div>
    </section>
  );
}
