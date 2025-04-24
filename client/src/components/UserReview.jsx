export default function UserReview({ photo, userName, review }) {
  return (
    <div className='min-h-[300px] min-w-[350px] space-y-5 rounded bg-white p-10 shadow-lg'>
      <div className='flex items-center gap-5'>
        <img className='text-natours size-10 rounded-full' src={photo} />
        <p className='font-medium text-stone-600'>{userName}</p>
      </div>
      <div>
        <p className='text-stone-800/50'>{review}</p>
      </div>
      <div></div>
    </div>
  );
}
