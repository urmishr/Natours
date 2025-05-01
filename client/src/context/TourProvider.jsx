import axios from 'axios';
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  tours: [],
  loading: false,
  error: '',
  currentTour: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'loadTours': {
      return { ...state, tours: action.payload };
    }
    case 'loading': {
      return { ...state, loading: action.payload };
    }
    case 'error': {
      return { ...state, error: action.payload };
    }
    case 'setCurrentTour': {
      return { ...state, currentTour: action.payload };
    }

    default: {
      throw new Error(`Error occoured at action type:${action.type}`);
    }
  }
}

const tourProvider = createContext();
function TourProvider({ children }) {
  const [{ tours, loading, error, currentTour }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  async function getAllTours() {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios.get('/api/v1/tours');
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

  return (
    <tourProvider.Provider
      value={{
        tours,
        loading,
        error,
        getAllTours,
        getCurrentTour,
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
