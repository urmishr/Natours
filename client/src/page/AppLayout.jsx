import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';
export default function AppLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <Toaster />
      {/* Content grows to fill available space */}
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
