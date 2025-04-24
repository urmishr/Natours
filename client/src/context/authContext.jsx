import { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
const authContext = createContext();
const initialState = {
  user: null,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload };

    default: {
      return new Error(`Error at ${action.type}`);
    }
  }
}
function AuthProvier({ children }) {
  const [{ user }, dispatch] = useReducer(reducer, initialState);

  async function login(email, password) {
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: { email, password },
      });
      console.log(res.data);
      dispatch({ type: 'user', payload: res.data });
    } catch (e) {
      dispatch({ type: 'error', payload: e.response });
    }
  }

  return <authContext.Provider value={login}>{children}</authContext.Provider>;
}

function useAuth() {
  const context = useContext(authContext);
  if (!context) throw new Error('Auth context is used outside of the children');
  return context;
}

export { AuthProvier, useAuth };
