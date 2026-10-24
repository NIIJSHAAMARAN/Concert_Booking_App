import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Concerts       from './pages/Concerts';
import ConcertDetail  from './pages/ConcertDetail';
import MyBookings     from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/concerts"     element={<Concerts />} />
          <Route path="/concerts/:id" element={<ConcertDetail />} />
          <Route path="/my-bookings"  element={
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          } />
          <Route path="/admin"        element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1c1c27',
            color: '#ededf2',
            border: '1px solid rgba(255,255,255,0.13)',
            fontSize: '13.5px',
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#3ddc84', secondary: '#1c1c27' } },
          error:   { iconTheme: { primary: '#ff5959', secondary: '#1c1c27' } },
        }}
      />
    </BrowserRouter>
  </AuthProvider>
);

export default App;