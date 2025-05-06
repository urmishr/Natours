import { Rating } from 'react-simple-star-rating';

export default function UserReview({ photo, userName, review, ratings }) {
  return (
    <div className='mx-auto flex min-h-[19rem] min-w-[20rem] flex-col items-center justify-between space-y-10 rounded bg-white p-8 shadow-lg md:min-h-[300px] md:max-w-[400px] md:min-w-[350px]'>
      <div className='space-y-5'>
        <div className='flex items-center gap-5'>
          <img
            className='text-natours size-10 rounded-full shadow'
            src={photo}
          />
          <p className='font-semibold text-stone-600'>{userName}</p>
        </div>
        <div>
          <p className='text-stone-800/50'>{review}</p>
        </div>
      </div>

      <div>
        <Rating
          initialValue={Math.round(ratings)}
          size={25}
          readonly={true}
          fillColor={'#55c57a'}
        />
      </div>
    </div>
  );
}
