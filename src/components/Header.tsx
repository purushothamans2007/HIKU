import React, { useState } from 'react';
import { Search, Bell, Settings, User, AlertCircle, CheckCircle2, ChevronRight, X, Droplets, Sparkles } from 'lucide-react';
import { AlertNotification, StreetLightPole, FaultReport } from '../types';

interface HeaderProps {
  notifications: AlertNotification[];
  onOpenSettings: () => void;
  onSelectPoleById?: (poleId: string) => void;
  onSelectFaultById?: (faultId: string) => void;
  poles: StreetLightPole[];
  faults: FaultReport[];
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenSettings,
  onSelectPoleById,
  onSelectFaultById,
  poles,
  faults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.trim() ? {
    poles: poles.filter(p => 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    faults: faults.filter(f => 
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  } : null;

  return (
    <header className="fixed top-0 w-full lg:pl-64 z-[60] h-16 frosted-top-header flex items-center justify-between px-4 sm:px-6">
      {/* Left: Branding for mobile & High-Contrast Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center shadow-md">
            <Droplets className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
            hiku
          </span>
        </div>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, Location or Fault (#FLT...)"
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-2xl rounded-full py-2 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-slate-300 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/80 transition-all border border-white/35 shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live Search Overlay Results */}
          {searchResults && (searchResults.poles.length > 0 || searchResults.faults.length > 0) && (
            <div className="absolute top-12 left-0 w-full bg-[#0a141c]/95 backdrop-blur-3xl rounded-2xl p-3 shadow-2xl border border-white/35 max-h-96 overflow-y-auto z-50 space-y-3">
              {searchResults.poles.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Street Light Poles ({searchResults.poles.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.poles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPoleById?.(p.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/40 text-left transition-all"
                      >
                        <div>
                          <span className="font-mono font-bold text-xs text-emerald-300 mr-2">{p.id}</span>
                          <span className="text-xs text-white">{p.location}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          p.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm' 
                            : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        }`}>
                          {p.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.faults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5 px-1">
                    Fault Issues ({searchResults.faults.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.faults.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFaultById?.(f.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 text-left transition-all"
                      >
                        <div>
                          <span className="font-mono font-bold text-xs text-rose-300 mr-2">{f.id}</span>
                          <span className="text-xs text-white">{f.title}</span>
                          <p className="text-[11px] text-slate-300">{f.location}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                          {f.severity}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-200 hover:text-white hover:bg-white/15 rounded-full transition-all relative border border-white/20 hover:border-white/50 shadow-sm"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0a141c] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0a141c]/95 backdrop-blur-3xl rounded-2xl p-4 shadow-2xl border border-white/35 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">Live Grid Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500/25 text-rose-300 border border-rose-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 divide-y divide-white/10 max-h-80 overflow-y-auto">
                {notifications.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (alert.relatedId) onSelectPoleById?.(alert.relatedId);
                      setShowNotifications(false);
                    }}
                    className={`py-2.5 px-2.5 rounded-xl cursor-pointer transition-all flex items-start gap-3 border border-transparent ${
                      !alert.read ? 'bg-white/[0.12] border-white/25 shadow-sm' : 'hover:bg-white/[0.08] hover:border-white/15'
                    }`}
                  >
                    <div className="mt-0.5">
                      {alert.type === 'critical' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                      <p className="text-[11px] text-slate-300 truncate">{alert.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-200 hover:text-white hover:bg-white/15 rounded-full transition-all border border-white/20 hover:border-white/50 shadow-sm"
          title="Grid Configuration & Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/50 hover:border-white transition-all relative ring-2 ring-transparent hover:ring-white/40 shadow-md"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrHhDhMLQoTHnuTvLQCLd4VAfzSQ0_3lMUl8gZWQxU8H-i7Db0weWSCNfkXgfuZ4nQFujQkL2onoaVbZWwbBJKgF1C0-nsBW4_aYX0C_UaVROxoPoO1B_91wMNLWSh5OeYlMYh3yBVAyowt1KY7nkWo8RN-9jFkBKu899ahQ5UEywhTvtEq6GQrwrEs6KLf9AYgMr0vVHBMPdRClyXv8x_Vq0iAFnOMaL9R2oiv3dli3BdsT9G9BGv"
              alt="User Engineer Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-[#0a141c]/95 backdrop-blur-3xl rounded-2xl p-4 shadow-2xl border border-white/35 z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-inner">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrHhDhMLQoTHnuTvLQCLd4VAfzSQ0_3lMUl8gZWQxU8H-i7Db0weWSCNfkXgfuZ4nQFujQkL2onoaVbZWwbBJKgF1C0-nsBW4_aYX0C_UaVROxoPoO1B_91wMNLWSh5OeYlMYh3yBVAyowt1KY7nkWo8RN-9jFkBKu899ahQ5UEywhTvtEq6GQrwrEs6KLf9AYgMr0vVHBMPdRClyXv8x_Vq0iAFnOMaL9R2oiv3dli3BdsT9G9BGv"
                    alt="Engineer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Eng. Ananya V.</p>
                  <p className="text-[11px] text-emerald-300 font-medium">Chief Grid Controller</p>
                </div>
              </div>
              <div className="py-2 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Sector Authorization:</span>
                  <span className="font-semibold text-white">Chennai Alpha</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Security Level:</span>
                  <span className="font-mono text-emerald-300 font-bold">LEVEL-4 ROOT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
