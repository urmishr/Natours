import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AllTours from './page/AllTours';
import Login from './components/Login';
import Signup from './components/Signup';
import AppLayout from './page/AppLayout';
import Settings from './components/Settings';
import Account from './page/Account';
import MyBookings from './components/MyBookings';

import TourOverview from './page/TourOverview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<AllTours />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='tour/:id' element={<TourOverview />} />
          <Route path='account' element={<Account />}>
            <Route index element={<Settings />} />
            <Route path='my-bookings' element={<MyBookings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
