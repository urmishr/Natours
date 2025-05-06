import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';

const initialState = {
  myReviews: [],
  loading: false,
  loadingUpdate: false,
  loadingWrite: false,
  loadingDelete: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: action.payload };
    case 'loadingUpdate':
      return { ...state, loadingUpdate: action.payload };
    case 'loadingWrite':
      return { ...state, loadingWrite: action.payload };
    case 'loadingDelete':
      return { ...state, loadingDelete: action.payload };
    case 'loadMyReviews':
      return { ...state, myReviews: action.payload, loading: false };
    case 'error':
      return { ...state, error: action.payload, loading: false };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { userInitialized, isAuthenticated } = useAuth();

  useEffect(
    function () {
      async function fetchReview() {
        if (!userInitialized || !isAuthenticated) {
          return;
        }
        await getMyReviews();
      }
      fetchReview();
    },
    [userInitialized, isAuthenticated],
  );

  async function getMyReviews() {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios.get('/api/v1/reviews/user', {
        withCredentials: true,
      });
      dispatch({ type: 'loadMyReviews', payload: res.data.reviews });
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
      console.error(error);
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function writeReview(data) {
    try {
      dispatch({ type: 'loadingWrite', payload: true });
      await axios.post('/api/v1/reviews', data, { withCredentials: true });
      // Optionally, refresh reviews after writing
      await getMyReviews();
    } catch (error) {
      dispatch({ type: 'error', payload: error.message });
      console.error(error);
    } finally {
      dispatch({ type: 'loadingWrite', payload: false });
    }
  }

  async function updateMyReview(id, data) {
    try {
      dispatch({ type: 'loadingUpdate', payload: true });
      await axios.patch(`/api/v1/reviews/${id}`, data);

      await getMyReviews();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: 'loadingUpdate', payload: false });
    }
  }
  async function deleteMyReview(id) {
    try {
      dispatch({ type: 'loadingDelete', payload: true });
      await axios.delete(`/api/v1/reviews/${id}`);
      await getMyReviews();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: 'loadingDelete', payload: false });
    }
  }

  return (
    <ReviewContext.Provider
      value={{
        myReviews: state.myReviews,
        loading: state.loading,
        error: state.error,
        loadingUpdate: state.loadingUpdate,
        loadingWrite: state.loadingWrite,
        loadingDelete: state.loadingDelete,
        getMyReviews,
        deleteMyReview,
        writeReview,
        updateMyReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
}
