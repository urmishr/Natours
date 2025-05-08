import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Login from './components/Login';
// import Signup from './components/Signup';
// import Settings from './components/Settings';
// import Account from './page/Account';
// import MyBookings from './components/MyBookings';
// import TourOverview from './page/TourOverview';
// import PageNotFound from './page/PageNotFound';
// import AllTours from './page/AllTours';
// import SendOtp from './components/SendOtp';
// import VerifyOtp from './components/VerifyOtp';
// import ChangePassword from './components/ChangePassword';
// import MyReviews from './components/MyReviews';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import { TourProvider } from './context/TourProvider';
import { ReviewProvider } from './context/ ReviewProvider';
import HomePage from './page/HomePage';
import AppLayout from './page/AppLayout';
import { lazy, Suspense } from 'react';
import LoadingFullScreen from './components/LoadingFullScreen';

const MyReviews = lazy(() => import('./components/MyReviews'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Settings = lazy(() => import('./components/Settings'));
const Account = lazy(() => import('./page/Account'));
const MyBookings = lazy(() => import('./components/MyBookings'));
const TourOverview = lazy(() => import('./page/TourOverview'));
const PageNotFound = lazy(() => import('./page/PageNotFound'));
const AllTours = lazy(() => import('./page/AllTours'));
const SendOtp = lazy(() => import('./components/SendOtp'));
const VerifyOtp = lazy(() => import('./components/VerifyOtp'));
const ChangePassword = lazy(() => import('./components/ChangePassword'));

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <ReviewProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<LoadingFullScreen />}>
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
                    <Route
                      path='my-review'
                      element={
                        <ProtectedRoute>
                          <MyReviews />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  <Route path='*' element={<PageNotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ReviewProvider>
      </TourProvider>
    </AuthProvider>
  );
}

export default App;
