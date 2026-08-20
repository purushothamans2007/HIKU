import React from 'react';
import { StreetLightPole, FaultReport, GridTelemetryStats, AlertNotification } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { 
  Activity, 
  Lightbulb, 
  AlertOctagon, 
  Users, 
  MapPin, 
  Zap, 
  Power, 
  ExternalLink,
  ShieldAlert,
  Clock,
  BatteryCharging,
  ChevronRight,
  Compass,
  Droplets,
  Sparkles
} from 'lucide-react';

interface DashboardScreenProps {
  poles: StreetLightPole[];
  faults: FaultReport[];
  stats: GridTelemetryStats;
  alerts: AlertNotification[];
  selectedPole: StreetLightPole;
  onSelectPole: (pole: StreetLightPole) => void;
  onOpenPoleDetails: (pole: StreetLightPole) => void;
  onTogglePolePower: (poleId: string) => void;
  onUpdatePoleBrightness: (poleId: string, brightness: number) => void;
  onNavigateToProblems: () => void;
  onNavigateToReport: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  poles,
  faults,
  stats,
  alerts,
  selectedPole,
  onSelectPole,
  onOpenPoleDetails,
  onTogglePolePower,
  onUpdatePoleBrightness,
  onNavigateToProblems,
  onNavigateToReport
}) => {
  const getStatusColor = (status: StreetLightPole['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_14px_rgba(52,211,153,0.3)]';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_14px_rgba(251,191,36,0.3)]';
      case 'offline':
      case 'fault':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_14px_rgba(248,113,113,0.3)]';
    }
  };

  // Selected Pole Quick Card in Crystal Liquid Glass
  const renderPoleDetailsCard = () => (
    <div className="liquid-frame p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300 border border-white/40 shadow-2xl">
      <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        {/* Pole Status Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/35 shrink-0 text-emerald-300 flex items-center justify-center shadow-inner">
          <Lightbulb className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
        </div>

        {/* Pole Identity & Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base sm:text-lg text-white font-mono tracking-tight">
              {selectedPole.id}
            </h3>
            <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${getStatusColor(selectedPole.status)}`}>
              {selectedPole.status}
            </span>
            {selectedPole.solarEquipped && (
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-300 border border-white/30 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                Solar {selectedPole.batteryLevel}%
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {selectedPole.location} • {selectedPole.lat.toFixed(4)}°N, {selectedPole.lng.toFixed(4)}°E
            </span>
          </p>
        </div>
      </div>

      {/* Metrics & Action Controls */}
      <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/15 shrink-0">
        <div className="text-left md:text-right">
          <p className="text-[10px] sm:text-[11px] text-slate-400">Last Ping</p>
          <p className="text-xs sm:text-sm font-semibold text-white">{selectedPole.lastPing}</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-[10px] sm:text-[11px] text-slate-400">Power Draw</p>
          <p className="text-xs sm:text-sm font-semibold text-emerald-300 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            {selectedPole.powerDraw}W
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* External Satellite Map Launcher */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedPole.lat},${selectedPole.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-xl border border-white/35 bg-white/10 hover:bg-white/25 text-white transition-all shadow-sm"
            title="Open in Google Maps"
          >
            <Compass className="w-4 h-4 text-emerald-300" />
          </a>

          {/* Toggle Power Switch */}
          <button
            onClick={() => onTogglePolePower(selectedPole.id)}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
              selectedPole.brightness > 0
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 hover:bg-emerald-500 hover:text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'bg-white/5 text-slate-400 border-white/15 hover:text-white'
            }`}
            title={selectedPole.brightness > 0 ? 'Turn Off Node' : 'Turn On Node'}
          >
            <Power className="w-4 h-4" />
          </button>

          {/* Full Diagnostics Modal Trigger */}
          <button
            onClick={() => onOpenPoleDetails(selectedPole)}
            className="liquid-btn bg-white hover:bg-slate-100 text-slate-950 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 border border-white/80"
          >
            <span>Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row p-3 sm:p-5 lg:p-6 gap-4 sm:gap-6 pb-36 lg:pb-6">
      {/* Left Column: Interactive Real-Time Map & Controls */}
      <div className="flex-1 w-full flex flex-col gap-4 lg:h-full shrink-0 lg:shrink min-w-0">
        {/* Map Container */}
        <div className="w-full h-[380px] sm:h-[480px] lg:h-full relative rounded-3xl overflow-hidden liquid-frame shadow-2xl flex flex-col border border-white/35">
          <InteractiveMap
            poles={poles}
            faults={faults}
            selectedPole={selectedPole}
            onSelectPole={onSelectPole}
          />

          {/* Desktop Only: Docked Bottom Pole Card */}
          <div className="hidden lg:block absolute bottom-4 left-4 right-4 z-30 pointer-events-auto">
            {renderPoleDetailsCard()}
          </div>
        </div>

        {/* Mobile & Tablet Only: Stacked Clean Pole Details */}
        <div className="block lg:hidden w-full">
          {renderPoleDetailsCard()}
        </div>
      </div>

      {/* Right Sidebar Panel: Real-Time Telemetry & Live Alerts */}
      <aside className="w-full lg:w-80 xl:w-92 shrink-0 h-auto lg:h-full overflow-y-auto liquid-frame p-4 sm:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6 shadow-2xl border border-white/35">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Droplets className="w-5 h-5 text-emerald-400 animate-pulse drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span>Real-Time Telemetry</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">Chennai Smart Grid Water Monitor</p>
        </div>

        {/* Telemetry Stat Cards in Crystal Liquid Glass Frame */}
        <div className="flex flex-col gap-3">
          {/* Stat Card 1: Active Poles */}
          <div className="liquid-card rounded-2xl p-4 flex items-center justify-between border border-white/25 hover:border-white/60 transition-all shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-300">Active Poles</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.activePoles.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-emerald-300 text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 rounded-full shadow-sm">
              +{stats.activePolesDelta} today
            </span>
          </div>

          {/* Stat Card 2: Open Faults */}
          <div 
            onClick={onNavigateToProblems}
            className="liquid-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-rose-500 border-white/20 hover:border-rose-400/70 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-[0_0_15px_rgba(248,113,113,0.3)]">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-300">Open Faults</p>
                <p className="text-xl font-bold text-white tracking-tight group-hover:text-rose-300 transition-colors">
                  {stats.openFaults}
                </p>
              </div>
            </div>
            <span className="text-xs text-rose-300 font-semibold bg-rose-500/20 border border-rose-400/40 px-2.5 py-1 rounded-full shadow-sm">
              Action Req.
            </span>
          </div>

          {/* Stat Card 3: Technicians Online */}
          <div className="liquid-card rounded-2xl p-4 flex items-center justify-between border border-white/25 hover:border-white/60 transition-all shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.25)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-300">Technicians Online</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.techniciansOnline}
                </p>
              </div>
            </div>
            <span className="text-xs text-teal-300 font-semibold bg-teal-500/20 border border-teal-400/40 px-2.5 py-1 rounded-full shadow-sm">
              Active Fleet
            </span>
          </div>
        </div>

        {/* Live Alerts Stream */}
        <div className="mt-1 flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Live Alert Stream
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-56 lg:max-h-none">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.relatedId) {
                    const pole = poles.find(p => p.id === alert.relatedId);
                    if (pole) onSelectPole(pole);
                  }
                }}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] cursor-pointer transition-all border border-white/15 hover:border-white/40 shadow-sm"
              >
                <div className="mt-0.5 shrink-0">
                  {alert.type === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{alert.subtitle}</span>
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center shrink-0" />
              </div>
            ))}
          </div>

          {/* Anomaly Dispatch Action */}
          <div className="pt-3 border-t border-white/15 mt-auto">
            <button
              onClick={onNavigateToReport}
              className="w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/40 hover:border-white text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md liquid-btn"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-300" />
              <span>Report Grid Anomaly</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
