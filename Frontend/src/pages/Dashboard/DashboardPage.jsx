import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../../components/Layout/LayoutDashboard";
import HeaderDashboard from "../../components/ComponentDashboard/HeaderDashboard";
import ToDo from "../../components/ComponentDashboard/ToDo";
import { FaWallet, FaBox, FaTruck, FaChartLine } from "react-icons/fa";

const QuickCard = ({ icon, title, desc, to, gradient }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)}
      className={`${gradient} rounded-2xl p-4 text-left text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 w-full`}>
      <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl w-fit mb-3">{icon}</div>
      <p className="font-bold text-base">{title}</p>
      <p className="text-xs text-white/80 mt-0.5">{desc}</p>
    </button>
  );
};

const DashboardPage = () => {
  return (
    <LayoutDashboard>
      <HeaderDashboard />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickCard icon={<FaWallet size={16} />} title="Keuangan" desc="Pemasukan & pengeluaran" to="/keuangan" gradient="bg-gradient-to-br from-green-500 to-green-600" />
        <QuickCard icon={<FaBox size={16} />} title="Inventaris" desc="Benih & bahan baku" to="/inventaris" gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <QuickCard icon={<FaTruck size={16} />} title="Produksi" desc="Monitor hasil panen" to="/produksi" gradient="bg-gradient-to-br from-teal-500 to-teal-600" />
        <QuickCard icon={<FaChartLine size={16} />} title="Penjualan" desc="Riwayat transaksi" to="/produksi" gradient="bg-gradient-to-br from-cyan-500 to-cyan-600" />
      </div>
      <ToDo />
    </LayoutDashboard>
  );
};

export default DashboardPage;
