import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import backgroundImage from '../assets/images/cabai.jpg';
import logo from '../assets/images/tanimasterlogo.svg';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoginUsername('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setForgotEmail('');
    setShowPassword(false);
    setToast(null);
  }, [mode]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const storeToken = (token) => {
    localStorage.setItem('tanimaster-token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        usernameOrEmail: loginUsername,
        password: loginPassword,
      });
      if (response.status === 200) {
        storeToken(response.data.token);
        showToast('Login berhasil! Mengalihkan...', 'success');
        setTimeout(() => navigate('/dashboard', { replace: true }), 800);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Username atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      });
      if (response.status === 201) {
        showToast('Registrasi berhasil! Silakan login.', 'success');
        setTimeout(() => setMode('login'), 1000);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Registrasi gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      showToast('Instruksi reset password telah dikirim ke email Anda jika terdaftar.', 'success');
    } catch (error) {
      showToast('Gagal memproses permintaan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/google', {
        credential: credentialResponse.credential,
      });
      if (response.status === 200) {
        storeToken(response.data.token);
        showToast('Login berhasil!', 'success');
        setTimeout(() => navigate('/dashboard', { replace: true }), 800);
      }
    } catch (error) {
      showToast('Login dengan Google gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <img src={logo} alt="Tani Master" className="w-24 h-24 mb-6 drop-shadow-xl" />
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Tani Master</h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-xs">
            Platform manajemen bisnis pertanian modern yang membantu petani Indonesia berkembang.
          </p>
          <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
            {[
              { icon: '🌱', label: 'Manajemen Inventaris' },
              { icon: '📊', label: 'Laporan Keuangan' },
              { icon: '🚜', label: 'Pantau Produksi' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white border-opacity-20">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-white font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden flex-col items-center mb-8">
            <img src={logo} alt="Tani Master" className="w-16 h-16 mb-2" />
            <span className="text-green-700 font-bold text-xl">Tani Master</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
            {toast && (
              <div className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                toast.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
                {toast.message}
              </div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Lupa Password</h2>
                <p className="text-gray-500 text-sm mb-7">
                  Masukkan email Anda dan kami akan mengirimkan instruksi reset password.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2 text-sm shadow-sm"
                  >
                    {loading ? 'Memproses...' : 'Kirim Instruksi Reset'}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Ingat password Anda?{' '}
                  <button onClick={() => setMode('login')} className="text-green-600 hover:text-green-700 font-semibold">
                    Kembali ke Login
                  </button>
                </p>
              </>
            )}

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat Datang!</h2>
                <p className="text-gray-500 text-sm mb-7">Masuk ke akun Anda untuk melanjutkan</p>

                <div className="mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showToast('Login Google gagal. Coba lagi.')}
                    width="100%"
                    text="signin_with"
                    shape="rectangular"
                    theme="outline"
                    locale="id"
                  />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">atau dengan email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username atau Email</label>
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      placeholder="Masukkan username atau email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="Masukkan password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        Lupa Password?
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2 text-sm shadow-sm"
                  >
                    {loading ? 'Memproses...' : 'Masuk'}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Belum punya akun?{' '}
                  <button onClick={() => setMode('register')} className="text-green-600 hover:text-green-700 font-semibold">
                    Daftar sekarang
                  </button>
                </p>
              </>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Buat Akun Baru</h2>
                <p className="text-gray-500 text-sm mb-7">Daftarkan diri Anda untuk mulai menggunakan Tani Master</p>

                <div className="mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showToast('Login Google gagal. Coba lagi.')}
                    width="100%"
                    text="signup_with"
                    shape="rectangular"
                    theme="outline"
                    locale="id"
                  />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">atau dengan email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      placeholder="Pilih username Anda"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      placeholder="Masukkan email Anda"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      placeholder="Buat password Anda"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2 text-sm shadow-sm"
                  >
                    {loading ? 'Memproses...' : 'Daftar Sekarang'}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Sudah punya akun?{' '}
                  <button onClick={() => setMode('login')} className="text-green-600 hover:text-green-700 font-semibold">
                    Masuk di sini
                  </button>
                </p>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">© 2024 Tani Master. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
