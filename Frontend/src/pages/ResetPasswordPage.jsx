import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/tanimasterlogo.svg';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      showToast('Password tidak cocok.');
      return;
    }
    if (password.length < 8) {
      showToast('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      showToast('Password berhasil diperbarui! Silakan login.', 'success');
      setTimeout(() => navigate('/auth', { replace: true }), 2000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full text-center">
          <img src={logo} alt="Tani Master" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Link Tidak Valid</h2>
          <p className="text-gray-500 text-sm mb-6">Link reset password tidak valid atau sudah kedaluwarsa.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Tani Master" className="w-16 h-16 mb-2" />
          <span className="text-green-700 font-bold text-xl">Tani Master</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
          {toast && (
            <div className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
              {toast.message}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Buat Password Baru</h2>
          <p className="text-gray-500 text-sm mb-7">Masukkan password baru Anda di bawah ini.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-green-600 font-medium">
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 8 karakter"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Ulangi password baru"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2 text-sm shadow-sm"
            >
              {loading ? 'Memproses...' : 'Simpan Password Baru'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            <button onClick={() => navigate('/auth')} className="text-green-600 hover:text-green-700 font-semibold">
              Kembali ke Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
