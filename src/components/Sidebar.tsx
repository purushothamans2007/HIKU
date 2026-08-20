import React from 'react';
import { ScreenType } from '../types';
import { Map, AlertTriangle, Wrench, BarChart3, Plus, HelpCircle, LogOut, Lightbulb } from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  openFaultCount: number;
  onLogout: () => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  openFaultCount,
  onLogout,
  onOpenSupport
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-[#1e1f23]/85 backdrop-blur-2xl border-r border-white/10 shadow-2xl hidden lg:flex flex-col">
      {/* Branding */}
      <div className="px-6 pt-7 pb-6 flex flex-col items-center border-b border-white/10">
        <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center mb-3 shadow-lg group hover:scale-105 transition-transform">
          <Lightbulb className="w-7 h-7 text-primary animate-pulse" />
        </div>
        <h1 className="font-semibold text-lg text-primary tracking-tight">Hiku Control</h1>
        <p className="text-xs text-[#c1c6d7] mt-0.5 font-medium tracking-wide">City Grid Alpha</p>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'dashboard'
              ? 'bg-[#4b8eff] text-white shadow-lg shadow-[#4b8eff]/25 font-semibold'
              : 'text-[#c1c6d7] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('problems')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'problems'
              ? 'bg-[#4b8eff] text-white shadow-lg shadow-[#4b8eff]/25 font-semibold'
              : 'text-[#c1c6d7] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
            <span>Problems</span>
          </div>
          {openFaultCount > 0 && (
            <span className="bg-[#ffb4ab]/25 text-[#ffb4ab] text-xs px-2 py-0.5 rounded-full font-bold">
              {openFaultCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('maintenance')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'maintenance'
              ? 'bg-[#4b8eff] text-white shadow-lg shadow-[#4b8eff]/25 font-semibold'
              : 'text-[#c1c6d7] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5" />
            <span>Maintenance</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'analytics'
              ? 'bg-[#4b8eff] text-white shadow-lg shadow-[#4b8eff]/25 font-semibold'
              : 'text-[#c1c6d7] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </div>
        </button>
      </div>

      {/* Action Button: Report Fault */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => onNavigate('report')}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            currentScreen === 'report'
              ? 'bg-[#adc6ff] text-[#001a41] ring-2 ring-white/40'
              : 'bg-[#adc6ff] text-[#001a41] hover:brightness-110 hover:shadow-lg hover:shadow-[#adc6ff]/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Report Fault</span>
        </button>
      </div>

      {/* Footer Support & Logout */}
      <div className="px-4 pb-6 pt-2 border-t border-white/10 space-y-1 mt-auto text-xs">
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#c1c6d7] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
