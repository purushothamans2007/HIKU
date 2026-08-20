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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          fault.severity === 'critical' ? 'bg-[#ffb4ab]' :
          fault.severity === 'medium' ? 'bg-[#7fd0ff]' : 'bg-[#343539]'
        }`} />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                {fault.id}
              </span>
              <span className="font-mono text-xs text-[#8b90a0]">Ticket: {fault.ticketNumber}</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                fault.severity === 'critical' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' :
                fault.severity === 'medium' ? 'bg-[#7fd0ff]/20 text-[#7fd0ff]' :
                'bg-white/10 text-[#c1c6d7]'
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
            className="p-1.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1">
          {/* Location & Metadata */}
          <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#8b90a0]">Fault Location</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
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
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-semibold text-primary transition-colors flex items-center gap-1"
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
            <p className="text-sm text-white bg-[#121317]/60 p-3.5 rounded-xl border border-white/10 leading-relaxed">
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
                className="w-full glass-input rounded-xl py-2.5 px-3 text-white text-sm outline-none bg-[#1e1f23]"
              >
                <option value="Open">Open (Pending)</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c1c6d7] uppercase tracking-wider">
                Assigned Field Technician
              </label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full glass-input rounded-xl py-2.5 px-3 text-white text-sm outline-none bg-[#1e1f23]"
              >
                <option value="">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>
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
              className="w-full glass-input rounded-xl py-2.5 px-3 text-white text-xs placeholder-[#c1c6d7]/50 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c1c6d7] hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveDispatch}
            className="liquid-btn px-6 py-2.5 rounded-xl bg-primary hover:bg-[#d8e2ff] text-[#001a41] text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Update Work Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
