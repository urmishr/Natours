import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Signup() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <section className='my-10 flex w-full flex-col md:items-center'>
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
            Email Address
          </label>
          <input
            type='text'
            className='input-natours w-full'
            placeholder='you@example.com'
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='password' className='font-semibold text-stone-600'>
            Password
          </label>
          <input
            type='password'
            className='input-natours w-full'
            placeholder='••••••••'
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
            className='input-natours w-full'
            placeholder='••••••••'
          />
        </div>
        <div className='flex flex-col space-y-3'>
          <input
            type='file'
            id='photo-upload'
            accept='image/*'
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
            className='hover:border-natours relative size-20 cursor-pointer rounded-full border-3 border-stone-300 bg-stone-100 p-1 transition-colors lg:size-26'
          >
            {preview ? (
              <img
                src={preview}
                alt='Profile Preview'
                className='h-full w-full rounded-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-stone-400'>
                <span className='text-center text-sm select-none'>
                  Choose Photo
                </span>
              </div>
            )}
          </label>
        </div>
        <div>
          <button className='btn-primary w-1/2 py-3 md:w-1/3'>Register</button>
        </div>
      </div>
    </section>
  );
}
