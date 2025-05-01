import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import validator from 'validator';
import Loader from './Loader';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileSettings() {
  const { loading, user, changeProfile } = useAuth();
  const [isChanged, setIsChanged] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);

  const [preview, setPreview] = useState(null);

  useEffect(
    function () {
      setName(user.name);
      setEmail(user.email);
      const url = `/img/users/${user.photo}`;
      setPreview(url);
    },
    [user],
  );

  function validateFields(fullName, email) {
    let valid = true;
    if (!email) {
      setEmailError(true);
      valid = false;
    } else if (!validator.isEmail(email)) {
      setEmailError(true);
      toast.error('Incorrect email address format!');
      valid = false;
    }

    if (!fullName.trim()) {
      setFullNameError(true);
      toast.error('Please enter your full name .');
      valid = false;
    } else {
      setFullNameError(false);
    }

    return valid;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file.type.split('/')[1] !== 'jpeg' && file.type.split('/')[1] !== 'png')
      return toast.error('Please Upload Jpeg or Png image only!');

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setPhoto(file);
    } else {
      setPreview(null);
    }
  };

  async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!validateFields(name, email)) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    await changeProfile(formData);
  }

  useEffect(() => {
    // Check if any field has changed compared to the original user data
    const hasChanged =
      name !== user.name || email !== user.email || photo !== null;
    setIsChanged(hasChanged);
  }, [name, email, photo, user]);

  return (
    <form className='w-full md:w-3/4 lg:w-1/2' onSubmit={handleProfileUpdate}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className='my-7 flex flex-col justify-between space-y-8 rounded-lg bg-white px-6 py-7 shadow-lg md:min-w-[600px] md:p-13 md:shadow-xl'
        >
          <div className='flex flex-col space-y-1'>
            <h1 className='natours-gradient-text text-2xl font-bold'>
              Change Your Profile
            </h1>
          </div>
          <div className='flex flex-col space-y-3'>
            <div>
              <label htmlFor='email' className='font-semibold text-stone-600'>
                Full Name
              </label>
            </div>
            <input
              type='text'
              className={`input-natours w-full text-stone-600 ${fullNameError ? 'border-3 border-red-400 focus:ring-0' : ''}`}
              placeholder='John Doe'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFullNameError(false);
              }}
            />
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
              className='hover:border-natours relative size-20 cursor-pointer rounded-full border-3 border-stone-300 bg-stone-100 p-1 transition-colors lg:size-26'
            >
              {preview ? (
                <img
                  src={preview ? preview : `/img/users/${user.photo}`}
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
            <button
              className='btn-primary w-1/2 py-3 disabled:cursor-not-allowed md:w-1/3'
              onClick={handleProfileUpdate}
              disabled={loading || !isChanged}
            >
              {loading ? <Loader /> : 'Save'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
