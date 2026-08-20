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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden justify-around items-center px-3 pb-4 pt-2 bg-[#1e1f23]/90 backdrop-blur-2xl border-t border-white/15 shadow-2xl">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentScreen === 'dashboard'
            ? 'text-primary font-bold scale-105'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <Map className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Map</span>
      </button>

      <button
        onClick={() => onNavigate('problems')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
          currentScreen === 'problems'
            ? 'bg-[#029bd3]/30 text-[#7fd0ff] font-bold rounded-2xl px-4'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <AlertTriangle className="w-5 h-5 mb-1 text-[#ffb4ab]" />
        <span className="text-[10px]">Issues</span>
        {openFaultCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
        )}
      </button>

      {/* Floating Plus Report Button */}
      <button
        onClick={() => onNavigate('report')}
        className="flex items-center justify-center w-11 h-11 -mt-5 rounded-full bg-[#4b8eff] text-white shadow-lg shadow-[#4b8eff]/40 active:scale-95 transition-transform"
        title="Report New Fault"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => onNavigate('maintenance')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentScreen === 'maintenance'
            ? 'text-primary font-bold scale-105'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <Wrench className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Tasks</span>
      </button>

      <button
        onClick={() => onNavigate('analytics')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentScreen === 'analytics'
            ? 'text-primary font-bold scale-105'
            : 'text-[#8b90a0] hover:text-white'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Data</span>
      </button>
    </nav>
  );
};
