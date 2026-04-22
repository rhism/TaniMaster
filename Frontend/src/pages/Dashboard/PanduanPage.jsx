import React, { useState } from "react";
import LayoutPanduan from "../../components/Layout/LayoutPanduan";
import { FaChevronDown, FaBook, FaQuestionCircle, FaShieldAlt, FaLeaf } from "react-icons/fa";

const AccordionItem = ({ title, subtitle, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <FaChevronDown size={14} className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-green-50 dark:border-gray-700">
          <div className="pt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const PanduanPage = () => {
  return (
    <LayoutPanduan>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaBook size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panduan Pengguna</h1>
              <p className="text-sm text-green-100">Pelajari cara menggunakan Tani Master dengan efektif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Items */}
      <AccordionItem
        title="Cara Menggunakan Tani Master"
        subtitle="Panduan lengkap fitur utama platform"
        icon={<FaLeaf size={15} />}
        defaultOpen={true}
      >
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">1</span>
            <span>Masuk ke akun Anda melalui halaman login, atau daftar jika belum memiliki akun.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">2</span>
            <span>Gunakan menu <strong>Dashboard</strong> sebagai pusat informasi dan manajemen tugas harian.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">3</span>
            <span>Catat seluruh transaksi keuangan di menu <strong>Keuangan</strong> — pemasukan, pengeluaran, pinjaman, dan modal.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">4</span>
            <span>Kelola stok bahan bibit dan bahan baku di menu <strong>Inventaris</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">5</span>
            <span>Monitor data tanam dan transaksi penjualan hasil panen di menu <strong>Produksi</strong>.</span>
          </li>
        </ul>
      </AccordionItem>

      <AccordionItem
        title="FAQ — Pertanyaan yang Sering Ditanyakan"
        subtitle="Jawaban atas pertanyaan umum pengguna"
        icon={<FaQuestionCircle size={15} />}
      >
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Apakah akan ada pembaruan fitur kedepannya?</p>
            <p>Ya! Kami terus mengembangkan Tani Master dengan menambahkan fitur baru, penyesuaian tampilan, dan peningkatan performa secara berkala.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Apakah data bisnis saya aman?</p>
            <p>Keamanan data pengguna adalah prioritas utama kami. Seluruh data disimpan secara aman dengan enkripsi dan tidak dibagikan kepada pihak ketiga.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Bagaimana cara mengekspor laporan?</p>
            <p>Setiap halaman data (Keuangan, Inventaris, Produksi) memiliki tombol Export PDF untuk mengunduh laporan.</p>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem
        title="Keamanan & Privasi"
        subtitle="Informasi perlindungan data Anda"
        icon={<FaShieldAlt size={15} />}
      >
        <div className="space-y-2">
          <p>Tani Master berkomitmen melindungi privasi dan keamanan data Anda. Beberapa langkah yang kami ambil:</p>
          <ul className="space-y-1.5 mt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
              Data tersimpan di database terenkripsi
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
              Autentikasi berbasis token JWT
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
              Dukungan login dengan Google OAuth
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
              Tidak ada data yang dijual ke pihak ketiga
            </li>
          </ul>
        </div>
      </AccordionItem>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800 px-5 py-4">
        <p className="text-sm text-green-700 dark:text-green-400 font-medium">
          Butuh bantuan lebih lanjut? Hubungi tim dukungan kami melalui halaman <strong>Kontak</strong> di landing page.
        </p>
      </div>
    </LayoutPanduan>
  );
};

export default PanduanPage;
