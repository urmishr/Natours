import { useEffect, useRef, useState } from 'react';

const OtpInput = ({ length, onOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Automatically focus on the first input box when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, i) => {
    const value = e.target.value;

    // Allow only numeric input
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[i] = value.substring(value.length - 1); // Take only the last character
    setOtp(newOtp);

    // Automatically move to the next input box if a digit is entered
    if (value && i < length - 1 && inputRefs.current[i + 1]) {
      inputRefs.current[i + 1].focus();
    }

    // Submit OTP if all boxes are filled
    const combinedOtp = newOtp.join('');

    onOtpSubmit(combinedOtp);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[i] = ''; // Clear the current box
      setOtp(newOtp);

      // Move to the previous input box if it exists
      if (i > 0 && inputRefs.current[i - 1]) {
        inputRefs.current[i - 1].focus();
      }
    }
  };

  const handleClick = (i) => {
    // Focus on the clicked input box
    if (inputRefs.current[i]) {
      inputRefs.current[i].focus();
    }
  };

  return (
    <div className='flex justify-between gap-2'>
      {otp.map((value, i) => (
        <input
          key={i}
          ref={(input) => (inputRefs.current[i] = input)}
          value={value}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onClick={() => handleClick(i)}
          type='tel'
          maxLength='1' // Restrict input to a single character
          className='border-natours focus:ring-natours h-10 w-10 rounded bg-stone-200/70 text-center font-bold text-stone-700 outline-none focus:ring-3 md:h-14 md:w-14'
        />
      ))}
    </div>
  );
};

export default OtpInput;
