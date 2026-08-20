import React from 'react';
import { 
  Map, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  Droplets,
  PlusCircle, 
  HelpCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  openFaultCount: number;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  openFaultCount,
  onOpenHelp
}) => {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 frosted-ultra z-[70] border-r border-white/25">
      {/* Brand Header with Crystal Liquid Droplets */}
      <div className="h-16 flex items-center px-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-300 to-white flex items-center justify-center shadow-[0_4px_20px_rgba(52,211,153,0.5)] border border-white/80">
            <Droplets className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-white tracking-tight">
                hiku
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/40">
                GRID
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide">
              Smart Water-Glass Matrix
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all relative overflow-hidden ${
            currentScreen === 'dashboard'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(52,211,153,0.45)] border border-white/80 font-bold scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/20'
          }`}
        >
          {currentScreen === 'dashboard' && (
            <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <Map className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('problems')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all relative overflow-hidden ${
            currentScreen === 'problems'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(52,211,153,0.45)] border border-white/80 font-bold scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/20'
          }`}
        >
          {currentScreen === 'problems' && (
            <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Problems</span>
          </div>
          {openFaultCount > 0 && (
            <span className="bg-rose-500/30 border border-rose-400/50 text-rose-300 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm relative z-10">
              {openFaultCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('maintenance')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all relative overflow-hidden ${
            currentScreen === 'maintenance'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(52,211,153,0.45)] border border-white/80 font-bold scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/20'
          }`}
        >
          {currentScreen === 'maintenance' && (
            <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <Wrench className="w-5 h-5" />
            <span>Maintenance</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all relative overflow-hidden ${
            currentScreen === 'analytics'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(52,211,153,0.45)] border border-white/80 font-bold scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/20'
          }`}
        >
          {currentScreen === 'analytics' && (
            <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </div>
        </button>

        {/* Quick Report Button */}
        <div className="pt-4 px-1">
          <button
            onClick={() => onNavigate('report')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold border border-white/40 shadow-lg hover:shadow-xl transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Report Anomaly</span>
          </button>
        </div>
      </div>

      {/* Grid Health Status Footer */}
      <div className="p-4 border-t border-white/15 bg-white/[0.04]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Grid Telemetry
          </span>
          <span className="text-emerald-300 font-bold">99.8% Online</span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full w-[99.8%]" />
        </div>

        <button
          onClick={onOpenHelp}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-300 hover:text-white transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Operator Manual & Docs</span>
        </button>
      </div>
    </aside>
  );
};
