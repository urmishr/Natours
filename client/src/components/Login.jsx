import { NavLink } from 'react-router-dom';

export default function Login() {
  return (
    <section className='my-auto flex w-full flex-col md:items-center'>
      <div className='mx-5 mt-14 flex flex-col justify-between space-y-8 rounded-lg bg-white px-5 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'>
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
        <div>
          <button className='btn-primary w-1/2 py-3 md:w-1/3'>Login</button>
        </div>
      </div>
    </section>
  );
}
