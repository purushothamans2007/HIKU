import React, { useState } from 'react';
import { Technician, FaultReport } from '../types';
import { Wrench, Users, Phone, MapPin, CheckCircle2, Clock, ShieldAlert, Package, Navigation, Sparkles, Droplets } from 'lucide-react';

interface MaintenanceScreenProps {
  technicians: Technician[];
  faults: FaultReport[];
  onOpenFaultDetails: (fault: FaultReport) => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  technicians,
  faults,
  onOpenFaultDetails
}) => {
  const [activeTab, setActiveTab] = useState<'crews' | 'workorders' | 'inventory'>('crews');

  const dispatchedFaults = faults.filter(f => f.status === 'Dispatched' || f.status === 'In Progress');

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-3.5 sm:p-6 md:p-8 pb-32 lg:pb-8 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/40 flex items-center justify-center shadow-md">
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Grid Maintenance & Field Crews
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            Active technician dispatch, route optimization, and equipment telemetry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="frosted-panel p-1.5 rounded-2xl flex items-center gap-1.5 self-start md:self-auto border border-white/30 shadow-md">
          <button
            onClick={() => setActiveTab('crews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'crews' 
                ? 'bg-white text-slate-950 shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Field Crews ({technicians.length})
          </button>
          <button
            onClick={() => setActiveTab('workorders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'workorders' 
                ? 'bg-white text-slate-950 shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Active Work Orders ({dispatchedFaults.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory' 
                ? 'bg-white text-slate-950 shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Spare Parts Depot
          </button>
        </div>
      </div>

      {/* Crews View */}
      {activeTab === 'crews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="frosted-card rounded-3xl p-6 border border-white/25 hover:border-white/50 transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={tech.avatarUrl}
                      alt={tech.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base">{tech.name}</h3>
                      <p className="text-xs text-emerald-300 font-medium">{tech.role}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      tech.status === 'En Route'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
                        : tech.status === 'On Duty'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
                        : 'bg-teal-500/20 text-teal-300 border-teal-400/40 shadow-[0_0_10px_rgba(45,212,191,0.25)]'
                    }`}
                  >
                    {tech.status}
                  </span>
                </div>

                <div className="space-y-2.5 py-3.5 border-y border-white/15 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Assigned Zone:</span>
                    <span className="font-semibold text-white">{tech.assignedZone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Incident:</span>
                    <span className="font-mono text-emerald-300 truncate max-w-[160px]">
                      {tech.currentTask || 'None (Standby)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasks Completed Today:</span>
                    <span className="font-bold text-white">{tech.completedTasksToday} tickets</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between gap-2.5">
                <a
                  href={`tel:${tech.phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all frosted-btn"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Crew</span>
                </a>
                <button
                  onClick={() => alert(`Direct telemetry comm link established with ${tech.name}`)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 border border-white text-xs font-bold transition-all shadow-sm frosted-btn"
                >
                  Ping GPS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Work Orders View */}
      {activeTab === 'workorders' && (
        <div className="space-y-4">
          {dispatchedFaults.length === 0 ? (
            <div className="frosted-panel p-12 text-center rounded-3xl border border-white/30">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
              <p className="text-white font-bold text-lg">No Pending Dispatches</p>
              <p className="text-xs text-slate-300 mt-1">All reported grid faults are currently assigned and resolved.</p>
            </div>
          ) : (
            dispatchedFaults.map((fault) => (
              <div
                key={fault.id}
                className="frosted-card rounded-3xl p-5 border border-white/25 hover:border-white/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_12px_rgba(248,113,113,0.25)]">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-emerald-300">{fault.id}</span>
                      <span className="text-xs font-mono text-slate-400">Ticket: #{fault.ticketNumber}</span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                        {fault.severity}
                      </span>
                      <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                        Status: {fault.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1.5">{fault.title}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{fault.location} ({fault.zone})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/15">
                  <div className="text-left md:text-right">
                    <p className="text-[11px] text-slate-400">Assigned Tech</p>
                    <p className="text-xs font-semibold text-white">{fault.assignedTech || 'Pending'}</p>
                    {fault.eta && <p className="text-[10px] text-emerald-300 font-mono">ETA: {fault.eta}</p>}
                  </div>

                  <button
                    onClick={() => onOpenFaultDetails(fault)}
                    className="frosted-btn bg-white hover:bg-slate-100 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white/80 transition-all"
                  >
                    Manage Dispatch
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Spare Parts Depot View */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="frosted-card rounded-3xl p-6 border border-white/25 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-white/15 border border-white/30 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">LED Driver Modules (120W)</h3>
                <p className="text-xs text-slate-300">Stock: 148 Units (Central Hub)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4">Compatible with Luminary-V4 and AuraMesh-Pro 200W luminaires.</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div className="bg-emerald-400 h-full rounded-full w-[78%] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-300 mt-1.5 block">78% Buffer Healthy</span>
          </div>

          <div className="frosted-card rounded-3xl p-6 border border-white/25 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Photocell Ambient Lux Sensors</h3>
                <p className="text-xs text-slate-300">Stock: 42 Units (Reorder Required)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4">High-precision daylight threshold calibrators (0-2000 lx).</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div className="bg-amber-400 h-full rounded-full w-[28%] shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-amber-300 mt-1.5 block">28% Low Stock</span>
          </div>

          <div className="frosted-card rounded-3xl p-6 border border-white/25 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Solar LiFePO4 Battery Packs</h3>
                <p className="text-xs text-slate-300">Stock: 96 Units (Marina & OMR)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4">48V 50Ah replacement storage packs for coastal autonomous poles.</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div className="bg-teal-400 h-full rounded-full w-[85%] shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-teal-300 mt-1.5 block">85% In Stock</span>
          </div>
        </div>
      )}
    </div>
  );
};
