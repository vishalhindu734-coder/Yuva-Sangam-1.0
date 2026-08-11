import React from 'react';
import { ActiveTab } from '../types';
import { Ticket, QrCode, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedPassesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedPassesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo / Title */}
          <div 
            onClick={() => setActiveTab('register')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-orange-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-updock font-bold text-amber-950 text-2xl sm:text-3xl leading-none">
                  Yuva Sangam
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black bg-amber-100 text-amber-800 border border-amber-200 px-1.5 sm:px-2 py-0.5 rounded-md">
                  2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-amber-900/80 font-bold tracking-wide hidden xs:block">
                <span className="font-rozha text-xs text-amber-900">युवा संगम</span> • Mathedi, Ambala
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <button
              id="nav-tab-register"
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/60'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            <button
              id="nav-tab-passes"
              onClick={() => setActiveTab('passes')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl transition-all relative ${
                activeTab === 'passes'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Passes</span>
              {savedPassesCount > 0 && (
                <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                  activeTab === 'passes' ? 'bg-orange-800 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {savedPassesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

