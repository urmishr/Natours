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
    case 'resetError':
      return { ...state, error: '' };

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
      dispatch({ type: 'resetError' });
      await axios({
        method: 'POST',
        url: 'https://natours-production-23d3.up.railway.app/api/v1/users/login',
        data: { email, password },
        withCredentials: true,
      });
      await loadUser();
    } catch (e) {
      toast.error(e.response.data.message);
      console.error(e);
      dispatch({ type: 'error', payload: e.response.data.message });
      dispatch({ type: 'logout' });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function loadUser() {
    try {
      const res = await axios(
        'https://natours-production-23d3.up.railway.app/api/v1/users/me',
        { withCredentials: true },
      );
      dispatch({ type: 'resetError' });

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
      dispatch({ type: 'error', payload: error.response.data.message });
    }
  }

  async function signup(formdata) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      await axios.post(
        'https://natours-production-23d3.up.railway.app/api/v1/users/signup',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        },
      );

      toast.success('Signup successful!');
      await loadUser();
    } catch (e) {
      toast.error(e.response.data.message);
      dispatch({ type: 'error', payload: error.response.data.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function logout() {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      await axios(
        'https://natours-production-23d3.up.railway.app/api/v1/users/logout',
      );

      dispatch({ type: 'logout' });
      localStorage.removeItem('currentUser');
    } catch (error) {
      dispatch({ type: 'error', payload: error.response.data.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      await axios({
        method: 'PATCH',
        url: 'https://natours-production-23d3.up.railway.app/api/v1/users/update-password',
        data: { currentPassword, newPassword, confirmPassword },
      });
      toast.success('Password Changed Successfully!');
      await logout();
    } catch (error) {
      dispatch({ type: 'error', payload: error.response.data.message });
      toast.error(error.response.data.message);
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function sendOtp(email) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      await axios.post(
        'https://natours-production-23d3.up.railway.app/api/v1/users/forgot-password/send-otp',
        {
          email,
        },
      );
      toast.success('Verification code has been sent to your Email', {
        duration: 4000,
      });
      return true;
    } catch (error) {
      dispatch({ type: 'error', payload: error.response.data.message });
      return false;
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function verifyOtp(otp, email) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });
      const res = await axios.post(
        'https://natours-production-23d3.up.railway.app/api/v1/users/forgot-password/verify-otp',
        {
          otp,
          email,
        },
      );
      toast.success(res.data.message);
      return true;
    } catch (error) {
      dispatch({ type: 'error', payload: error.response.data.message });
      return false;
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function resetPassword(email, newPassword, confirmPassword) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      const res = await axios.patch(
        'https://natours-production-23d3.up.railway.app/api/v1/users/reset-password',
        {
          email,
          newPassword,
          confirmPassword,
        },
      );
      toast.success(res.data.message);
      return true;
    } catch (error) {
      dispatch({ type: 'error', payload: error.response.data.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  async function changeProfile(formData) {
    try {
      dispatch({ type: 'loading', payload: true });
      dispatch({ type: 'resetError' });

      await axios({
        method: 'PATCH',
        url: 'https://natours-production-23d3.up.railway.app/api/v1/users/update-me',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success('Profile updated successfully!');
      await loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      dispatch({ type: 'error', payload: error.response.data.message });
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  }

  function resetError() {
    dispatch({ type: 'resetError' });
  }

  return (
    <AuthProvider.Provider
      value={{
        login,
        signup,
        changePassword,
        changeProfile,
        sendOtp,
        verifyOtp,
        resetPassword,
        resetError,
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
