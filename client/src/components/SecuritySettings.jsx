import { useState } from 'react';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import Loader from './Loader';

export default function SecuritySettings() {
  const { loading, changePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const [passwordError, setPasswordError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  function validateFields(currentPassword, password, confirmPassword) {
    let valid = true;

    // Current Password: required
    if (!currentPassword) {
      setCurrentPasswordError(true);
      toast.error('Current password is required.');
      valid = false;
    } else {
      setCurrentPasswordError(false);
    }

    // Password: required and min length 8
    if (!password) {
      setPasswordError(true);
      toast.error('New password is required.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(true);
      toast.error('New password must be at least 8 characters.');
      valid = false;
    } else {
      setPasswordError(false);
    }

    // Confirm Password: must match password
    if (!confirmPassword) {
      setConfirmPasswordError(true);
      toast.error('Confirm password is required.');
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

  function resetFields() {
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (validateFields(currentPassword, password, confirmPassword)) {
      await changePassword(currentPassword, password, confirmPassword);

      resetFields();
    }
  }

  return (
    <form className='w-full md:w-3/4 lg:w-1/2' onSubmit={handleChangePassword}>
      <div className='my-7 flex flex-col justify-between space-y-8 rounded-lg bg-white px-6 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'>
        <div className='flex flex-col space-y-1'>
          <h1 className='natours-gradient-text text-2xl font-bold'>
            Change Your Password
          </h1>
        </div>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='password' className='font-semibold text-stone-600'>
            Current Password
          </label>
          <input
            type='password'
            className={`input-natours w-full text-stone-600 ${currentPasswordError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='••••••••'
            value={currentPassword}
            onChange={(e) => {
              setCurrentPasswordError(false);
              setCurrentPassword(e.target.value);
            }}
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='password' className='font-semibold text-stone-600'>
            Password
          </label>
          <input
            type='password'
            className={`input-natours w-full text-stone-600 ${passwordError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='••••••••'
            name='password'
            value={password}
            onChange={(e) => {
              setPasswordError(false);
              setPassword(e.target.value);
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
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        <div>
          <button
            className='btn-primary w-1/2 py-3 md:w-1/3'
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? <Loader /> : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
