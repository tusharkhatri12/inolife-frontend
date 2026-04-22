import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-20">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-[#E9ECEF] dark:border-slate-800 flex justify-between items-center h-14 px-4 w-full fixed top-0 z-40 shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
            <img alt="Representative Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQNEzqeAWR_MZPHVRp6SWcqlanlsZ1rHYMRctwPz8A0oEs9T77q4HNSKkRT_xtZW5PUi5SCDd8S-iZ-73LIOWBhm4AzU3iKViP5Fu4gRu_i4RNALZWhkc0j2HAqjQZ65QjbAriRwGcykLG3p2bDX6a_PzeZqXFV3inRH5Hlz4CulHaoQvd6l0BycHpOo0Kfqi2-F1DYCOEUOBnqt1wISpkHK_2Bf82tMNEL0SAbndqD7-dvGHyEN8VAB4aJtKABv3sYjfIB99wYx0"/>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-center mt-1">
            <div className="flex items-center font-sans tracking-tight text-[26px] font-bold leading-none">
              <span className="text-[#00AEEF]">In</span>
              <div className="relative mx-[1px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#00AEEF] mb-1">
                 <div className="absolute w-[5px] h-[5px] bg-white rounded-full bottom-[2.5px] right-[2.5px]"></div>
              </div>
              <span className="text-[#B2D235]">Life</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('mrName');
                window.location.href = '/login';
             }}
             className="active:opacity-70 transition-all duration-150 text-error bg-error/10 rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-white dark:bg-slate-900 border-t border-[#E9ECEF] dark:border-slate-800">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-400 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Schedule</span>
        </NavLink>
        <NavLink to="/add-order" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-400 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined">package_2</span>
          <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Inventory</span>
        </NavLink>
        <NavLink to="/add-visit" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-400 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Visits</span>
        </NavLink>
        <NavLink to="/follow-ups" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-400 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Account</span>
        </NavLink>
      </nav>
    </div>
  );
}
