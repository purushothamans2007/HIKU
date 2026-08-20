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

      {/* Filters Section: Frosted Pill Container */}
      <div className="frosted-panel rounded-3xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        {/* Severity Selector */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <span className="text-xs sm:text-sm text-[#c1c6d7] mr-2 font-medium">Severity:</span>
          
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'all'
                ? 'bg-[#4b8eff] text-white shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/40 font-bold'
                : 'bg-white/[0.06] text-[#c1c6d7] border border-white/10 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            All ({faults.length})
          </button>

          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'critical'
                ? 'bg-[#ffb4ab]/30 text-[#ffb4ab] border border-[#ffb4ab]/60 shadow-[0_0_16px_rgba(255,180,171,0.35)] ring-1 ring-[#ffb4ab]/40 font-bold'
                : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/25 hover:bg-[#ffb4ab]/20'
            }`}
          >
            Critical
          </button>

          <button
            onClick={() => setSelectedSeverity('medium')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'medium'
                ? 'bg-[#7fd0ff]/30 text-[#7fd0ff] border border-[#7fd0ff]/60 shadow-[0_0_16px_rgba(127,208,255,0.35)] ring-1 ring-[#7fd0ff]/40 font-bold'
                : 'bg-[#7fd0ff]/10 text-[#7fd0ff] border border-[#7fd0ff]/25 hover:bg-[#7fd0ff]/20'
            }`}
          >
            Medium
          </button>

          <button
            onClick={() => setSelectedSeverity('low')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedSeverity === 'low'
                ? 'bg-white/20 text-white border border-white/40 shadow-md font-bold'
                : 'bg-white/[0.06] text-[#c1c6d7] border border-white/10 hover:bg-white/[0.12]'
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
              className="frosted-input text-white text-xs sm:text-sm rounded-2xl border border-white/15 focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff] py-2 px-3.5 outline-none cursor-pointer"
            >
              <option value="All Zones" className="bg-[#151a26]">All Zones</option>
              <option value="North Grid" className="bg-[#151a26]">North Grid</option>
              <option value="Central Grid" className="bg-[#151a26]">Central Grid</option>
              <option value="South Sector" className="bg-[#151a26]">South Sector</option>
              <option value="East Node" className="bg-[#151a26]">East Node</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="frosted-input text-white text-xs sm:text-sm rounded-2xl border border-white/15 focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff] py-2 px-3.5 outline-none cursor-pointer"
            >
              <option value="All Wards" className="bg-[#151a26]">All Wards</option>
              <option value="Ward 12" className="bg-[#151a26]">Ward 12</option>
              <option value="Ward 45" className="bg-[#151a26]">Ward 45</option>
            </select>
          </div>

          <button
            onClick={onNavigateToReport}
            className="ml-2 frosted-btn bg-[#4b8eff] hover:bg-[#6ba3ff] text-white px-4 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(75,142,255,0.4)] border border-white/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Issues Grid */}
      {filteredFaults.length === 0 ? (
        <div className="frosted-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-white/20">
          <CheckCircle2 className="w-12 h-12 text-[#39dcd2] mb-3 drop-shadow-[0_0_12px_rgba(57,220,210,0.6)]" />
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
                className="frosted-card rounded-3xl p-6 flex flex-col relative overflow-hidden group border border-white/15 hover:border-white/35 transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
              >
                {/* Top Glowing Color Accent Stripe */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                    isCritical
                      ? 'from-[#ffb4ab] via-[#ffb4ab] to-transparent'
                      : isMedium
                      ? 'from-[#7fd0ff] via-[#7fd0ff] to-transparent'
                      : 'from-white/30 to-transparent'
                  }`}
                />

                {/* Card Header: Severity Badge + ID Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isCritical
                        ? 'bg-[#ffb4ab]/20 border-[#ffb4ab]/40 text-[#ffb4ab] shadow-[0_0_12px_rgba(255,180,171,0.3)]'
                        : isMedium
                        ? 'bg-[#7fd0ff]/20 border-[#7fd0ff]/40 text-[#7fd0ff] shadow-[0_0_12px_rgba(127,208,255,0.3)]'
                        : 'bg-white/10 border-white/20 text-[#c1c6d7]'
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

                  <span className="text-xs text-[#c1c6d7] font-mono bg-black/40 px-3 py-1 rounded-full border border-white/10">
                    {fault.id}
                  </span>
                </div>

                {/* Title & Location */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#4b8eff] transition-colors">
                  {fault.title}
                </h3>
                <div className="flex items-center text-[#c1c6d7] text-xs sm:text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#4b8eff] shrink-0" />
                  <span className="truncate">{fault.location}</span>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-[#c1c6d7]/90 mb-6 line-clamp-2 leading-relaxed flex-1">
                  {fault.description}
                </p>

                {/* Card Footer: Timestamp + View Details Button */}
                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-[#8b90a0] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Reported: {fault.reportedTime}
                  </span>

                  <button
                    onClick={() => onOpenFaultDetails(fault)}
                    className="frosted-btn bg-white/10 hover:bg-[#4b8eff] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/20 hover:border-[#4b8eff] transition-all shadow-md"
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
