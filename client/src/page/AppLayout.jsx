import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      {/* Content grows to fill available space */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
