import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import tmlogo from "../../assets/images/logo.svg";
import { FaBars, FaTimes, FaThLarge, FaWallet, FaBox, FaTruck, FaBook, FaCog, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const navMain = [
  { to: "/dashboard", icon: <FaThLarge />, label: "Dashboard" },
  { to: "/keuangan", icon: <FaWallet />, label: "Keuangan" },
  { to: "/inventaris", icon: <FaBox />, label: "Inventaris" },
  { to: "/produksi", icon: <FaTruck />, label: "Produksi" },
];

const navBottom = [
  { to: "/panduan", icon: <FaBook />, label: "Panduan" },
  { to: "/pengaturan", icon: <FaCog />, label: "Pengaturan" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (!window.confirm("Apakah Anda yakin ingin keluar?")) return;
    localStorage.removeItem("tanimaster-token");
    navigate("/", { replace: true });
  };

  const close = () => setOpen(false);

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          isActive
            ? "bg-green-600 text-white shadow-md shadow-green-200"
            : "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-green-100 dark:border-gray-700 text-green-700 dark:text-green-400"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={close}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-56 bg-white dark:bg-gray-900 border-r border-green-100 dark:border-gray-700 shadow-xl z-40 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-center py-5 px-4 border-b border-green-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
          <img src={tmlogo} alt="Tani Master" className="h-10" />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navMain.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-green-100 dark:border-gray-700 space-y-1">
          {navBottom.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm w-full text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200"
          >
            {isDark ? <FaSun size={14} className="text-yellow-400" /> : <FaMoon size={14} />}
            {isDark ? "Mode Terang" : "Mode Gelap"}
          </button>

          <button
            onClick={() => { close(); handleLogout(); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <FaSignOutAlt className="text-base" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
