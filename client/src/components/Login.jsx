import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Loader from './Loader';

export default function Login() {
  const { loading, login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  function handleLogin() {
    login(email, password);
    console.log('loading', loading);
    console.log('isAuthenticated', isAuthenticated);
    console.log('loading', loading);
    // if (isAuthenticated) navigate('/tours');
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
          <label htmlFor='email' className='font-semibold text-stone-600'>
            Email Address
          </label>
          <input
            type='text'
            className='input-natours w-full text-stone-600'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='password' className='font-semibold text-stone-600'>
            Password
          </label>
          <input
            type='password'
            className='input-natours w-full text-stone-600'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            className='btn-primary w-1/2 py-3 md:w-1/3'
            onClick={handleLogin}
            disabled={isAuthenticated}
          >
            {loading ? <Loader /> : 'Login'}
          </button>
        </div>
      </div>
    </section>
  );
}
