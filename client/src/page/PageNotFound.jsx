import { FaRegFrownOpen } from 'react-icons/fa';
export default function PageNotFound() {
  return (
    <div className='flex h-[calc(100vh-10vh)] flex-col items-center justify-center space-y-4'>
      {/* <MdFindInPage className='size-24 text-red-400' /> */}
      <p className='flex gap-3 text-5xl font-bold text-red-400'>
        <span>
          <FaRegFrownOpen />
        </span>
        404!
      </p>
      <p className='text-2xl font-semibold text-red-400'>Page Not Found</p>
    </div>
  );
}
