import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Loader from './Loader';
import toast from 'react-hot-toast';
import validator from 'validator';
export default function Login() {
  const { loading, login, isAuthenticated } = useAuth();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function validateFields(email, password) {
    let valid = true;

    if (!email) {
      setEmailError(true);
      valid = false;
    } else if (!validator.isEmail(email)) {
      setEmailError(true);
      toast.error('Incorrect email address format!');
      valid = false;
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(true);
      toast.error('Password length must be at least 8 characters');
      valid = false;
    }

    if (!valid && (!email || !password)) {
      toast.error('Please provide both email and password!');
    }

    return valid;
  }

  async function handleLogin() {
    if (validateFields(email.trim(), password.trim())) {
      await login(email.trim(), password.trim());
    }
  }

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/tours');
    }
  }, [isAuthenticated, loading, navigate]);
  return (
    <section className='my-auto flex w-full flex-col md:items-center'>
      <div className='mx-5 my-14 flex flex-col justify-between space-y-8 rounded-lg bg-white px-5 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'>
        <div className='flex flex-col space-y-1'>
          <h1 className='natours-gradient-text text-2xl font-bold'>
            Log into Your account
          </h1>
          <NavLink to='/signup' className='font-semibold text-stone-600'>
            <span className='mr-2 text-stone-800/50'>
              Don't have an Account?
            </span>
            Signup
          </NavLink>
        </div>
        <div className='flex flex-col space-y-3'>
          <div>
            <label htmlFor='email' className='font-semibold text-stone-600'>
              Email Address
            </label>
          </div>
          <input
            type='text'
            className={`input-natours w-full text-stone-600 ${emailError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='you@example.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <div>
            <label htmlFor='password' className='font-semibold text-stone-600'>
              Password
            </label>
          </div>
          <input
            type='password'
            className={`input-natours w-full text-stone-600 ${passwordError && 'border-3 border-red-400 focus:ring-0'}`}
            placeholder='••••••••'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
          />
        </div>
        <div>
          <NavLink
            to='/forgot-password/send-otp'
            className='text-natours font-semibold'
            state={{ emailTyped: email }}
          >
            Forgot Password?
          </NavLink>
        </div>
        <div>
          <button
            className='btn-primary w-1/2 py-3 md:w-1/3'
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Loader /> : 'Login'}
          </button>
        </div>
      </div>
    </section>
  );
}
