import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const mrName = localStorage.getItem('mrName');

  if (!isLoggedIn || !mrName) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
