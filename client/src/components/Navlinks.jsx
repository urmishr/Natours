import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import Loader from './Loader';

export default function Navlinks({ setIsOpen }) {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    await logout();
    setIsOpen(false);
    navigate('/');
  }

  return (
    <div className='flex gap-3 md:flex-row md:items-center md:justify-center'>
      {!isAuthenticated && (
        <>
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
        </>
      )}
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
      {isAuthenticated && (
        <div className='flex items-center'>
          <button
            className={`text-natours flex items-center space-x-2 p-2 font-bold hover:cursor-pointer`}
            onClick={handleLogout}
          >
            {<IoLogOut className='text-natours size-8' />}
            <span>Logout</span>
            {loading && (
              <span>
                <Loader color='green' className={'size-6'} />
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
