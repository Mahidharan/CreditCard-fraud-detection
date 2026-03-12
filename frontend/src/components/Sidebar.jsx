import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, History, BarChart2, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'New Transaction', path: '/transaction/new', icon: <FilePlus size={20} /> },
    { name: 'History', path: '/transactions', icon: <History size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <ShieldAlert className="text-blue-500" size={28} />
        <span className="text-xl font-bold">FraudGuard API</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-500 text-center">
        Powered by KNN Algorithm
      </div>
    </div>
  );
};

export default Sidebar;
