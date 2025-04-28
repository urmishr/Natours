import { NavLink, Outlet } from 'react-router-dom';
// import Login from '../components/Login';

export default function Account() {
  return (
    <section className='flex flex-col items-center justify-center px-5 py-8'>
      <div className='my-5 space-x-5 rounded bg-white p-6 shadow-md'>
        <NavLink
          to='/account'
          end
          className={({ isActive }) =>
            `text-natours p-3 text-lg font-semibold ${isActive && 'natours-gradient rounded px-3 py-3 text-white shadow-md'} `
          }
        >
          Account Settings
        </NavLink>
        <NavLink
          to='my-bookings'
          end
          className={({ isActive }) =>
            `text-natours p-3 text-lg font-semibold ${isActive && 'natours-gradient rounded px-3 py-3 text-white shadow-md'} `
          }
        >
          My Bookings
        </NavLink>
      </div>
      <Outlet />
    </section>
  );
}
