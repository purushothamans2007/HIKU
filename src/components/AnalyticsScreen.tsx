import React from 'react';
import { GridTelemetryStats } from '../types';
import { BarChart3, Zap, TrendingUp, Sun, Leaf, BatteryCharging, Droplets } from 'lucide-react';

interface AnalyticsScreenProps {
  stats: GridTelemetryStats;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ stats }) => {
  // 24-hour energy telemetry distribution
  const hourlyData = [
    { hour: '18:00', kw: 180, solar: 60, status: 'Dusk Protocol' },
    { hour: '20:00', kw: 420, solar: 110, status: 'Peak High' },
    { hour: '22:00', kw: 410, solar: 100, status: 'Full Night' },
    { hour: '00:00', kw: 290, solar: 80, status: 'Eco Dimmed' },
    { hour: '02:00', kw: 240, solar: 70, status: 'Low Traffic 50%' },
    { hour: '04:00', kw: 260, solar: 65, status: 'Pre-Dawn' },
    { hour: '06:00', kw: 120, solar: 40, status: 'Sunrise Off' }
  ];

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
              Energy Intelligence & Telemetry
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300">
            Automated power consumption, photocell efficiency, and renewable solar metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 frosted-panel py-2 px-3.5 rounded-2xl border border-white/30 text-xs shadow-md">
          <span className="text-slate-400">Telemetry Stream:</span>
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-ping" />
            Active 100Hz
          </span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="frosted-card rounded-3xl p-5 border border-white/25 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>24h Power Consumption</span>
            <Zap className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.totalEnergyKwh} kWh</p>
          <div className="flex items-center gap-1 text-xs text-emerald-300 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>-18.4% vs Unmanaged Baseline</span>
          </div>
        </div>

        <div className="frosted-card rounded-3xl p-5 border border-white/25 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Eco Dimming Savings</span>
            <Leaf className="w-4 h-4 text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.energySavedPercent}%</p>
          <p className="text-xs text-slate-300 mt-2">3,420 kg CO2 Offset This Month</p>
        </div>

        <div className="frosted-card rounded-3xl p-5 border border-white/25 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Solar Battery Yield</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.solarStoredKwh} kWh</p>
          <p className="text-xs text-slate-300 mt-2">484 Autonomous Coastal Poles</p>
        </div>

        <div className="frosted-card rounded-3xl p-5 border border-white/25 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Average Fleet Brightness</span>
            <Sun className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.avgBrightness}%</p>
          <p className="text-xs text-slate-400 mt-2">Adaptive Lux Modulation</p>
        </div>
      </div>

      {/* Hourly Power Graph Bar Chart */}
      <div className="frosted-panel rounded-3xl p-6 sm:p-8 border border-white/30 shadow-[0_24px_60px_rgba(0,0,0,0.6)] mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">24-Hour Nightload Power Draw Profile</h3>
            <p className="text-xs text-slate-300">Real-time kilowatt (kW) draw vs solar battery contribution.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-slate-300">AC Grid Draw (kW)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300">Solar Storage (kW)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-64 pt-8 pb-2 border-b border-white/15">
          {hourlyData.map((d, i) => {
            const heightPercent = (d.kw / 500) * 100;
            const solarPercent = (d.solar / 500) * 100;

            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono frosted-panel text-white px-2.5 py-1 rounded-xl border border-white/30 mb-2 whitespace-nowrap shadow-xl">
                  {d.kw} kW ({d.status})
                </div>

                <div className="w-full max-w-[48px] flex flex-col gap-1 items-center justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-white/40 via-white/80 to-white rounded-t-xl shadow-[0_4px_16px_rgba(255,255,255,0.3)] group-hover:brightness-125 transition-all"
                  />
                  <div
                    style={{ height: `${solarPercent}%` }}
                    className="w-full bg-emerald-400 rounded-t-md opacity-90 shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-3">{d.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Efficiency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="frosted-card rounded-3xl p-6 border border-white/25 shadow-lg">
          <h3 className="text-base font-bold text-white mb-4">Grid Zone Efficiency Ranking</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Marina East Node (Solar Hybrid)</span>
                <span className="text-emerald-300 font-bold">98.4% Efficiency</span>
              </div>
              <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
                <div className="bg-emerald-400 h-full rounded-full w-[98.4%] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Central Grid (Anna Salai & Guindy)</span>
                <span className="text-teal-300 font-bold">92.1% Efficiency</span>
              </div>
              <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
                <div className="bg-teal-400 h-full rounded-full w-[92.1%] shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>South Sector (OMR & Besant Nagar)</span>
                <span className="text-amber-300 font-bold">87.5% Efficiency</span>
              </div>
              <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
                <div className="bg-amber-400 h-full rounded-full w-[87.5%] shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>North Grid (Anna Nagar Industrial)</span>
                <span className="text-rose-300 font-bold">81.0% (Incident Investigation)</span>
              </div>
              <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/15 p-0.5">
                <div className="bg-rose-400 h-full rounded-full w-[81%] shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="frosted-card rounded-3xl p-6 border border-white/25 flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Automated Dusk-to-Dawn AI Telemetry</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Hiku’s adaptive algorithm modulates light levels based on real-time ambient lux photocell readings, weather cloud cover, and pedestrian radar telemetry.
            </p>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-emerald-300">
                <span>Cloud Cover Telemetry:</span>
                <span>12% (Clear Skies)</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Scheduled Dusk Trigger:</span>
                <span>18:14 IST (+10m)</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Midnight Dim Protocol:</span>
                <span>00:30 IST (50% Output)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert('Diagnostic energy telemetry report exported (PDF/CSV).')}
            className="w-full mt-4 py-3 rounded-2xl bg-white/15 hover:bg-white text-white hover:text-slate-950 font-bold border border-white/30 hover:border-white text-xs transition-all frosted-btn"
          >
            Export Comprehensive ESG Grid Report
          </button>
        </div>
      </div>
    </div>
  );
};
