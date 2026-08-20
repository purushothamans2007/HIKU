import React from 'react';
import { ScreenType } from '../types';
import { Map, AlertTriangle, Wrench, BarChart3, Plus } from 'lucide-react';

interface MobileNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  openFaultCount: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentScreen,
  onNavigate,
  openFaultCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden justify-around items-center px-3 pb-4 pt-2.5 frosted-panel border-t border-white/20 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all frosted-btn ${
          currentScreen === 'dashboard'
            ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <Map className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Map</span>
      </button>

      <button
        onClick={() => onNavigate('problems')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative frosted-btn ${
          currentScreen === 'problems'
            ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold border border-[#ffb4ab]/30 shadow-sm'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <AlertTriangle className="w-5 h-5 mb-1 text-[#ffb4ab]" />
        <span className="text-[10px]">Issues</span>
        {openFaultCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)] animate-pulse" />
        )}
      </button>

      {/* Floating Plus Report Button */}
      <button
        onClick={() => onNavigate('report')}
        className="flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-[#4b8eff] hover:bg-[#6ba3ff] text-white shadow-[0_6px_20px_rgba(75,142,255,0.5)] border border-white/35 active:scale-95 transition-all frosted-btn"
        title="Report New Fault"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => onNavigate('maintenance')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all frosted-btn ${
          currentScreen === 'maintenance'
            ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <Wrench className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Tasks</span>
      </button>

      <button
        onClick={() => onNavigate('analytics')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all frosted-btn ${
          currentScreen === 'analytics'
            ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Data</span>
      </button>
    </nav>
  );
};
