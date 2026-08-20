import React from 'react';
import { Map, AlertTriangle, Wrench, BarChart3, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';

interface MobileNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  openFaultCount: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentScreen,
  onNavigate,
  openFaultCount,
}) => {
  const tabs: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }>; isAlert?: boolean }[] = [
    { id: 'dashboard', label: 'Map', icon: Map },
    { id: 'problems', label: 'Issues', icon: AlertTriangle, isAlert: true },
    { id: 'report', label: 'Report', icon: PlusCircle },
    { id: 'maintenance', label: 'Tasks', icon: Wrench },
    { id: 'analytics', label: 'Data', icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-2.5 left-0 right-0 z-50 flex flex-col items-center px-3 pointer-events-none">
      {/* Seamless Water Transparent Glass Dock */}
      <nav className="iphone-liquid-dock w-full max-w-[340px] rounded-full p-1 flex items-center justify-between pointer-events-auto relative overflow-hidden">
        {/* Crystal Glass Top Curved Highlight Rim */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          const isProblems = tab.id === 'problems';

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 relative flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-colors duration-200 active:scale-95 z-10 ${
                isActive
                  ? isProblems
                    ? 'text-rose-200 font-bold'
                    : 'text-emerald-200 font-bold'
                  : isProblems
                  ? 'text-slate-300 hover:text-rose-300'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="liquid-dock-pill"
                  className={`absolute inset-0 rounded-full ${
                    isProblems
                      ? 'bg-gradient-to-b from-white/45 via-rose-500/25 to-rose-950/40 border-[1.2px] border-white/80 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.9),0_4px_16px_rgba(244,63,94,0.45),0_0_12px_rgba(255,255,255,0.3)]'
                      : 'iphone-liquid-active'
                  }`}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 26,
                    mass: 0.75,
                  }}
                >
                  <div className="absolute top-0.5 left-2 right-2 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent rounded-full pointer-events-none shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
                  <div
                    className={`absolute bottom-0.5 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent ${
                      isProblems ? 'via-rose-300/60' : 'via-emerald-300/60'
                    } to-transparent rounded-full pointer-events-none`}
                  />
                </motion.div>
              )}

              <div className="relative">
                <Icon className="w-4 h-4 mb-0.5 relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                {tab.isAlert && openFaultCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.95)] animate-pulse z-20 border border-white/60" />
                )}
              </div>
              <span className="text-[9px] tracking-tight font-medium relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* iOS Home Indicator Bar */}
      <div className="iphone-home-bar mt-1.5" />
    </div>
  );
};

