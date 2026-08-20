import React, { useState } from 'react';
import { FaultReport, Technician } from '../types';
import { X, MapPin, UserCheck, Navigation, Droplets } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-xl frosted-panel rounded-3xl p-6 sm:p-8 border border-white/30 shadow-[0_32px_80px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          fault.severity === 'critical' ? 'bg-rose-400' :
          fault.severity === 'medium' ? 'bg-amber-400' : 'bg-white/50'
        }`} />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                {fault.id}
              </span>
              <span className="font-mono text-xs text-slate-400">Ticket: #{fault.ticketNumber}</span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                fault.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(248,113,113,0.3)]' :
                fault.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]' :
                'bg-white/15 text-slate-300 border-white/25'
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
            className="p-2 text-slate-300 hover:text-white hover:bg-white/15 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1">
          {/* Location & Metadata */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs text-slate-400">Fault Location</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fault.location} ({fault.zone})</span>
              </p>
              <p className="text-xs text-slate-300 mt-0.5">{fault.ward}</p>
            </div>

            {fault.poleId && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPole?.(fault.poleId!);
                }}
                className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-slate-950 border border-white/30 hover:border-white text-xs font-bold transition-all flex items-center gap-1.5 frosted-btn shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inspect Pole {fault.poleId}</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Incident Diagnostics
            </h4>
            <p className="text-sm text-white bg-black/40 p-4 rounded-2xl border border-white/15 leading-relaxed backdrop-blur-sm">
              {fault.description}
            </p>
          </div>

          {/* Status & Dispatch Control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Resolution Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as FaultReport['status'])}
                className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="Open" className="bg-neutral-900">Open (Pending)</option>
                <option value="Dispatched" className="bg-neutral-900">Dispatched</option>
                <option value="In Progress" className="bg-neutral-900">In Progress</option>
                <option value="Resolved" className="bg-neutral-900">Resolved</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Assigned Field Technician
              </label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.name} className="bg-neutral-900">
                    {t.name} ({t.status} - {t.assignedZone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dispatch Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Field Log / Resolution Notes
            </label>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Dispatched replacement photocell sensor module..."
              className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-xs placeholder-slate-400 resize-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors frosted-btn"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveDispatch}
            className="frosted-btn px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_4px_20px_rgba(255,255,255,0.4)] border border-white transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Update Work Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
