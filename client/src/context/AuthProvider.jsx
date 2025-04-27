import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const AuthProvider = createContext();
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
    } else {
      dispatch({ type: 'logout' });
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
      console.log(res);
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
      const user = {
        id: res.data.data.doc._id,
        name: res.data.data.doc.name,
        email: res.data.data.doc.email,
        photo: res.data.data.doc.photo,
        role: res.data.data.doc.role,
      };
      dispatch({ type: 'login', payload: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.log(error.response.data.message);
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
      await loadUser();
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
      dispatch({ type: 'loading', payload: true });
      const res = await axios('/api/v1/users/logout');
      console.log(res);

      dispatch({ type: 'logout' });
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.log(error);
      dispatch({ type: 'error', payload: error.response });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      dispatch({ type: 'loading', payload: true });
      await axios({
        method: 'PATCH',
        url: '/api/v1/users/update-password',
        data: { currentPassword, newPassword, confirmPassword },
      });
      toast.success('Password Changed Successfully!');
      await logout();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function changeProfile(formData) {
    try {
      dispatch({ type: 'loading', payload: true });
      const res = await axios({
        method: 'PATCH',
        url: '/api/v1/users/update-me',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log(res.data);
      toast.success('Profile updated successfully!');
      await loadUser();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      dispatch({ type: 'error', payload: error.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  return (
    <AuthProvider.Provider
      value={{
        login,
        signup,
        changePassword,
        changeProfile,
        error,
        loading,
        user: currentUser,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthProvider.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthProvider);
  if (context === undefined)
    throw new Error('Auth context is used outside of the children');
  return context;
}

export { AuthProvier, useAuth };
