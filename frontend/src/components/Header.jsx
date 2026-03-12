import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-8 py-4">
        <h2 className="text-xl font-semibold text-slate-800">Credit Card Fraud Detection</h2>
        
        <div className="flex items-center space-x-6">
          <button className="text-slate-500 hover:text-blue-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 transform -translate-y-1 translate-x-1"></span>
          </button>
          
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer group">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Admin User</p>
              <p className="text-xs text-slate-500">System Operator</p>
            </div>
            <UserCircle size={36} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
