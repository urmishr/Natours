import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';
import validator from 'validator';
import toast from 'react-hot-toast';
import Loader from './Loader';

export default function ForgotPassword() {
  const { loading, sendOtp, error, resetError } = useAuth();
  const location = useLocation();
  const { emailTyped } = location.state || '';
  const [emailError, setEmailError] = useState(false);

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(
    function () {
      resetError();
      if (emailTyped) setEmail(emailTyped.trim());
    },
    [emailTyped],
  );

  async function handleSendOtp() {
    if (!validator.isEmail(email)) {
      toast.error('Please enter valid email address!');
      return setEmailError(true);
    }
    const success = await sendOtp(email);
    if (!success) return;

    navigate('/forgot-password/verify-otp', { state: { emailTyped: email } });
  }

  return (
    <section className='my-auto flex w-full flex-col md:items-center'>
      <div className='mx-5 my-14 flex flex-col justify-between space-y-8 rounded-lg bg-white px-5 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'>
        <div className='flex items-center gap-3 space-y-1'>
          <IoArrowBackCircle
            className='text-natours m-0 size-7'
            onClick={() => navigate(-1)}
          />

          <h1 className='natours-gradient-text text-2xl font-bold'>
            Send Verification Code.
          </h1>
        </div>
        <div className='flex flex-col space-y-3'>
          <div>
            <label htmlFor='email' className='font-semibold text-stone-600'>
              Enter your Email Address.
            </label>
          </div>
          <input
            type='text'
            className={`input-natours w-full text-stone-600 ${emailError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
            placeholder='you@example.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.trim());
              setEmailError(false);
            }}
          />
        </div>
        <p className='font-semibold text-red-400'>{error}</p>
        {error && (
          <NavLink
            to='/forgot-password/verify-otp'
            className='text-natours font-semibold'
            state={{ emailTyped: email }}
          >
            Already Have an Otp? Click here
          </NavLink>
        )}

        <div>
          <button
            className='btn-primary w-1/2 py-3 md:w-1/3'
            onClick={handleSendOtp}
          >
            {loading ? <Loader /> : 'Send OTP'}
          </button>
        </div>
      </div>
    </section>
  );
}
