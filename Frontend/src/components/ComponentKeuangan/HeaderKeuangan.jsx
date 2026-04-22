import React from "react";
import { FaArrowUp, FaArrowDown, FaHandHoldingUsd, FaSeedling, FaBalanceScale } from "react-icons/fa";

const StatCard = ({ label, value, icon, colorClass, bgClass }) => (
  <div className={`${bgClass} rounded-2xl p-4 flex items-center gap-4`}>
    <div className={`${colorClass} p-3 rounded-xl bg-white/30`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-white/80 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-white">Rp {value.toLocaleString("id-ID")}</p>
    </div>
  </div>
);

const HeaderKeuangan = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-green-50 dark:border-gray-700 flex items-center gap-2.5">
        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
          <FaBalanceScale size={16} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">Ringkasan Keuangan</h2>
          <p className="text-xs text-gray-400">Overview keuangan usaha tani Anda</p>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
        <StatCard
          label="Total Pendapatan"
          value={summary.totalPendapatan}
          icon={<FaArrowUp size={16} className="text-white" />}
          bgClass="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          label="Total Pengeluaran"
          value={summary.totalPengeluaran}
          icon={<FaArrowDown size={16} className="text-white" />}
          bgClass="bg-gradient-to-br from-red-400 to-red-500"
        />
        <StatCard
          label="Total Pinjaman"
          value={summary.totalPinjaman}
          icon={<FaHandHoldingUsd size={16} className="text-white" />}
          bgClass="bg-gradient-to-br from-yellow-400 to-orange-400"
        />
        <StatCard
          label="Total Modal"
          value={summary.totalModal}
          icon={<FaSeedling size={16} className="text-white" />}
          bgClass="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>
      <div className="mx-5 mb-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-green-100 mb-0.5">Total Saldo</p>
          <p className="text-2xl font-bold text-white">Rp {summary.totalSaldo.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3">
          <FaBalanceScale size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default HeaderKeuangan;
