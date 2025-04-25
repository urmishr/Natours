import { useState } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu';
import logoGreen from '../assets/logos/logo-green.png';
import userDefault from '../assets/users/default.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Navlinks from './Navlinks';

export default function Navbar() {
  const { user } = useAuth();

  // replace with your backend URL or env var

  const userPhoto =
    user && user.photo ? `/img/users/${user.photo}` : `/img/users/default.jpg`;

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function capitalize(name) {
    const nameCapitalize = name.split(' ').map((name) => {
      name = name.toLowerCase();
      return name.charAt(0).toUpperCase() + name.slice(1);
    });

    return nameCapitalize.join(' ');
  }
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
          <div className='hidden gap-2 md:flex'>
            <Navlinks setIsOpen={setIsOpen} />
            {user && (
              <NavLink
                to='/account'
                className={({ isActive }) =>
                  `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
                }
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <img src={userDefault} className='size-8 rounded-full' />
                <span className='text-xl'>{capitalize(user.name)}</span>
              </NavLink>
            )}
          </div>
        </div>
      </nav>
      {isOpen ? (
        <div
          className={`border-natours absolute z-50 flex size-12 h-fit w-full bg-stone-800 shadow-2xl md:hidden`}
        >
          <div className='w-1/3 p-5'>
            <ul className='flex flex-col space-y-3 text-xl'>
              <Navlinks setIsOpen={setIsOpen} />
            </ul>
          </div>
          <div className='flex w-2/3 items-center justify-center p-5'>
            {user && (
              <NavLink
                to='/account'
                className={({ isActive }) =>
                  `text-natours flex items-center space-x-2 p-2 font-bold ${isActive ? 'border-b' : ''}`
                }
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <img src={userPhoto} className='size-12 rounded-full' />
                <span className='text-2xl'>{capitalize(user.name)}</span>
              </NavLink>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
