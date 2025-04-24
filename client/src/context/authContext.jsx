import { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
const authContext = createContext();
const initialState = {
  user: null,
  error: '',
  loading: false,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case 'error':
      return { ...state, error: action.payload, loading: false };
    case 'loading':
      return { ...state, loading: action.payload };

    case 'logout':
      return { ...state, user: null, error: '', isAuthenticated: false };

    default: {
      return new Error(`Error at ${action.type}`);
    }
  }
}
function AuthProvier({ children }) {
  const [{ user, error, loading, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  async function login(email, password) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: { email, password },
      });
      console.log(res.data);
      dispatch({ type: 'login', payload: res.data.data.user });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'error', payload: e });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function logout() {
    try {
      const res = await axios('/api/v1/users/logout');
      console.log(res);
      dispatch({ type: 'logout' });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'error', payload: error.response });
    }
  }

  return (
    <authContext.Provider
      value={{ login, error, loading, user, logout, isAuthenticated }}
    >
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  const context = useContext(authContext);
  if (context === undefined)
    throw new Error('Auth context is used outside of the children');
  return context;
}

export { AuthProvier, useAuth };
