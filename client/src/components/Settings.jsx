import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import { MdOutlineSecurity } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

export default function Settings() {
  const [setting, setSetting] = useState('profile');

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='my-4 flex space-x-5 rounded-full bg-white p-3 shadow-md'>
        <button
          className={`text-natours flex items-center gap-2 ${setting === 'profile' ? 'bg-natours flex items-center gap-2 rounded-full px-3 py-0.5 text-white shadow-md' : ''}`}
          onClick={() => setSetting('profile')}
        >
          <span>
            <CgProfile />
          </span>
          Profile
        </button>
        <button
          className={`text-natours flex items-center gap-2 ${setting === 'security' ? 'bg-natours rounded-full px-3 py-0.5 text-white shadow-md' : ``}`}
          onClick={() => setSetting('security')}
        >
          <span>
            <MdOutlineSecurity />
          </span>
          Security
        </button>
      </div>
      {setting === 'profile' && <ProfileSettings />}
      {setting === 'security' && <SecuritySettings />}
    </div>
  );
}
