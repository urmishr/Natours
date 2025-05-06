import { useLayoutEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Account() {
  const location = useLocation();
  const navRefs = useRef({});

  // Detect iOS devices
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  useLayoutEffect(() => {
    const activeLink = Object.values(navRefs.current).find((el) =>
      el?.classList.contains('active'),
    );
    if (activeLink) {
      if (isIOS()) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
        // Force repaint for iOS
        activeLink.style.webkitTransform = 'translateZ(0)';
      } else {
        activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [location]);

  return (
    <section className='flex flex-col items-center justify-center px-4 py-8'>
      <div className='my-5 flex w-full justify-center rounded bg-white whitespace-nowrap shadow-md md:w-fit md:space-x-5 md:overflow-visible'>
        <div className='mx-4 my-3 space-x-3 overflow-x-auto p-3'>
          <NavLink
            to='/account'
            end
            ref={(el) => (navRefs.current['account'] = el)}
            className={({ isActive }) =>
              `text-natours p-3 font-semibold lg:text-lg ${
                isActive ? 'active natours-gradient rounded text-white' : ''
              }`
            }
          >
            Account Settings
          </NavLink>
          <NavLink
            to='my-bookings'
            end
            ref={(el) => (navRefs.current['bookings'] = el)}
            className={({ isActive }) =>
              `text-natours p-3 text-lg font-semibold lg:text-lg ${
                isActive ? 'active natours-gradient rounded text-white' : ''
              }`
            }
          >
            Bookings
          </NavLink>
          <NavLink
            to='my-review'
            ref={(el) => (navRefs.current['reviews'] = el)}
            className={({ isActive }) =>
              `text-natours p-3 text-lg font-semibold lg:text-lg ${
                isActive ? 'active natours-gradient rounded text-white' : ''
              }`
            }
          >
            Reviews
          </NavLink>
        </div>
      </div>
      <Outlet />
    </section>
  );
}
