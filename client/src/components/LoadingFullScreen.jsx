import Loader from './Loader';

export default function LoadingFullScreen() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader color='green' className='size-12' />
    </div>
  );
}
