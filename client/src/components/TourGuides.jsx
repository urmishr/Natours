import userOne from './../assets/users/user-3.jpg';
import userTwo from './../assets/users/user-2.jpg';
import GuideAvatar from './GuideAvatar';
export default function TourGuides() {
  return (
    <div className='my-4 items-center justify-center space-y-6'>
      <h1 className='natours-gradient-text font-italic w-full text-center text-3xl font-bold lg:text-3xl'>
        Tour Guides
      </h1>
      <GuideAvatar
        photo={userOne}
        guideName={'Jenna Fishcher'}
        guideRole={'Lead Guide'}
      />
      <GuideAvatar
        photo={userTwo}
        guideName={'Jennifer Anniston'}
        guideRole={'Tour Guide'}
      />
    </div>
  );
}
