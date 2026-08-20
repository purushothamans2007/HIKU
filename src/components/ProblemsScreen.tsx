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
  Sparkles
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
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Page Header (Matching Screenshot 2) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
            Issue Directory
          </h2>
          <p className="text-sm sm:text-base text-[#c1c6d7]">
            Monitoring grid anomalies and fault reports across active sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs sm:text-sm text-[#c1c6d7]">System Status:</span>
          <div className="flex items-center gap-2 bg-[#292a2e]/80 px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#39dcd2] shadow-[0_0_8px_rgba(57,220,210,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-[#39dcd2] uppercase tracking-wider">
              Nominal
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section: Glassmorphic Pill Container (Matching Screenshot 2) */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/15 shadow-xl">
        {/* Severity Selector */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <span className="text-xs sm:text-sm text-[#c1c6d7] mr-2 font-medium">Severity:</span>
          
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'all'
                ? 'bg-primary text-[#001a41] shadow-md'
                : 'bg-[#343539] text-[#c1c6d7] border border-white/10 hover:text-white'
            }`}
          >
            All ({faults.length})
          </button>

          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'critical'
                ? 'bg-[#ffb4ab]/25 text-[#ffb4ab] border border-[#ffb4ab]/50 shadow-md ring-1 ring-[#ffb4ab]/30'
                : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:bg-[#ffb4ab]/20'
            }`}
          >
            Critical
          </button>

          <button
            onClick={() => setSelectedSeverity('medium')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'medium'
                ? 'bg-[#7fd0ff]/25 text-[#7fd0ff] border border-[#7fd0ff]/50 shadow-md ring-1 ring-[#7fd0ff]/30'
                : 'bg-[#7fd0ff]/10 text-[#7fd0ff] border border-[#7fd0ff]/20 hover:bg-[#7fd0ff]/20'
            }`}
          >
            Medium
          </button>

          <button
            onClick={() => setSelectedSeverity('low')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'low'
                ? 'bg-[#343539] text-white border border-white/30 shadow-md'
                : 'bg-[#343539]/60 text-[#c1c6d7] border border-white/10 hover:bg-[#343539]'
            }`}
          >
            Low
          </button>
        </div>

        {/* Zone & Ward Dropdowns */}
        <div className="flex gap-2.5 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs sm:text-sm text-[#c1c6d7] mr-1 font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#1e1f23] text-white text-xs sm:text-sm rounded-xl border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 outline-none cursor-pointer"
            >
              <option value="All Zones">All Zones</option>
              <option value="North Grid">North Grid</option>
              <option value="Central Grid">Central Grid</option>
              <option value="South Sector">South Sector</option>
              <option value="East Node">East Node</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-[#1e1f23] text-white text-xs sm:text-sm rounded-xl border border-white/15 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 outline-none cursor-pointer"
            >
              <option value="All Wards">All Wards</option>
              <option value="Ward 12">Ward 12</option>
              <option value="Ward 45">Ward 45</option>
            </select>
          </div>

          <button
            onClick={onNavigateToReport}
            className="ml-2 liquid-btn bg-primary hover:bg-[#d8e2ff] text-[#001a41] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Issues Grid (Matching Screenshot 2) */}
      {filteredFaults.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-[#39dcd2] mb-3" />
          <h3 className="text-lg font-bold text-white">No Matching Faults Detected</h3>
          <p className="text-sm text-[#c1c6d7] max-w-md mt-1">
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
                className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden group border border-white/15 hover:border-white/30 transition-all duration-300"
              >
                {/* Top Glowing Color Accent Stripe */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                    isCritical
                      ? 'from-[#ffb4ab] to-[#ffb4ab]/10'
                      : isMedium
                      ? 'from-[#7fd0ff] to-[#7fd0ff]/10'
                      : 'from-[#343539] to-transparent'
                  }`}
                />

                {/* Card Header: Severity Badge + ID Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      isCritical
                        ? 'bg-[#ffb4ab]/15 border-[#ffb4ab]/30 text-[#ffb4ab] glow-critical'
                        : isMedium
                        ? 'bg-[#7fd0ff]/15 border-[#7fd0ff]/30 text-[#7fd0ff]'
                        : 'bg-[#343539] border-white/15 text-[#c1c6d7]'
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

                  <span className="text-xs text-[#c1c6d7] font-mono bg-[#1e1f23] px-2.5 py-1 rounded-lg border border-white/10">
                    {fault.id}
                  </span>
                </div>

                {/* Title & Location */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {fault.title}
                </h3>
                <div className="flex items-center text-[#c1c6d7] text-xs sm:text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary shrink-0" />
                  <span className="truncate">{fault.location}</span>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-[#c1c6d7]/90 mb-6 line-clamp-2 leading-relaxed flex-1">
                  {fault.description}
                </p>

                {/* Card Footer: Timestamp + View Details Liquid Button */}
                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-[#8b90a0] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reported: {fault.reportedTime}
                  </span>

                  <button
                    onClick={() => onOpenFaultDetails(fault)}
                    className="liquid-btn bg-[#343539] hover:bg-[#4b8eff] text-primary hover:text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/10 hover:border-[#4b8eff] transition-all shadow"
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
