import GuideAvatar from './GuideAvatar';
import { useTour } from '../context/TourProvider';
export default function TourGuides() {
  const { currentTour } = useTour();

  const formatGuideRole = (guideRole) => {
    let role = guideRole;
    if (role === 'guide') return (role = 'Tour Guide');

    role = role
      .split('-')
      .map((r) => r[0].toUpperCase() + r.slice(1).toLowerCase())
      .join(' ');
    return role;
  };
  return (
    <div className='my-4 items-center justify-center space-y-6'>
      <h1 className='natours-gradient-text font-italic w-full text-center text-3xl font-bold lg:text-3xl'>
        Tour Guides
      </h1>

      {currentTour.guides.length === 0 ? (
        <h1 className='text-stone-600'>
          No guides are available at the moment.
        </h1>
      ) : (
        currentTour.guides.map((guide) => (
          <GuideAvatar
            key={guide._id}
            photo={`https://natours-aos3.onrender.com/img/users/${guide.photo}`}
            guideName={guide.name}
            guideRole={formatGuideRole(guide.role)}
          />
        ))
      )}
    </div>
  );
}
