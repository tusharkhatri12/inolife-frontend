import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MRS = [
  { name: 'Davender Rawat', pin: '1111' },
  { name: 'Zaki Ahmed', pin: '2222' },
  { name: 'Admin', pin: '9999' }
];

export default function Login() {
  const [selectedUser, setSelectedUser] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }
    
    const user = MRS.find(m => m.name === selectedUser);
    if (user && user.pin === pin) {
       localStorage.setItem('isLoggedIn', 'true');
       localStorage.setItem('mrName', user.name);
       navigate('/');
    } else {
       setError('Invalid PIN');
    }
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-surface-container-low px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E9ECEF] w-full max-w-sm animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="text-center mb-8 mt-2">
          <div className="flex flex-col flex-wrap items-center justify-center pt-2">
            <div className="flex items-center font-sans tracking-tight text-[48px] font-bold leading-none mb-1">
              <span className="text-[#00AEEF]">In</span>
              <div className="relative mx-[2px] flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#00AEEF] mb-1">
                 <div className="absolute w-[8px] h-[8px] bg-white rounded-full bottom-[4px] right-[4px]"></div>
              </div>
              <span className="text-[#B2D235]">Life</span>
            </div>
            <span className="text-[14px] text-outline ml-2 tracking-wide font-light opacity-80">Better, Longer Lives</span>
          </div>
        </div>

        {error && <div className="p-3 mb-5 text-sm text-error bg-error/10 border border-error/20 rounded-xl font-medium text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-label-caps text-[11px] text-outline uppercase block ml-1 tracking-widest">Identify Yourself</label>
            <div className="relative">
              <select 
                value={selectedUser} 
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full h-14 px-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl appearance-none outline-primary/50 text-on-surface font-medium"
              >
                <option value="" disabled>Select MR Profile</option>
                <option value="Davender Rawat">Davender Rawat</option>
                <option value="Zaki Ahmed">Zaki Ahmed</option>
                <option value="Admin">Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-label-caps text-[11px] text-outline uppercase block ml-1 tracking-widest">Access PIN</label>
            <input 
              type="password"
              maxLength="4"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full h-14 px-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl outline-primary/50 text-on-surface font-medium tracking-widest font-mono text-lg"
              placeholder="••••"
            />
          </div>

          <button type="submit" className="w-full h-14 bg-primary text-white font-button rounded-xl active:scale-[0.98] transition-transform shadow flex items-center justify-center mt-4 tracking-wide hover:brightness-105">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
