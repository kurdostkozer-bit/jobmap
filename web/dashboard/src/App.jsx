import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './features/auth/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { MapHomePage } from './pages/MapHomePage';

// SPA router configuration
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from localStorage on app initialization
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employer/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
