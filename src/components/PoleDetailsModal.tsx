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
  Activity, 
  Check, 
  Sliders, 
  AlertTriangle 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-2xl frosted-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#39dcd2] via-[#4b8eff] to-[#adc6ff] shadow-[0_0_12px_rgba(75,142,255,0.8)]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-[#4b8eff]/20 border border-[#4b8eff]/30 text-[#39dcd2] shadow-[0_0_15px_rgba(57,220,210,0.3)]">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {pole.id}
                </h2>
                <span className={`text-xs px-3 py-0.5 rounded-full font-bold uppercase border ${
                  pole.status === 'active' ? 'bg-[#39dcd2]/20 text-[#39dcd2] border-[#39dcd2]/40 shadow-[0_0_10px_rgba(57,220,210,0.3)]' :
                  pole.status === 'warning' ? 'bg-[#ffda6a]/20 text-[#ffda6a] border-[#ffda6a]/40 shadow-[0_0_10px_rgba(255,218,106,0.3)]' :
                  'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/40 shadow-[0_0_10px_rgba(255,180,171,0.3)]'
                }`}>
                  {pole.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#c1c6d7] mt-0.5">
                {pole.name} • {pole.location} ({pole.zone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 overflow-y-auto pr-1">
          {/* Live Interactive Luminaire Controls */}
          <div className="frosted-card rounded-3xl p-5 border border-white/15 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#4b8eff]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Real-Time Lux & Luminaire Dimmer
                </h4>
              </div>
              <span className="font-mono text-sm font-bold text-[#adc6ff] bg-[#4b8eff]/15 px-3 py-1 rounded-xl border border-[#4b8eff]/30 shadow-inner">
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
                className="w-full h-2.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#4b8eff] border border-white/10"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8b90a0]">
                <span>0% (Standby Off)</span>
                <span>50% (Eco Night)</span>
                <span>100% (High Density)</span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2.5 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setOverrideMode('auto')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'auto'
                    ? 'bg-[#4b8eff] text-white shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 font-bold'
                    : 'bg-white/[0.04] text-[#c1c6d7] hover:text-white border border-white/10'
                }`}
              >
                Auto (Photocell)
              </button>
              <button
                onClick={() => setOverrideMode('eco')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'eco'
                    ? 'bg-[#39dcd2] text-[#003734] shadow-[0_4px_16px_rgba(57,220,210,0.4)] border border-white/30 font-bold'
                    : 'bg-white/[0.04] text-[#c1c6d7] hover:text-white border border-white/10'
                }`}
              >
                Eco Adaptive
              </button>
              <button
                onClick={() => setOverrideMode('manual')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all frosted-btn ${
                  overrideMode === 'manual'
                    ? 'bg-[#6ba3ff] text-white shadow-[0_4px_16px_rgba(107,163,255,0.4)] border border-white/30 font-bold'
                    : 'bg-white/[0.04] text-[#c1c6d7] hover:text-white border border-white/10'
                }`}
              >
                Manual Lock
              </button>
            </div>
          </div>

          {/* Telemetry Sensor Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="frosted-card rounded-2xl p-3.5 border border-white/15 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Zap className="w-3.5 h-3.5 text-[#39dcd2]" />
                <span>Power Draw</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.powerDraw}W</p>
              <p className="text-[10px] text-[#39dcd2] mt-0.5">Voltage: {pole.voltage}V</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/15 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Sun className="w-3.5 h-3.5 text-[#ffda6a]" />
                <span>Ambient Lux</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.ambientLux} lx</p>
              <p className="text-[10px] text-[#8b90a0] mt-0.5">Photocell Active</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/15 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Thermometer className="w-3.5 h-3.5 text-[#4b8eff]" />
                <span>Operating Temp</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.temperature}°C</p>
              <p className="text-[10px] text-[#39dcd2] mt-0.5">Optimal Range</p>
            </div>

            <div className="frosted-card rounded-2xl p-3.5 border border-white/15 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-[#39dcd2]" />
                <span>Solar Battery</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                {pole.solarEquipped ? `${pole.batteryLevel}%` : 'Grid Direct'}
              </p>
              <p className="text-[10px] text-[#8b90a0] mt-0.5">
                {pole.solarEquipped ? 'Solar Charging' : 'AC 230V Feeder'}
              </p>
            </div>
          </div>

          {/* Node Hardware Specifications */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 space-y-2 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Cpu className="w-4 h-4 text-[#4b8eff]" />
              <span>Hardware & Gateway Telemetry</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-[#c1c6d7]">
              <div>Model: <span className="text-white font-medium">{pole.hardwareModel}</span></div>
              <div>Firmware: <span className="font-mono text-white">{pole.firmware}</span></div>
              <div>Ward / Zone: <span className="text-white">{pole.ward}, {pole.zone}</span></div>
              <div>Last Ping: <span className="text-[#39dcd2] font-semibold">{pole.lastPing}</span></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onReportIssue();
            }}
            className="text-xs font-semibold text-[#ffb4ab] hover:bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 frosted-btn"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Issue on this Node</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onTogglePower(pole.id)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all flex items-center gap-1.5 frosted-btn"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Toggle Standby</span>
            </button>

            <button
              onClick={handleSaveProtocol}
              className="frosted-btn px-5 py-2.5 rounded-2xl bg-[#4b8eff] hover:bg-[#6ba3ff] text-white text-xs font-bold shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 transition-all flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
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
