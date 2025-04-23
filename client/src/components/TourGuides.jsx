import userOne from './../assets/users/user-3.jpg';
import userTwo from './../assets/users/user-2.jpg';
export default function TourGuides() {
  return (
    <div className='my-4 items-center justify-center space-y-6'>
      <h1 className='natours-gradient-text font-italic w-full text-center text-2xl font-bold lg:text-3xl'>
        Tour Guides
      </h1>

      <div className='flex items-center gap-2'>
        <img className='text-natours size-10 rounded-full' src={userOne} />
        <p className='font-semibold text-stone-600'>
          Lead Guide
          <span className='ml-3 font-medium text-stone-800/50'>
            Jenna Fischer
          </span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <img className='text-natours size-10 rounded-full' src={userTwo} />
        <p className='font-semibold text-stone-600'>
          Tour Guide
          <span className='ml-3 font-medium text-stone-800/50'>
            Jennifer Anniston
          </span>
        </p>
      </div>
    </div>
  );
}
