import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPengaturan from "../../components/Layout/LayoutPengaturan";
import { FaUser, FaLanguage, FaPlug, FaCreditCard, FaCog, FaCheck, FaLock } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-green-50 dark:border-gray-700">
      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
        {icon}
      </div>
      <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InputField = ({ label, helpText, readOnly, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors ${
        readOnly
          ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
          : 'bg-white dark:bg-gray-700'
      }`}
    />
    {helpText && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helpText}</p>}
  </div>
);

const PengaturanPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    business_name: '',
    username: '',
  });

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('tanimaster-token');
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          business_name: data.business_name || '',
          username: data.username || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('tanimaster-token');
      await axios.put('/api/auth/profile', {
        full_name: profile.full_name,
        phone: profile.phone,
        business_name: profile.business_name,
        username: profile.username,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      showToast('Profil berhasil disimpan!', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      showToast('Gagal menyimpan profil. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <LayoutPengaturan>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaCog size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Pengaturan</h1>
              <p className="text-sm text-green-100">Kelola preferensi dan informasi akun Anda</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              saved
                ? "bg-white text-green-600"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {saved ? <><FaCheck size={13} /> Tersimpan!</> : saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
          toast.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          {toast.message}
        </div>
      )}

      {/* Akun Pribadi */}
      <Section title="Akun Pribadi" icon={<FaUser size={15} />}>
        {loading ? (
          <div className="text-center py-4 text-sm text-gray-400 dark:text-gray-500">Memuat data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap..."
              value={profile.full_name}
              onChange={handleChange('full_name')}
            />
            <InputField
              label="Alamat Email"
              type="email"
              value={profile.email}
              readOnly
              helpText="Email tidak dapat diubah melalui halaman ini."
            />
            <InputField
              label="Username"
              type="text"
              placeholder="Username Anda..."
              value={profile.username}
              onChange={handleChange('username')}
            />
            <InputField
              label="Nomor Telepon"
              type="tel"
              placeholder="+62..."
              value={profile.phone}
              onChange={handleChange('phone')}
            />
            <InputField
              label="Nama Usaha"
              type="text"
              placeholder="Nama usaha tani Anda..."
              value={profile.business_name}
              onChange={handleChange('business_name')}
              className="md:col-span-2"
            />
          </div>
        )}
      </Section>

      {/* Keamanan */}
      <Section title="Keamanan & Privasi" icon={<FaLock size={15} />}>
        <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="text-amber-500 mt-0.5">
            <FaLock size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Ubah Password</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Untuk keamanan, perubahan password dilakukan melalui alur verifikasi email. Klik tombol di bawah untuk keluar dan menggunakan fitur "Lupa Password" di halaman login.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('tanimaster-token');
                navigate('/auth', { replace: true });
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Ke Halaman Login — Lupa Password
            </button>
          </div>
        </div>
      </Section>

      {/* Preferensi */}
      <Section title="Preferensi" icon={<FaLanguage size={15} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bahasa</label>
            <select className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option>Bahasa Indonesia</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema Tampilan</p>
            <div className="flex gap-3">
              <button
                onClick={() => isDark && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  !isDark
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300"
                }`}
              >
                ☀️ Mode Terang
              </button>
              <button
                onClick={() => !isDark && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  isDark
                    ? "border-green-500 bg-green-900/30 text-green-400"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300"
                }`}
              >
                🌙 Mode Gelap
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Integrasi */}
      <Section title="Integrasi" icon={<FaPlug size={15} />}>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Hubungkan layanan pihak ketiga untuk pengalaman yang lebih baik.</p>
        <div className="space-y-2">
          {[
            { name: "Google Workspace", desc: "Sinkronisasi kalender dan dokumen" },
            { name: "WhatsApp Business", desc: "Notifikasi transaksi via WhatsApp" },
            { name: "Marketplace", desc: "Integrasi platform penjualan online" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-500 transition-colors">
                Segera Hadir
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Langganan */}
      <Section title="Langganan & Pembayaran" icon={<FaCreditCard size={15} />}>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white mb-4">
          <p className="text-xs font-medium text-green-100 mb-1">Paket Aktif</p>
          <p className="text-xl font-bold">Tani Master Free</p>
          <p className="text-sm text-green-100 mt-1">Akses fitur dasar tanpa batas waktu</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Upgrade ke Tani Master Pro untuk fitur analitik lanjutan, laporan otomatis, dan prioritas dukungan.</p>
        <button className="mt-3 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-green-200">
          Segera Hadir
        </button>
      </Section>
    </LayoutPengaturan>
  );
};

export default PengaturanPage;
