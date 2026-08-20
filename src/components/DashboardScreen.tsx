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
  Sliders, 
  Power, 
  ExternalLink,
  ShieldAlert,
  Clock,
  BatteryCharging
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
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col lg:flex-row p-3 sm:p-6 gap-4 sm:gap-6">
      {/* Interactive Map Canvas Center-Left */}
      <div className="flex-1 h-full min-h-[350px] relative rounded-3xl overflow-hidden frosted-panel border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col">
        <InteractiveMap
          poles={poles}
          faults={faults}
          selectedPole={selectedPole}
          onSelectPole={onSelectPole}
        />

        {/* Docked Selected Pole Bottom Card */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 frosted-panel rounded-2xl p-4 sm:p-5 border-l-4 border-l-[#39dcd2] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-4">
            {/* Pole Icon Box */}
            <div className="bg-[#1a2030]/80 p-3.5 rounded-2xl border border-white/20 shrink-0 text-[#39dcd2] shadow-inner">
              <Lightbulb className="w-6 h-6 text-[#39dcd2] drop-shadow-[0_0_10px_rgba(57,220,210,0.8)] animate-pulse" />
            </div>

            {/* Pole Name & Meta */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-white font-mono tracking-tight">
                  Pole ID: {selectedPole.id}
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${
                    selectedPole.status === 'active'
                      ? 'bg-[#39dcd2]/20 text-[#39dcd2] border-[#39dcd2]/40 shadow-[0_0_12px_rgba(57,220,210,0.2)]'
                      : selectedPole.status === 'warning'
                      ? 'bg-[#ffda6a]/20 text-[#ffda6a] border-[#ffda6a]/40 shadow-[0_0_12px_rgba(255,218,106,0.2)]'
                      : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/40 shadow-[0_0_12px_rgba(255,180,171,0.2)]'
                  }`}
                >
                  {selectedPole.status}
                </span>
                {selectedPole.solarEquipped && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#4b8eff]/20 text-[#4b8eff] border border-[#4b8eff]/35 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#39dcd2]" />
                    Solar {selectedPole.batteryLevel}%
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#c1c6d7] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#4b8eff] shrink-0" />
                <span>
                  {selectedPole.lat.toFixed(4)}° N, {selectedPole.lng.toFixed(4)}° E • {selectedPole.location}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
            <div className="text-left md:text-right">
              <p className="text-[11px] text-[#8b90a0]">Last Ping</p>
              <p className="text-xs sm:text-sm font-semibold text-white">{selectedPole.lastPing}</p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-[11px] text-[#8b90a0]">Power Draw</p>
              <p className="text-xs sm:text-sm font-semibold text-[#39dcd2] font-mono drop-shadow-[0_0_8px_rgba(57,220,210,0.5)]">
                {selectedPole.powerDraw}W
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTogglePolePower(selectedPole.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedPole.brightness > 0
                    ? 'bg-[#4b8eff]/25 text-[#4b8eff] border-[#4b8eff]/50 hover:bg-[#4b8eff] hover:text-white shadow-[0_0_15px_rgba(75,142,255,0.35)]'
                    : 'bg-white/5 text-[#8b90a0] border-white/10 hover:text-white'
                }`}
                title={selectedPole.brightness > 0 ? 'Turn Off Node' : 'Turn On Node'}
              >
                <Power className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenPoleDetails(selectedPole)}
                className="frosted-btn bg-[#4b8eff]/20 hover:bg-[#4b8eff] text-[#adc6ff] hover:text-white border border-[#4b8eff]/40 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>View Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Panel: Real-Time Telemetry */}
      <aside className="w-full lg:w-84 xl:w-92 shrink-0 h-full overflow-y-auto frosted-panel rounded-3xl p-5 sm:p-6 flex flex-col gap-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/20">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#4b8eff] animate-pulse drop-shadow-[0_0_10px_rgba(75,142,255,0.8)]" />
            <span>Real-Time Telemetry</span>
          </h2>
          <p className="text-xs text-[#c1c6d7] mt-0.5">Chennai Central District</p>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="flex flex-col gap-3.5">
          {/* Stat Card 1: Active Poles */}
          <div className="frosted-card rounded-2xl p-4 flex items-center justify-between border border-white/15 hover:border-[#39dcd2]/50 transition-all shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#00a29a]/20 border border-[#00a29a]/40 flex items-center justify-center text-[#39dcd2] shadow-[0_0_15px_rgba(57,220,210,0.25)]">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Active Poles</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.activePoles.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-[#39dcd2] text-xs font-semibold bg-[#39dcd2]/15 border border-[#39dcd2]/30 px-2.5 py-1 rounded-full shadow-sm">
              +{stats.activePolesDelta} today
            </span>
          </div>

          {/* Stat Card 2: Open Faults */}
          <div 
            onClick={onNavigateToProblems}
            className="frosted-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-[#ffb4ab] border-white/15 hover:border-[#ffb4ab]/50 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#93000a]/25 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab] shadow-[0_0_15px_rgba(255,180,171,0.25)]">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Open Faults</p>
                <p className="text-xl font-bold text-white tracking-tight group-hover:text-[#ffb4ab] transition-colors">
                  {stats.openFaults}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#ffb4ab] font-semibold bg-[#ffb4ab]/20 border border-[#ffb4ab]/30 px-2.5 py-1 rounded-full shadow-sm">
              Action Req.
            </span>
          </div>

          {/* Stat Card 3: Technicians Online */}
          <div className="frosted-card rounded-2xl p-4 flex items-center justify-between border border-white/15 hover:border-[#4b8eff]/50 transition-all shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#4b8eff]/20 border border-[#4b8eff]/40 flex items-center justify-center text-[#4b8eff] shadow-[0_0_15px_rgba(75,142,255,0.25)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Technicians Online</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.techniciansOnline}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#4b8eff] font-semibold bg-[#4b8eff]/15 border border-[#4b8eff]/30 px-2.5 py-1 rounded-full shadow-sm">
              Active Fleet
            </span>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="mt-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c1c6d7]">
              Recent Alerts
            </h3>
            <span className="text-[10px] text-[#8b90a0] font-mono">LIVE SYNC</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.relatedId) {
                    const pole = poles.find(p => p.id === alert.relatedId);
                    if (pole) onSelectPole(pole);
                  }
                }}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] cursor-pointer transition-all border border-white/5 hover:border-white/15 shadow-sm"
              >
                <div className="mt-0.5 shrink-0">
                  {alert.type === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-[#ffb4ab] animate-pulse drop-shadow-[0_0_6px_rgba(255,180,171,0.8)]" />
                  ) : (
                    <Zap className="w-4 h-4 text-[#ffda6a] drop-shadow-[0_0_6px_rgba(255,218,106,0.8)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                  <p className="text-[11px] text-[#c1c6d7] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#8b90a0]" />
                    <span>{alert.subtitle}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dispatch CTA */}
          <div className="pt-4 border-t border-white/10 mt-auto">
            <button
              onClick={onNavigateToReport}
              className="w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-[#4b8eff]/20 border border-white/15 hover:border-[#4b8eff]/40 text-xs font-semibold text-[#4b8eff] hover:text-white flex items-center justify-center gap-2 transition-all shadow-md frosted-btn"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Log Manual Grid Anomaly</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
