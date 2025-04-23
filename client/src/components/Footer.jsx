import logoGreenRound from './../assets/logos/logo-green-round.png';
export default function Footer() {
  return (
    <footer className='mx-5 my-10 lg:mt-15'>
      <div className='flex flex-col items-center lg:flex-row lg:justify-between'>
        <img
          src={logoGreenRound}
          alt='natours round logo'
          className='size-15'
        />
        <div className='flex flex-col items-center lg:items-end'>
          <ul className='flex space-x-3 p-2 text-[12px] font-semibold text-stone-600/80 md:text-[0.9rem] lg:text-[1rem]'>
            <a href='#'>About us</a>
            <a href='#'>Download app</a>
            <a href='#'>Become a guide</a>
            <a href='#'>Careers</a>
            <a href='#'>Contact</a>
          </ul>
          <p className='pr-2 text-[12px] text-stone-400 md:text-[0.9rem] lg:text-[1rem]'>
            {new Date().getFullYear()} © By Urmish Ramani. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
