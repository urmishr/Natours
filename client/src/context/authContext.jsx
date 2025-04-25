import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const authContext = createContext();
const initialState = {
  currentUser: null,
  error: '',
  loading: false,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
        loading: false,
      };

    case 'error':
      return { ...state, error: action.payload, loading: false };
    case 'loading':
      return { ...state, loading: action.payload };

    case 'logout':
      return { ...state, currentUser: null, error: '', isAuthenticated: false };

    default: {
      return new Error(`Error at ${action.type}`);
    }
  }
}
function AuthProvier({ children }) {
  const [{ currentUser, error, loading, isAuthenticated }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      dispatch({ type: 'login', payload: JSON.parse(storedUser) });
    }
  }, []);

  async function login(email, password) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: { email, password },
        withCredentials: true,
      });
      console.log(res.data.user);
      await loadUser();
    } catch (e) {
      console.error(e.response.data);
      toast.error(e.response.data.message);
      dispatch({ type: 'error', payload: e });
      dispatch({ type: 'logout' });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function loadUser() {
    try {
      const res = await axios('/api/v1/users/me', { withCredentials: true });

      console.log(res);
      dispatch({ type: 'login', payload: res.data.data });
      localStorage.setItem('currentUser', JSON.stringify(res.data.data));
    } catch (error) {
      console.log(error);
    }
  }

  async function signup(formdata) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios.post('/api/v1/users/signup', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log(res.data);

      toast.success('Signup successful!');
      loadUser();
    } catch (e) {
      console.error(e.response.data);
      toast.error(e.response.data.message);
      dispatch({ type: 'error', payload: e.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function logout() {
    try {
      const res = await axios('/api/v1/users/logout');
      console.log(res);

      dispatch({ type: 'logout' });
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.log(error);
      dispatch({ type: 'error', payload: error.response });
    }
  }

  return (
    <authContext.Provider
      value={{
        login,
        signup,
        error,
        loading,
        user: currentUser,
        logout,
        isAuthenticated,
      }}
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
