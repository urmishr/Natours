export default function GuideAvatar({ photo, guideRole, guideName }) {
  return (
    <div className='flex items-center gap-2'>
      <img className='text-natours size-10 rounded-full' src={photo} />
      <p className='font-semibold text-stone-600'>
        {guideRole}
        <span className='ml-3 font-medium text-stone-800/50'>{guideName}</span>
      </p>
    </div>
  );
}
