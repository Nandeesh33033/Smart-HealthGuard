import React from 'react';
import { Activity, Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-500 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart HealthGuard</h1>
            <p className="text-xs text-slate-500 font-medium">AI-Powered Wellness Assistant</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-600">
          <span className="flex items-center"><Heart className="w-4 h-4 mr-1 text-rose-500 fill-current" /> System Online</span>
          <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">v1.0.0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;