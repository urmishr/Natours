import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import validator from 'validator';
import { useAuth } from '../context/AuthProvider';
import Loader from './Loader';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [preview, setPreview] = useState(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  // Error states
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  function validateFields(fullName, email, password, confirmPassword) {
    let valid = true;

    // Full Name: required, at least 2 words
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setFullNameError(true);
      toast.error('Please enter your full name .');
      valid = false;
    } else {
      setFullNameError(false);
    }

    // Email: required and valid format
    if (!email) {
      setEmailError(true);
      toast.error('Email is required.');
      valid = false;
    } else if (!validator.isEmail(email)) {
      setEmailError(true);
      toast.error('Invalid email format.');
      valid = false;
    } else {
      setEmailError(false);
    }

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

  async function handleSignup(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (photo) {
      formData.append('photo', photo);
    }
    console.log(formData);

    if (validateFields(fullName, email, password, confirmPassword)) {
      await signup(formData);
      navigate('/tours');
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file.type.split('/')[1]);
    if (file.type.split('/')[1] !== 'jpeg' && file.type.split('/')[1] !== 'png')
      return toast.error('Please Upload Jpeg or Png image only!');
    console.log(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setPhoto(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <section className='my-10 flex w-full flex-col md:items-center'>
      <form onSubmit={handleSignup}>
        <div className='mx-5 flex flex-col justify-between space-y-8 rounded-lg bg-white px-5 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'>
          <div className='flex flex-col space-y-1'>
            <h1 className='natours-gradient-text text-2xl font-bold'>
              Register your Account
            </h1>
            <NavLink to='/login' className='font-semibold text-stone-600'>
              <span className='mr-2 text-stone-800/50'>
                Already have an Account?
              </span>
              Login
            </NavLink>
          </div>
          <div className='flex flex-col space-y-3'>
            <label htmlFor='email' className='font-semibold text-stone-600'>
              Full Name
            </label>
            <input
              type='text'
              className={`input-natours w-full text-stone-600 ${fullNameError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
              placeholder='John Doe'
              name='name'
              value={fullName}
              onChange={(e) => {
                setFullNameError(false);
                setFullName(e.target.value);
              }}
            />
          </div>
          <div className='flex flex-col space-y-3'>
            <label htmlFor='email' className='font-semibold text-stone-600'>
              Email Address
            </label>
            <input
              type='text'
              className={`input-natours w-full text-stone-600 ${emailError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
              placeholder='you@example.com'
              name='email'
              value={email}
              onChange={(e) => {
                setEmailError(false);
                setEmail(e.target.value);
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
          <div className='flex flex-col space-y-3'>
            <input
              type='file'
              id='photo-upload'
              accept='image/*'
              name='photo'
              className='hidden'
              onChange={handleFileChange}
            />
            {/* Preview circle */}
            {preview && (
              <label
                htmlFor='photo-upload'
                className='font-semibold text-stone-600'
              >
                Click to choose different photo
              </label>
            )}
            <label
              htmlFor='photo-upload'
              className='hover:border-natours relative size-20 cursor-pointer rounded-full border-3 border-stone-300 bg-stone-100 p-1 transition-colors md:size-24 lg:size-26'
            >
              {preview ? (
                <img
                  src={preview}
                  alt='Profile Preview'
                  className='h-full w-full rounded-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <span className='text-center text-sm text-stone-600 select-none'>
                    Choose Photo
                  </span>
                </div>
              )}
            </label>
          </div>
          <div>
            <button className='btn-primary w-1/2 py-3 md:w-1/3'>
              {loading ? <Loader /> : 'Signup'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
