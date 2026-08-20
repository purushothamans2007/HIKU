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
      <div className="flex-1 h-full min-h-[350px] relative rounded-2xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col">
        <InteractiveMap
          poles={poles}
          faults={faults}
          selectedPole={selectedPole}
          onSelectPole={onSelectPole}
        />

        {/* Docked Selected Pole Bottom Card (Matching Screenshot 3) */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 glass-panel rounded-2xl p-4 sm:p-5 border-l-4 border-l-[#39dcd2] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-4">
            {/* Pole Icon Box */}
            <div className="bg-[#292a2e]/80 p-3 rounded-xl border border-white/10 shrink-0 text-[#39dcd2] shadow-inner">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>

            {/* Pole Name & Meta */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Pole ID: {selectedPole.id}
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${
                    selectedPole.status === 'active'
                      ? 'bg-[#39dcd2]/20 text-[#39dcd2] border-[#39dcd2]/40'
                      : selectedPole.status === 'warning'
                      ? 'bg-[#ffda6a]/20 text-[#ffda6a] border-[#ffda6a]/40'
                      : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/40'
                  }`}
                >
                  {selectedPole.status}
                </span>
                {selectedPole.solarEquipped && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#4b8eff]/20 text-[#4b8eff] border border-[#4b8eff]/30 flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3" />
                    Solar {selectedPole.batteryLevel}%
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#c1c6d7] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
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
              <p className="text-xs sm:text-sm font-semibold text-[#39dcd2] font-mono">
                {selectedPole.powerDraw}W
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTogglePolePower(selectedPole.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedPole.brightness > 0
                    ? 'bg-[#4b8eff]/20 text-[#4b8eff] border-[#4b8eff]/40 hover:bg-[#4b8eff] hover:text-white'
                    : 'bg-white/5 text-[#8b90a0] border-white/10 hover:text-white'
                }`}
                title={selectedPole.brightness > 0 ? 'Turn Off Node' : 'Turn On Node'}
              >
                <Power className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenPoleDetails(selectedPole)}
                className="liquid-btn bg-[#4b8eff]/20 hover:bg-[#4b8eff] text-primary hover:text-white border border-[#4b8eff]/40 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>View Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Panel: Real-Time Telemetry (Matching Screenshot 3) */}
      <aside className="w-full lg:w-84 xl:w-92 shrink-0 h-full overflow-y-auto glass-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-2xl border border-white/15">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <span>Real-Time Telemetry</span>
          </h2>
          <p className="text-xs text-[#c1c6d7] mt-0.5">Chennai Central District</p>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="flex flex-col gap-3.5">
          {/* Stat Card 1: Active Poles */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10 hover:border-[#39dcd2]/40 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#00a29a]/20 border border-[#00a29a]/30 flex items-center justify-center text-[#39dcd2]">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Active Poles</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.activePoles.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-[#39dcd2] text-xs font-semibold bg-[#39dcd2]/10 border border-[#39dcd2]/20 px-2.5 py-1 rounded-full">
              +{stats.activePolesDelta} today
            </span>
          </div>

          {/* Stat Card 2: Open Faults */}
          <div 
            onClick={onNavigateToProblems}
            className="glass-card rounded-xl p-4 flex items-center justify-between border-l-4 border-l-[#ffb4ab] border-white/10 hover:border-[#ffb4ab]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#93000a]/25 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab]">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Open Faults</p>
                <p className="text-xl font-bold text-white tracking-tight group-hover:text-[#ffb4ab] transition-colors">
                  {stats.openFaults}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#ffb4ab] font-semibold bg-[#ffb4ab]/15 px-2.5 py-1 rounded-full">
              Action Req.
            </span>
          </div>

          {/* Stat Card 3: Technicians Online */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#4b8eff]/20 border border-[#4b8eff]/30 flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#c1c6d7]">Technicians Online</p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {stats.techniciansOnline}
                </p>
              </div>
            </div>
            <span className="text-xs text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
              Active Fleet
            </span>
          </div>
        </div>

        {/* Recent Alerts Feed (Matching Screenshot 3) */}
        <div className="mt-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c1c6d7]">
              Recent Alerts
            </h3>
            <span className="text-[10px] text-[#8b90a0]">Live Feed</span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.relatedId) {
                    const pole = poles.find(p => p.id === alert.relatedId);
                    if (pole) onSelectPole(pole);
                  }
                }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
              >
                <div className="mt-0.5 shrink-0">
                  {alert.type === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-[#ffb4ab] animate-pulse" />
                  ) : (
                    <Zap className="w-4 h-4 text-[#ffda6a]" />
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
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-primary hover:text-white flex items-center justify-center gap-1.5 transition-all"
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
