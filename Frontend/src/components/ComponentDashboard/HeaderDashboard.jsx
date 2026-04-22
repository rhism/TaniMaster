import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaEdit, FaLeaf } from 'react-icons/fa';

const HeaderDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Rico");
  const [profilePicture, setProfilePicture] = useState("https://i.pravatar.cc/150?u=a04258114e29026708c");
  const [date, setDate] = useState(new Date());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicture(URL.createObjectURL(file));
  };

  const formattedDate = date.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Profile Panel */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 md:p-6 flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 md:w-52 md:rounded-r-3xl flex-shrink-0">
            <div className="relative">
              <img src={profilePicture} alt="Profile"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-white/40 shadow-lg" />
              <button onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-green-600 hover:text-green-800 transition-colors"
                title="Edit Profil">
                <FaEdit size={11} />
              </button>
            </div>
            <div className="text-white md:text-center">
              <p className="text-xs font-medium text-green-100 mb-0.5">Petani Terdaftar</p>
              <h2 className="font-bold text-lg leading-tight">{name}</h2>
            </div>
          </div>

          {/* Welcome Panel */}
          <div className="flex-1 px-5 py-5 md:px-8 md:py-6 flex flex-col justify-center">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">{formattedDate}</p>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {getGreeting()}, <span className="text-green-600 dark:text-green-400">{name}!</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">Semangat mengelola bisnis pertanian Anda hari ini. Pantau aktivitas dan kelola tugas dengan mudah.</p>
            <div className="flex items-center gap-2 mt-4 bg-green-50 dark:bg-green-900/30 rounded-xl px-3 py-2 w-fit">
              <FaLeaf className="text-green-500 text-xs" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Tani Master — Solusi Cerdas Agribisnis</span>
            </div>
          </div>

          {/* Calendar — desktop only */}
          <div className="hidden lg:flex items-center justify-center px-4 py-4 border-l border-green-50 dark:border-gray-700">
            <Calendar onChange={setDate} value={date}
              className="!border-0 !shadow-none !rounded-xl !bg-transparent text-sm dark:!bg-transparent" />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Edit Profil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nama</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Masukkan nama..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Foto Profil</label>
                <input type="file" accept="image/*" onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 dark:file:bg-green-900/30 file:text-green-700 dark:file:text-green-400 file:font-medium hover:file:bg-green-100" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderDashboard;
