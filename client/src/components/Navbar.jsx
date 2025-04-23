import { useState } from 'react';

import logoGreen from '../assets/logos/logo-green.png';
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  UserPlusIcon,
  XMarkIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className='w-full'>
      <nav className='relative w-full bg-stone-800 py-5'>
        <div className='mx-5 flex items-center justify-between'>
          <img
            src={logoGreen}
            alt='natours_logo_white'
            className='h-8'
            onClick={() => navigate('/')}
          />
          {!isOpen ? (
            <Bars3Icon
              className='text-natours group size-9 md:hidden'
              onClick={() => setIsOpen(!isOpen)}
            />
          ) : (
            <XMarkIcon
              className='text-natours ml-auto size-9 md:hidden'
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
          className={`border-natours absolute size-12 h-fit w-full bg-stone-800 shadow-2xl md:hidden`}
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
    <div className='flex flex-col gap-3 md:flex-row'>
      <div className='flex items-center space-x-1'>
        <NavLink
          to='/login'
          className={({ isActive }) =>
            `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
          }
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <ArrowLeftEndOnRectangleIcon className='text-natours size-8' />
          <span>Login</span>
        </NavLink>
      </div>
      <div className='flex items-center space-x-1'>
        <NavLink
          to='/signup'
          className={({ isActive }) =>
            `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
          }
          onClick={() => {
            setIsOpen(false);
          }}
        >
          {<UserPlusIcon className='text-natours size-8' />}
          <span>Signup</span>
        </NavLink>
      </div>
    </div>
  );
}
