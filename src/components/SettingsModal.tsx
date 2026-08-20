import React, { useState } from 'react';
import { X, Settings, Sliders, Moon, Sun, Shield, Bell, Check, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [luxThreshold, setLuxThreshold] = useState(25);
  const [ecoDimmingEnabled, setEcoDimmingEnabled] = useState(true);
  const [autoDispatchCritical, setAutoDispatchCritical] = useState(true);
  const [voltageAlertThreshold, setVoltageAlertThreshold] = useState(210);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg frosted-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#4b8eff]/20 border border-[#4b8eff]/30 text-[#4b8eff] shadow-[0_0_12px_rgba(75,142,255,0.25)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Grid Alpha Settings</h2>
              <p className="text-xs text-[#c1c6d7]">Municipal telemetry & automation parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Photocell Dusk Sensitivity */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                Photocell Dusk Lux Trigger
              </span>
              <span className="font-mono text-[#39dcd2] font-bold bg-[#39dcd2]/15 px-2.5 py-0.5 rounded-lg border border-[#39dcd2]/30">
                {luxThreshold} lx
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={luxThreshold}
              onChange={(e) => setLuxThreshold(Number(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#4b8eff] border border-white/10"
            />
            <p className="text-[11px] text-[#8b90a0]">
              Activates automated dusk illumination when natural sunlight falls below this threshold.
            </p>
          </div>

          {/* Eco Dimming */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-white uppercase tracking-wider">
                Adaptive Midnight Eco Dimming (50%)
              </p>
              <p className="text-[11px] text-[#8b90a0] mt-0.5">
                Automatically dims low-traffic highway sectors between 00:00 and 04:30.
              </p>
            </div>
            <button
              onClick={() => setEcoDimmingEnabled(!ecoDimmingEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-white/20 ${
                ecoDimmingEnabled ? 'bg-[#39dcd2] shadow-[0_0_10px_rgba(57,220,210,0.5)]' : 'bg-black/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  ecoDimmingEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Dispatch Critical Alerts */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-white uppercase tracking-wider">
                Auto-Dispatch Critical Faults
              </p>
              <p className="text-[11px] text-[#8b90a0] mt-0.5">
                Immediately generates priority dispatch tickets to nearest on-duty technician.
              </p>
            </div>
            <button
              onClick={() => setAutoDispatchCritical(!autoDispatchCritical)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-white/20 ${
                autoDispatchCritical ? 'bg-[#4b8eff] shadow-[0_0_10px_rgba(75,142,255,0.5)]' : 'bg-black/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  autoDispatchCritical ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voltage Threshold */}
          <div className="frosted-card rounded-2xl p-4 border border-white/15 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                Under-Voltage Trip Threshold
              </span>
              <span className="font-mono text-[#ffb4ab] font-bold bg-[#ffb4ab]/15 px-2.5 py-0.5 rounded-lg border border-[#ffb4ab]/30">
                {voltageAlertThreshold}V
              </span>
            </div>
            <input
              type="range"
              min="180"
              max="225"
              value={voltageAlertThreshold}
              onChange={(e) => setVoltageAlertThreshold(Number(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#ffb4ab] border border-white/10"
            />
            <p className="text-[11px] text-[#8b90a0]">
              Triggers #FLT warning when feeder line drop exceeds standard 230V ±8% tolerance.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c1c6d7] hover:text-white transition-colors frosted-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="frosted-btn px-6 py-2.5 rounded-2xl bg-[#4b8eff] hover:bg-[#6ba3ff] text-white text-xs font-bold shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30 flex items-center gap-1.5 transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Settings Saved' : 'Save Parameters'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
