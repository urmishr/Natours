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
import { AuthProvider } from './context/AuthProvider';
import PageNotFound from './page/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { TourProvider } from './context/TourProvider';
import SendOtp from './components/SendOtp';
import VerifyOtp from './components/VerifyOtp';
import ChangePassword from './components/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AppLayout />}>
              <Route index element={<HomePage />} />

              <Route path='login' element={<Login />} />
              <Route path='forgot-password'>
                <Route index path='send-otp' element={<SendOtp />} />
                <Route path='verify-otp' element={<VerifyOtp />} />
                <Route path='reset-password' element={<ChangePassword />} />
              </Route>

              <Route path='signup' element={<Signup />} />
              <Route path='tours' element={<AllTours />} />
              <Route path='tour/:slug' element={<TourOverview />} />
              <Route
                path='account'
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='my-bookings'
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TourProvider>
    </AuthProvider>
  );
}

export default App;
