import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

const LayoutDashboard = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 md:ml-56 pt-16 md:pt-0 px-3 py-3 md:px-5 md:py-5 gap-4 flex flex-col min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutDashboard;
