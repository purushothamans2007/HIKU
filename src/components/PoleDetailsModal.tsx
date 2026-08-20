import React, { useState } from 'react';
import { StreetLightPole } from '../types';
import { 
  X, 
  Lightbulb, 
  Power, 
  Sun, 
  Zap, 
  Thermometer, 
  BatteryCharging, 
  Cpu, 
  Check, 
  Sliders, 
  AlertTriangle,
  Droplets
} from 'lucide-react';

interface PoleDetailsModalProps {
  pole: StreetLightPole | null;
  onClose: () => void;
  onUpdateBrightness: (poleId: string, brightness: number) => void;
  onTogglePower: (poleId: string) => void;
  onReportIssue: () => void;
}

export const PoleDetailsModal: React.FC<PoleDetailsModalProps> = ({
  pole,
  onClose,
  onUpdateBrightness,
  onTogglePower,
  onReportIssue
}) => {
  if (!pole) return null;

  const [brightness, setBrightness] = useState(pole.brightness);
  const [isSaved, setIsSaved] = useState(false);
  const [overrideMode, setOverrideMode] = useState<'auto' | 'manual' | 'eco'>('auto');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBrightness(val);
    onUpdateBrightness(pole.id, val);
  };

  const handleSaveProtocol = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-2xl frosted-panel rounded-3xl p-6 sm:p-8 border border-white/30 shadow-[0_32px_80px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-white to-teal-300 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/30 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {pole.id}
                </h2>
                <span className={`text-xs px-3 py-0.5 rounded-full font-bold uppercase border ${
                  pole.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]' :
                  pole.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]' :
                  'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(248,113,113,0.3)]'
                }`}>
                  {pole.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {pole.name} • {pole.location} ({pole.zone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/15 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 overflow-y-auto pr-1">
          {/* Live Interactive Luminaire Controls */}
          <div className="frosted-card rounded-3xl p-5 border border-white/25 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Real-Time Lux & Luminaire Dimmer
                </h4>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-300 bg-white/10 px-3 py-1 rounded-xl border border-white/20 shadow-inner">
                {brightness}% Output
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={handleSliderChange}
                className="w-full h-2.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/20"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0% (Standby Off)</span>
                <span>50% (Eco Night)</span>
                <span>100% (High Density)</span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2.5 mt-4 pt-4 border-t border-white/15">
              <button
                onClick={() => setOverrideMode('auto')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'auto'
                    ? 'bg-white text-slate-950 shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white font-bold'
                    : 'bg-white/[0.06] text-slate-300 hover:text-white border border-white/15'
                }`}
              >
                Auto (Photocell)
              </button>
              <button
                onClick={() => setOverrideMode('eco')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'eco'
                    ? 'bg-emerald-400 text-slate-950 shadow-[0_4px_16px_rgba(52,211,153,0.4)] border border-emerald-300 font-bold'
                    : 'bg-white/[0.06] text-slate-300 hover:text-white border border-white/15'
                }`}
              >
                Eco Adaptive
              </button>
              <button
                onClick={() => setOverrideMode('manual')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'manual'
                    ? 'bg-teal-300 text-slate-950 shadow-[0_4px_16px_rgba(45,212,191,0.4)] border border-teal-200 font-bold'
                    : 'bg-white/[0.06] text-slate-300 hover:text-white border border-white/15'
                }`}
              >
                Manual Lock
              </button>
            </div>
          </div>

          {/* Telemetry Sensor Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="frosted-card rounded-2xl p-3.5 border border-white/20 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Power Draw</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.powerDraw}W</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Voltage: {pole.voltage}V</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/20 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Ambient Lux</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.ambientLux} lx</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Photocell Active</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/20 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-teal-300" />
                <span>Operating Temp</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.temperature}°C</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Optimal Range</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/20 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>Solar Battery</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                {pole.solarEquipped ? `${pole.batteryLevel}%` : 'Grid Direct'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {pole.solarEquipped ? 'Solar Charging' : 'AC 230V Feeder'}
              </p>
            </div>
          </div>

          {/* Node Hardware Specifications */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 space-y-2 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Hardware & Gateway Telemetry</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-slate-300">
              <div>Model: <span className="text-white font-medium">{pole.hardwareModel}</span></div>
              <div>Firmware: <span className="font-mono text-white">{pole.firmware}</span></div>
              <div>Ward / Zone: <span className="text-white">{pole.ward}, {pole.zone}</span></div>
              <div>Last Ping: <span className="text-emerald-300 font-semibold">{pole.lastPing}</span></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onReportIssue();
            }}
            className="text-xs font-semibold text-rose-300 hover:bg-rose-500/20 border border-rose-400/30 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 frosted-btn"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Issue on this Node</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onTogglePower(pole.id)}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-semibold text-white transition-all flex items-center gap-1.5 frosted-btn"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Toggle Standby</span>
            </button>

            <button
              onClick={handleSaveProtocol}
              className="frosted-btn px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white transition-all flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protocol Saved</span>
                </>
              ) : (
                <span>Apply Grid Profile</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
