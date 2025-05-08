export default function Loader({ color = 'white', className, type, text }) {
  if (type === 'componant') {
    return (
      <div className='my-2 flex flex-col items-center justify-center'>
        <span className={`loaderGreen ${className}`}></span>
        <p className='mx-1 font-semibold text-stone-600'>Loading...</p>
        <p className='mx-1 font-semibold text-stone-600'>{text}</p>
      </div>
    );
  }
  return color === 'white' ? (
    <span className='loader'></span>
  ) : (
    <span className={`loaderGreen ${className}`}></span>
  );
}
