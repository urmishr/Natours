import { useState } from 'react';
import { IoLogIn } from 'react-icons/io5';
import { FaUserPlus, FaRegWindowClose } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu';
import { MdTour, MdOutlineTravelExplore } from 'react-icons/md';
import logoGreen from '../assets/logos/logo-green.png';

import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className='w-full'>
      <nav className='relative w-full bg-stone-800 py-5'>
        <div className='mx-5 flex items-center justify-between lg:mx-10'>
          <img
            src={logoGreen}
            alt='natours_logo_white'
            className='h-8'
            onClick={() => {
              navigate('/');
              setIsOpen(false);
            }}
          />
          {!isOpen ? (
            <LuMenu
              className='text-natours group size-8 md:hidden'
              onClick={() => setIsOpen(!isOpen)}
            />
          ) : (
            <FaRegWindowClose
              className='text-natours ml-auto size-7 md:hidden'
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
          <div className='hidden md:block'>
            <Navlinks setIsOpen={setIsOpen} />
          </div>
        </div>
      </nav>
      {isOpen ? (
        <div
          className={`border-natours absolute z-50 size-12 h-fit w-full bg-stone-800 shadow-2xl md:hidden`}
        >
          <div className='mx-5 py-5'>
            <ul className='flex flex-col space-y-3 text-xl'>
              <Navlinks setIsOpen={setIsOpen} />
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Navlinks({ setIsOpen }) {
  return (
    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-center'>
      <div className='flex items-center'>
        <NavLink
          to='/login'
          className={({ isActive }) =>
            `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
          }
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <IoLogIn className='text-natours size-8' />
          <span>Login</span>
        </NavLink>
      </div>
      <div className='flex items-center'>
        <NavLink
          to='/signup'
          className={({ isActive }) =>
            `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
          }
          onClick={() => {
            setIsOpen(false);
          }}
        >
          {<FaUserPlus className='text-natours size-8' />}
          <span>Signup</span>
        </NavLink>
      </div>
      <div className='flex items-center'>
        <NavLink
          to='/tours'
          className={({ isActive }) =>
            `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
          }
          onClick={() => {
            setIsOpen(false);
          }}
        >
          {<MdOutlineTravelExplore className='text-natours size-8' />}
          <span>Tours</span>
        </NavLink>
      </div>
    </div>
  );
}
