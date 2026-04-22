import React from 'react';

export default function Loader({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
    </div>
  );
}
