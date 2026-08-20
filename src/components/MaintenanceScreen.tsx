import React, { useState } from 'react';
import { Technician, FaultReport } from '../types';
import { Wrench, Users, Phone, MapPin, CheckCircle2, Clock, ShieldAlert, Package, Navigation, Sparkles } from 'lucide-react';

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
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-[#4b8eff] drop-shadow-[0_0_10px_rgba(75,142,255,0.8)]" />
            <span>Grid Maintenance & Field Crews</span>
          </h2>
          <p className="text-sm sm:text-base text-[#c1c6d7]">
            Active technician dispatch, route optimization, and equipment telemetry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="frosted-panel p-1.5 rounded-2xl flex items-center gap-1.5 self-start md:self-auto border border-white/20 shadow-md">
          <button
            onClick={() => setActiveTab('crews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'crews' 
                ? 'bg-[#4b8eff] text-white shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 font-bold' 
                : 'text-[#c1c6d7] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Field Crews ({technicians.length})
          </button>
          <button
            onClick={() => setActiveTab('workorders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'workorders' 
                ? 'bg-[#4b8eff] text-white shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 font-bold' 
                : 'text-[#c1c6d7] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Active Work Orders ({dispatchedFaults.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory' 
                ? 'bg-[#4b8eff] text-white shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 font-bold' 
                : 'text-[#c1c6d7] hover:text-white hover:bg-white/[0.06]'
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
              className="frosted-card rounded-3xl p-6 border border-white/15 hover:border-white/35 transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={tech.avatarUrl}
                      alt={tech.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/30 shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base">{tech.name}</h3>
                      <p className="text-xs text-[#adc6ff] font-medium">{tech.role}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      tech.status === 'En Route'
                        ? 'bg-[#ffda6a]/20 text-[#ffda6a] border-[#ffda6a]/40 shadow-[0_0_10px_rgba(255,218,106,0.25)]'
                        : tech.status === 'On Duty'
                        ? 'bg-[#4b8eff]/20 text-[#4b8eff] border-[#4b8eff]/40 shadow-[0_0_10px_rgba(75,142,255,0.25)]'
                        : 'bg-[#39dcd2]/20 text-[#39dcd2] border-[#39dcd2]/40 shadow-[0_0_10px_rgba(57,220,210,0.25)]'
                    }`}
                  >
                    {tech.status}
                  </span>
                </div>

                <div className="space-y-2.5 py-3.5 border-y border-white/10 text-xs text-[#c1c6d7]">
                  <div className="flex justify-between">
                    <span>Assigned Zone:</span>
                    <span className="font-semibold text-white">{tech.assignedZone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Incident:</span>
                    <span className="font-mono text-[#39dcd2] truncate max-w-[160px]">
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
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all frosted-btn"
                >
                  <Phone className="w-3.5 h-3.5 text-[#39dcd2]" />
                  <span>Call Crew</span>
                </a>
                <button
                  onClick={() => alert(`Direct telemetry comm link established with ${tech.name}`)}
                  className="px-4 py-2.5 rounded-xl bg-[#4b8eff]/20 hover:bg-[#4b8eff] text-[#adc6ff] hover:text-white border border-[#4b8eff]/40 text-xs font-semibold transition-all shadow-sm frosted-btn"
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
            <div className="frosted-panel p-12 text-center rounded-3xl border border-white/20">
              <CheckCircle2 className="w-12 h-12 text-[#39dcd2] mx-auto mb-3 drop-shadow-[0_0_12px_rgba(57,220,210,0.6)]" />
              <p className="text-white font-bold text-lg">No Pending Dispatches</p>
              <p className="text-xs text-[#c1c6d7] mt-1">All reported grid faults are currently assigned and resolved.</p>
            </div>
          ) : (
            dispatchedFaults.map((fault) => (
              <div
                key={fault.id}
                className="frosted-card rounded-3xl p-5 border border-white/15 hover:border-white/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 shadow-[0_0_12px_rgba(255,180,171,0.25)]">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#adc6ff]">{fault.id}</span>
                      <span className="text-xs font-mono text-[#8b90a0]">Ticket: #{fault.ticketNumber}</span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30">
                        {fault.severity}
                      </span>
                      <span className="text-xs text-[#39dcd2] font-semibold bg-[#39dcd2]/15 border border-[#39dcd2]/30 px-2.5 py-0.5 rounded-full">
                        Status: {fault.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1.5">{fault.title}</h3>
                    <p className="text-xs text-[#c1c6d7] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#4b8eff]" />
                      <span>{fault.location} ({fault.zone})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <div className="text-left md:text-right">
                    <p className="text-[11px] text-[#8b90a0]">Assigned Tech</p>
                    <p className="text-xs font-semibold text-white">{fault.assignedTech || 'Pending'}</p>
                    {fault.eta && <p className="text-[10px] text-[#39dcd2] font-mono">ETA: {fault.eta}</p>}
                  </div>

                  <button
                    onClick={() => onOpenFaultDetails(fault)}
                    className="frosted-btn bg-[#4b8eff] hover:bg-[#6ba3ff] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 transition-all"
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
          <div className="frosted-card rounded-3xl p-6 border border-white/15 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-[#4b8eff]/20 border border-[#4b8eff]/30 text-[#4b8eff] shadow-[0_0_12px_rgba(75,142,255,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">LED Driver Modules (120W)</h3>
                <p className="text-xs text-[#c1c6d7]">Stock: 148 Units (Central Hub)</p>
              </div>
            </div>
            <p className="text-xs text-[#c1c6d7] mb-4">Compatible with Luminary-V4 and AuraMesh-Pro 200W luminaires.</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div className="bg-[#39dcd2] h-full rounded-full w-[78%] shadow-[0_0_8px_rgba(57,220,210,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-[#39dcd2] mt-1.5 block">78% Buffer Healthy</span>
          </div>

          <div className="frosted-card rounded-3xl p-6 border border-white/15 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-[#ffda6a]/20 border border-[#ffda6a]/30 text-[#ffda6a] shadow-[0_0_12px_rgba(255,218,106,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Photocell Ambient Lux Sensors</h3>
                <p className="text-xs text-[#c1c6d7]">Stock: 42 Units (Reorder Required)</p>
              </div>
            </div>
            <p className="text-xs text-[#c1c6d7] mb-4">High-precision daylight threshold calibrators (0-2000 lx).</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div className="bg-[#ffda6a] h-full rounded-full w-[28%] shadow-[0_0_8px_rgba(255,218,106,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-[#ffda6a] mt-1.5 block">28% Low Stock</span>
          </div>

          <div className="frosted-card rounded-3xl p-6 border border-white/15 shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3.5 rounded-2xl bg-[#39dcd2]/20 border border-[#39dcd2]/30 text-[#39dcd2] shadow-[0_0_12px_rgba(57,220,210,0.25)]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Solar LiFePO4 Battery Packs</h3>
                <p className="text-xs text-[#c1c6d7]">Stock: 96 Units (Marina & OMR)</p>
              </div>
            </div>
            <p className="text-xs text-[#c1c6d7] mb-4">48V 50Ah replacement storage packs for coastal autonomous poles.</p>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div className="bg-[#39dcd2] h-full rounded-full w-[85%] shadow-[0_0_8px_rgba(57,220,210,0.6)]" />
            </div>
            <span className="text-[10px] font-semibold text-[#39dcd2] mt-1.5 block">85% In Stock</span>
          </div>
        </div>
      )}
    </div>
  );
};
