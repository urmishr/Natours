import Tour from '../components/Tour';

export default function AllTours() {
  return (
    <div className='m-5 md:grid-cols-2 lg:grid lg:grid-cols-2 lg:items-center xl:grid-cols-3'>
      <Tour />
      <Tour />
      <Tour />
      <Tour />
      <Tour />
      <Tour />
    </div>
  );
}
