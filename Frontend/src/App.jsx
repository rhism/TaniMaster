import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import KeuanganPage from './pages/Dashboard/KeuanganPage';
import InventarisPage from './pages/Dashboard/InventarisPage';
import ProduksiPage from './pages/Dashboard/ProduksiPage';
import PanduanPage from './pages/Dashboard/PanduanPage';
import PengaturanPage from './pages/Dashboard/PengaturanPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('tanimaster-token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/keuangan" element={<ProtectedRoute><KeuanganPage /></ProtectedRoute>} />
            <Route path="/inventaris" element={<ProtectedRoute><InventarisPage /></ProtectedRoute>} />
            <Route path="/produksi" element={<ProtectedRoute><ProduksiPage /></ProtectedRoute>} />
            <Route path="/panduan" element={<ProtectedRoute><PanduanPage /></ProtectedRoute>} />
            <Route path="/pengaturan" element={<ProtectedRoute><PengaturanPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
