import React from 'react';
import { X, HelpCircle, PhoneCall, Radio, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Hiku Grid Support</h2>
              <p className="text-xs text-[#c1c6d7]">Municipal telemetry & emergency dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3.5 text-xs">
          <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-[#39dcd2]" />
              <div>
                <p className="font-bold text-white">Emergency Grid Hotline</p>
                <p className="text-[#8b90a0]">24/7 Dedicated Dispatch line</p>
              </div>
            </div>
            <a
              href="tel:1800-425-4458"
              className="px-3 py-1.5 rounded-lg bg-[#39dcd2]/20 text-[#39dcd2] font-semibold hover:bg-[#39dcd2] hover:text-[#003734] transition-colors"
            >
              1800-HIKU-GRID
            </a>
          </div>

          <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-[#4b8eff]" />
              <div>
                <p className="font-bold text-white">Field Radio Channel</p>
                <p className="text-[#8b90a0]">Chennai Alpha VHF Emergency</p>
              </div>
            </div>
            <span className="font-mono text-primary font-bold">142.850 MHz</span>
          </div>

          <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#ffda6a]" />
              <div>
                <p className="font-bold text-white">Luminaire Maintenance Manual</p>
                <p className="text-[#8b90a0]">Wiring schematics & photocell specs</p>
              </div>
            </div>
            <button
              onClick={() => alert('Opening Hiku Luminary-V4 Hardware Operations Guide PDF...')}
              className="p-2 text-primary hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
