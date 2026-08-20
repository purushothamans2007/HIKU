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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#39dcd2] via-[#4b8eff] to-[#adc6ff]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#292a2e] border border-white/15 text-[#39dcd2]">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {pole.id}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  pole.status === 'active' ? 'bg-[#39dcd2]/20 text-[#39dcd2]' :
                  pole.status === 'warning' ? 'bg-[#ffda6a]/20 text-[#ffda6a]' :
                  'bg-[#ffb4ab]/20 text-[#ffb4ab]'
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
            className="p-1.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 overflow-y-auto pr-1">
          {/* Live Interactive Luminaire Controls */}
          <div className="glass-card rounded-2xl p-5 border border-white/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Real-Time Lux & Luminaire Dimmer
                </h4>
              </div>
              <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
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
                className="w-full h-2.5 bg-[#121317] rounded-lg appearance-none cursor-pointer accent-[#4b8eff]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8b90a0]">
                <span>0% (Standby Off)</span>
                <span>50% (Eco Night)</span>
                <span>100% (High Density)</span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setOverrideMode('auto')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  overrideMode === 'auto'
                    ? 'bg-primary text-[#001a41] shadow'
                    : 'bg-white/5 text-[#c1c6d7] hover:text-white'
                }`}
              >
                Auto (Photocell)
              </button>
              <button
                onClick={() => setOverrideMode('eco')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  overrideMode === 'eco'
                    ? 'bg-[#39dcd2] text-[#003734] shadow'
                    : 'bg-white/5 text-[#c1c6d7] hover:text-white'
                }`}
              >
                Eco Adaptive
              </button>
              <button
                onClick={() => setOverrideMode('manual')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  overrideMode === 'manual'
                    ? 'bg-[#4b8eff] text-white shadow'
                    : 'bg-white/5 text-[#c1c6d7] hover:text-white'
                }`}
              >
                Manual Lock
              </button>
            </div>
          </div>

          {/* Telemetry Sensor Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Zap className="w-3.5 h-3.5 text-[#39dcd2]" />
                <span>Power Draw</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.powerDraw}W</p>
              <p className="text-[10px] text-[#39dcd2] mt-0.5">Voltage: {pole.voltage}V</p>
            </div>

            <div className="glass-card rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Sun className="w-3.5 h-3.5 text-[#ffda6a]" />
                <span>Ambient Lux</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.ambientLux} lx</p>
              <p className="text-[10px] text-[#8b90a0] mt-0.5">Photocell Active</p>
            </div>

            <div className="glass-card rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-[#8b90a0] mb-1">
                <Thermometer className="w-3.5 h-3.5 text-primary" />
                <span>Operating Temp</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">{pole.temperature}°C</p>
              <p className="text-[10px] text-[#39dcd2] mt-0.5">Optimal Range</p>
            </div>

            <div className="glass-card rounded-xl p-3.5 border border-white/10">
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
          <div className="glass-card rounded-xl p-4 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Cpu className="w-4 h-4 text-primary" />
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
            className="text-xs font-semibold text-[#ffb4ab] hover:bg-[#ffb4ab]/10 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Issue on this Node</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onTogglePower(pole.id)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Toggle Standby</span>
            </button>

            <button
              onClick={handleSaveProtocol}
              className="liquid-btn px-5 py-2 rounded-xl bg-primary hover:bg-[#d8e2ff] text-[#001a41] text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
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
