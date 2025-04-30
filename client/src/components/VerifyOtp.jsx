import { useAuth } from '../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';

import Loader from './Loader';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import OtpInput from './otpInputs';
import { motion } from 'motion/react';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const { error, loading, verifyOtp, resetError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { emailTyped } = location.state || '';
  console.log(emailTyped);

  useEffect(
    function () {
      if (isAuthenticated) return navigate('/account');
      resetError();
      if (!emailTyped) {
        return navigate('/forgot-password/send-otp');
      }
    },
    [emailTyped, navigate],
  );
  // console.log(otp);

  function onOtpSubmit(otp) {
    setOtp(otp);
  }

  async function handleVerifyOtp() {
    resetError();

    if (otp.length < 6 || !otp)
      return toast.error('Please Provide 6 digits otp!');

    const success = await verifyOtp(otp, emailTyped);
    if (success)
      navigate('/forgot-password/reset-password', {
        state: { emailTyped },
      });
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
          <IoArrowBackCircle
            className='text-natours m-0 size-7'
            onClick={() => navigate(-1)}
          />

          <h1 className='natours-gradient-text text-2xl font-bold'>
            Verify your OTP
          </h1>
        </div>
        <div className='flex flex-col space-y-5'>
          <div>
            <label htmlFor='email' className='font-semibold text-stone-600'>
              Enter your Otp
            </label>
          </div>
          <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
        </div>

        <p className='font-semibold text-red-400'>{error}</p>

        <div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ type: 'keyframes', duration: 0.01 }}
            className='btn-primary w-1/2 py-3 md:w-1/3'
            onClick={handleVerifyOtp}
          >
            {loading ? <Loader /> : 'Verify'}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
