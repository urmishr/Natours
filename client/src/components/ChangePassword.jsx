import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { motion } from 'motion/react';

export default function ChangePassword() {
  const { error, loading, resetPassword, resetError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const location = useLocation();
  const { emailTyped } = location.state || '';
  const navigate = useNavigate();

  useEffect(
    function () {
      resetError();
      if (!emailTyped) {
        return navigate('/forgot-password/send-otp');
      }
    },
    [emailTyped, navigate],
  );

  function validateFields(password, confirmPassword) {
    let valid = true;

    // Password: required and min length 8
    if (!password) {
      setPasswordError(true);
      toast.error('Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(true);
      toast.error('Password must be at least 8 characters.');
      valid = false;
    } else {
      setPasswordError(false);
    }

    // Confirm Password: must match password
    if (!confirmPassword) {
      setConfirmPasswordError(true);
      toast.error('Confirm Password id required');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(true);
      toast.error('Passwords do not match.');
      valid = false;
    } else {
      setConfirmPasswordError(false);
    }

    return valid;
  }
  async function handleChangePassword() {
    if (!validateFields(password, confirmPassword)) return;

    const success = await resetPassword(emailTyped, password, confirmPassword);
    if (success) navigate('/login');
  }
  return (
    <section className='my-auto flex w-full flex-col md:items-center'>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className='mx-5 my-14 flex flex-col justify-between space-y-8 rounded-lg bg-white px-5 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'
      >
        <div className='flex items-center gap-3 space-y-1'>
          <h1 className='natours-gradient-text text-2xl font-bold'>
            Change your password
          </h1>
        </div>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='password' className='font-semibold text-stone-600'>
            New Password
          </label>
          <input
            type='password'
            className={`input-natours w-full text-stone-600 ${passwordError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='••••••••'
            name='password'
            value={password}
            onChange={(e) => {
              setPasswordError(false);
              setPassword(e.target.value.trim());
            }}
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <label
            htmlFor='confirm-password'
            className='font-semibold text-stone-600'
          >
            Confirm Password
          </label>
          <input
            type='password'
            className={`input-natours w-full text-stone-600 ${confirmPasswordError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='•••••••• '
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPasswordError(false);
              setConfirmPassword(e.target.value.trim());
            }}
          />
        </div>

        <p className='font-semibold text-red-400'>{error}</p>

        <div className='flex gap-3'>
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ type: 'keyframes', duration: 0.01 }}
            className='btn-primary w-1/2 px-4 py-3 text-xl'
            onClick={handleChangePassword}
          >
            {loading ? <Loader /> : 'Save'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ type: 'keyframes', duration: 0.01 }}
            className='border-natours w-1/2 rounded-full border-3 font-bold text-stone-800'
            onClick={() => navigate('/login')}
          >
            cancel
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
