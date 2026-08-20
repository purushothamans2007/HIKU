import React, { useState } from 'react';
import { FaultReport, SeverityType } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  MapPin, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  PlusCircle,
  Sparkles,
  Droplets
} from 'lucide-react';

interface ProblemsScreenProps {
  faults: FaultReport[];
  onOpenFaultDetails: (fault: FaultReport) => void;
  onNavigateToReport: () => void;
}

export const ProblemsScreen: React.FC<ProblemsScreenProps> = ({
  faults,
  onOpenFaultDetails,
  onNavigateToReport
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityType | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredFaults = faults.filter((fault) => {
    if (selectedSeverity !== 'all' && fault.severity !== selectedSeverity) return false;
    if (selectedZone !== 'All Zones' && fault.zone !== selectedZone) return false;
    if (selectedWard !== 'All Wards' && fault.ward !== selectedWard) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        fault.id.toLowerCase().includes(q) ||
        fault.title.toLowerCase().includes(q) ||
        fault.location.toLowerCase().includes(q) ||
        fault.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-3.5 sm:p-6 md:p-8 pb-32 lg:pb-8 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/40 flex items-center justify-center shadow-md">
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Issue Directory
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            Monitoring grid anomalies and fault reports across active sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs sm:text-sm text-slate-300">System Status:</span>
          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/25 shadow-sm backdrop-blur-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Nominal
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section: Crystal Frosted Pill Container */}
      <div className="frosted-panel rounded-3xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        {/* Severity Selector */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <span className="text-xs sm:text-sm text-slate-300 mr-2 font-medium">Severity:</span>
          
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'all'
                ? 'bg-white text-slate-950 shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white font-bold'
                : 'bg-white/[0.08] text-slate-300 border border-white/20 hover:text-white hover:bg-white/[0.16]'
            }`}
          >
            All ({faults.length})
          </button>

          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'critical'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-400/70 shadow-[0_0_16px_rgba(248,113,113,0.35)] ring-1 ring-rose-400/50 font-bold'
                : 'bg-rose-500/10 text-rose-300 border border-rose-400/25 hover:bg-rose-500/20'
            }`}
          >
            Critical
          </button>

          <button
            onClick={() => setSelectedSeverity('medium')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'medium'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/70 shadow-[0_0_16px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/50 font-bold'
                : 'bg-amber-500/10 text-amber-300 border border-amber-400/25 hover:bg-amber-500/20'
            }`}
          >
            Medium
          </button>

          <button
            onClick={() => setSelectedSeverity('low')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'low'
                ? 'bg-white/25 text-white border border-white/50 shadow-md font-bold'
                : 'bg-white/[0.08] text-slate-300 border border-white/20 hover:bg-white/[0.16]'
            }`}
          >
            Low
          </button>
        </div>

        {/* Zone & Ward Dropdowns */}
        <div className="flex gap-2.5 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs sm:text-sm text-slate-300 mr-1 font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="frosted-input text-white text-xs sm:text-sm rounded-2xl border border-white/30 focus:border-white focus:ring-1 focus:ring-white py-2 px-3.5 outline-none cursor-pointer"
            >
              <option value="All Zones" className="bg-[#0c161c]">All Zones</option>
              <option value="North Grid" className="bg-[#0c161c]">North Grid</option>
              <option value="Central Grid" className="bg-[#0c161c]">Central Grid</option>
              <option value="South Sector" className="bg-[#0c161c]">South Sector</option>
              <option value="East Node" className="bg-[#0c161c]">East Node</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="frosted-input text-white text-xs sm:text-sm rounded-2xl border border-white/30 focus:border-white focus:ring-1 focus:ring-white py-2 px-3.5 outline-none cursor-pointer"
            >
              <option value="All Wards" className="bg-[#0c161c]">All Wards</option>
              <option value="Ward 12" className="bg-[#0c161c]">Ward 12</option>
              <option value="Ward 45" className="bg-[#0c161c]">Ward 45</option>
            </select>
          </div>

          <button
            onClick={onNavigateToReport}
            className="ml-2 frosted-btn bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(255,255,255,0.4)] border border-white/80"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Issues Grid */}
      {filteredFaults.length === 0 ? (
        <div className="frosted-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-white/30">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          <h3 className="text-lg font-bold text-white">No Matching Faults Detected</h3>
          <p className="text-sm text-slate-300 max-w-md mt-1">
            All street light nodes within the selected filters are operating within nominal parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaults.map((fault) => {
            const isCritical = fault.severity === 'critical';
            const isMedium = fault.severity === 'medium';

            return (
              <div
                key={fault.id}
                className="frosted-card rounded-3xl p-6 flex flex-col relative overflow-hidden group border border-white/25 hover:border-white/50 transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                {/* Top Glowing Color Accent Stripe */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                    isCritical
                      ? 'from-rose-400 via-rose-400 to-transparent'
                      : isMedium
                      ? 'from-amber-400 via-amber-400 to-transparent'
                      : 'from-white/50 to-transparent'
                  }`}
                />

                {/* Card Header: Severity Badge + ID Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isCritical
                        ? 'bg-rose-500/20 border-rose-400/40 text-rose-300 shadow-[0_0_12px_rgba(248,113,113,0.3)]'
                        : isMedium
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                        : 'bg-white/15 border-white/30 text-slate-200'
                    }`}
                  >
                    {isCritical ? (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    ) : isMedium ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5" />
                    )}
                    <span>{fault.severity}</span>
                  </div>

                  <span className="text-xs text-slate-300 font-mono bg-black/40 px-3 py-1 rounded-full border border-white/15">
                    {fault.id}
                  </span>
                </div>

                {/* Title & Location */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {fault.title}
                </h3>
                <div className="flex items-center text-slate-300 text-xs sm:text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{fault.location}</span>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-slate-200/90 mb-6 line-clamp-2 leading-relaxed flex-1">
                  {fault.description}
                </p>

                {/* Card Footer: Timestamp + View Details Button */}
                <div className="mt-auto pt-4 border-t border-white/15 flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Reported: {fault.reportedTime}
                  </span>

                  <button
                    onClick={() => onOpenFaultDetails(fault)}
                    className="frosted-btn bg-white/15 hover:bg-white text-white hover:text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-white/30 hover:border-white transition-all shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
