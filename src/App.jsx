import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeScreen from './pages/HomeScreen';
import AddVisit from './pages/AddVisit';
import AddOrder from './pages/AddOrder';
import FollowUps from './pages/FollowUps';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import MyVisits from './pages/MyVisits';
import DoctorHistory from './pages/DoctorHistory';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout><HomeScreen /></Layout></ProtectedRoute>} />
        <Route path="/add-visit" element={<ProtectedRoute><Layout><AddVisit /></Layout></ProtectedRoute>} />
        <Route path="/add-order" element={<ProtectedRoute><Layout><AddOrder /></Layout></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><Layout><MyOrders /></Layout></ProtectedRoute>} />
        <Route path="/my-visits" element={<ProtectedRoute><Layout><MyVisits /></Layout></ProtectedRoute>} />
        <Route path="/doctor-history" element={<ProtectedRoute><Layout><DoctorHistory /></Layout></ProtectedRoute>} />
        <Route path="/follow-ups" element={<ProtectedRoute><Layout><FollowUps /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
