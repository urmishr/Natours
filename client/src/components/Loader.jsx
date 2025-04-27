export default function Loader({ color = 'white', className }) {
  return color === 'white' ? (
    <span className='loader'></span>
  ) : (
    <span className={`loaderGreen ${className}`}></span>
  );
}
