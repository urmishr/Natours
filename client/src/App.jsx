import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import AppLayout from './page/AppLayout';
import Settings from './components/Settings';
import Account from './page/Account';
import MyBookings from './components/MyBookings';

import TourOverview from './page/TourOverview';
import AllTours from './page/AllTours';
import { AuthProvier } from './context/authContext';

function App() {
  return (
    <AuthProvier>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='tours' element={<AllTours />} />
            <Route path='tour/:id' element={<TourOverview />} />
            <Route path='account' element={<Account />}>
              <Route index element={<Settings />} />
              <Route path='my-bookings' element={<MyBookings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvier>
  );
}

export default App;
