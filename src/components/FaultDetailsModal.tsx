import React, { useState } from 'react';
import { FaultReport, Technician } from '../types';
import { X, AlertOctagon, MapPin, Clock, UserCheck, CheckCircle, Navigation, Shield, Wrench } from 'lucide-react';

interface FaultDetailsModalProps {
  fault: FaultReport | null;
  technicians: Technician[];
  onClose: () => void;
  onUpdateStatus: (faultId: string, status: FaultReport['status'], assignedTech?: string) => void;
  onNavigateToPole?: (poleId: string) => void;
}

export const FaultDetailsModal: React.FC<FaultDetailsModalProps> = ({
  fault,
  technicians,
  onClose,
  onUpdateStatus,
  onNavigateToPole
}) => {
  if (!fault) return null;

  const [selectedTech, setSelectedTech] = useState<string>(fault.assignedTech || technicians[0]?.name || '');
  const [currentStatus, setCurrentStatus] = useState<FaultReport['status']>(fault.status);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleSaveDispatch = () => {
    onUpdateStatus(fault.id, currentStatus, selectedTech);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-xl frosted-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          fault.severity === 'critical' ? 'bg-[#ffb4ab]' :
          fault.severity === 'medium' ? 'bg-[#7fd0ff]' : 'bg-white/30'
        }`} />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-[#adc6ff] px-2.5 py-0.5 rounded-full bg-[#4b8eff]/15 border border-[#4b8eff]/30">
                {fault.id}
              </span>
              <span className="font-mono text-xs text-[#8b90a0]">Ticket: #{fault.ticketNumber}</span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                fault.severity === 'critical' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/30' :
                fault.severity === 'medium' ? 'bg-[#7fd0ff]/20 text-[#7fd0ff] border-[#7fd0ff]/30' :
                'bg-white/10 text-[#c1c6d7] border-white/20'
              }`}>
                {fault.severity}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {fault.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1">
          {/* Location & Metadata */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs text-[#8b90a0]">Fault Location</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#4b8eff] shrink-0" />
                <span>{fault.location} ({fault.zone})</span>
              </p>
              <p className="text-xs text-[#c1c6d7] mt-0.5">{fault.ward}</p>
            </div>

            {fault.poleId && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPole?.(fault.poleId!);
                }}
                className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#4b8eff]/20 hover:bg-[#4b8eff] border border-[#4b8eff]/40 text-xs font-semibold text-[#adc6ff] hover:text-white transition-all flex items-center gap-1.5 frosted-btn shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Inspect Pole {fault.poleId}</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c1c6d7] mb-1.5">
              Incident Diagnostics
            </h4>
            <p className="text-sm text-white bg-black/40 p-4 rounded-2xl border border-white/10 leading-relaxed backdrop-blur-sm">
              {fault.description}
            </p>
          </div>

          {/* Status & Dispatch Control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c1c6d7] uppercase tracking-wider">
                Resolution Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as FaultReport['status'])}
                className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="Open" className="bg-[#151a26]">Open (Pending)</option>
                <option value="Dispatched" className="bg-[#151a26]">Dispatched</option>
                <option value="In Progress" className="bg-[#151a26]">In Progress</option>
                <option value="Resolved" className="bg-[#151a26]">Resolved</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c1c6d7] uppercase tracking-wider">
                Assigned Field Technician
              </label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="" className="bg-[#151a26]">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.name} className="bg-[#151a26]">
                    {t.name} ({t.status} - {t.assignedZone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dispatch Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c1c6d7] uppercase tracking-wider">
              Field Log / Resolution Notes
            </label>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Dispatched replacement photocell sensor module..."
              className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-xs placeholder-[#c1c6d7]/50 resize-none focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c1c6d7] hover:text-white hover:bg-white/5 transition-colors frosted-btn"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveDispatch}
            className="frosted-btn px-6 py-2.5 rounded-2xl bg-[#4b8eff] hover:bg-[#6ba3ff] text-white text-xs font-bold shadow-[0_4px_20px_rgba(75,142,255,0.4)] border border-white/30 transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Update Work Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
