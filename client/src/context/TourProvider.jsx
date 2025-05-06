import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';

import { useAuth } from './AuthProvider';

const CACHE_EXPIRY = 180 * 60 * 1000;

const initialState = {
  tours: [],
  loading: false,
  error: '',
  currentTour: {},
  myBookings: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'loadTours': {
      return { ...state, loading: false, tours: action.payload };
    }
    case 'loading': {
      return { ...state, loading: action.payload };
    }

    case 'error': {
      return { ...state, loading: false, error: action.payload };
    }
    case 'setCurrentTour': {
      return { ...state, currentTour: action.payload };
    }
    case 'loadMyBooking': {
      return { ...state, myBookings: action.payload };
    }

    default: {
      throw new Error(`Error occoured at action type:${action.type}`);
    }
  }
}

const tourProvider = createContext();
function TourProvider({ children }) {
  const [
    { tours, loading, error, currentTour, myBookings, myReviews },
    dispatch,
  ] = useReducer(reducer, initialState);
  const { userInitialized, isAuthenticated, user } = useAuth();

  useEffect(
    function () {
      async function fetchTours() {
        const cachedTours = getCache('tours');
        if (cachedTours) {
          dispatch({ type: 'loadTours', payload: cachedTours });
        } else {
          await getAllTours();
        }
        if (!userInitialized || !isAuthenticated) {
          return;
        }
        await getMyBookings();
      }
      fetchTours();
    },
    [userInitialized, isAuthenticated],
  );

  function setCache(key, data) {
    const cacheData = {
      data,
      timeStamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  function getCache(key) {
    const cacheDataString = localStorage.getItem(key);
    if (!cacheDataString) return null;

    try {
      const cacheData = JSON.parse(cacheDataString);
      const isExpired = Date.now() - cacheData.timeStamp > CACHE_EXPIRY;
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      return cacheData.data;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  async function getAllTours() {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios.get('/api/v1/tours');
      const tours = res.data.data.docs;
      setCache('tours', tours);
      dispatch({ type: 'loadTours', payload: res.data.data.docs });
    } catch (error) {
      dispatch({ type: 'error', payload: error.response });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function getCurrentTour(slug) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios.get(`/api/v1/tours/tour/${slug}`);
      dispatch({ type: 'setCurrentTour', payload: res.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function getMyBookings() {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios(`/api/v1/bookings/user/${user.id}`, {
        withCredential: true,
      });

      dispatch({ type: 'loadMyBooking', payload: res.data.bookings });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  return (
    <tourProvider.Provider
      value={{
        tours,
        loading,
        error,
        getCurrentTour,
        myBookings,
        myReviews,
        currentTour,
      }}
    >
      {children}
    </tourProvider.Provider>
  );
}

function useTour() {
  const context = useContext(tourProvider);
  if (context === undefined)
    throw new Error('Tour Context is used out side of the children');
  return context;
}

export { TourProvider, useTour };
