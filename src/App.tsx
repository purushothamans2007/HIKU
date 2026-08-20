/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, StreetLightPole, FaultReport, Technician, AlertNotification, GridTelemetryStats } from './types';
import { 
  INITIAL_POLES, 
  INITIAL_FAULTS, 
  INITIAL_TECHNICIANS, 
  INITIAL_ALERTS, 
  INITIAL_STATS 
} from './data/mockData';
import { LiquidShaderBackground } from './components/LiquidShaderBackground';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNavBar } from './components/MobileNavBar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProblemsScreen } from './components/ProblemsScreen';
import { ReportFaultScreen } from './components/ReportFaultScreen';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { FaultDetailsModal } from './components/FaultDetailsModal';
import { PoleDetailsModal } from './components/PoleDetailsModal';
import { SettingsModal } from './components/SettingsModal';
import { SupportModal } from './components/SupportModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  const [poles, setPoles] = useState<StreetLightPole[]>(INITIAL_POLES);
  const [faults, setFaults] = useState<FaultReport[]>(INITIAL_FAULTS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [stats, setStats] = useState<GridTelemetryStats>(INITIAL_STATS);

  const [selectedPole, setSelectedPole] = useState<StreetLightPole>(INITIAL_POLES[0]);
  const [selectedFaultModal, setSelectedFaultModal] = useState<FaultReport | null>(null);
  const [selectedPoleModal, setSelectedPoleModal] = useState<StreetLightPole | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Toggle Pole Standby / Power
  const handleTogglePolePower = (poleId: string) => {
    setPoles((prev) =>
      prev.map((p) => {
        if (p.id === poleId) {
          const newBrightness = p.brightness > 0 ? 0 : 85;
          const newStatus = newBrightness > 0 ? 'active' : 'dimmed';
          const updated = {
            ...p,
            brightness: newBrightness,
            powerDraw: newBrightness > 0 ? 120 : 0,
            status: newStatus as StreetLightPole['status']
          };
          if (selectedPole.id === poleId) setSelectedPole(updated);
          return updated;
        }
        return p;
      })
    );
  };

  // Update Pole Brightness Dimmer
  const handleUpdatePoleBrightness = (poleId: string, brightness: number) => {
    setPoles((prev) =>
      prev.map((p) => {
        if (p.id === poleId) {
          const newPower = Math.round((brightness / 100) * 140);
          const newStatus = brightness > 0 ? (brightness < 40 ? 'dimmed' : 'active') : 'offline';
          const updated = {
            ...p,
            brightness,
            powerDraw: newPower,
            status: newStatus as StreetLightPole['status']
          };
          if (selectedPole.id === poleId) setSelectedPole(updated);
          return updated;
        }
        return p;
      })
    );
  };

  // Submit New Fault Report
  const handleCreateFault = (newFaultData: Omit<FaultReport, 'id' | 'ticketNumber' | 'reportedTime' | 'status'>) => {
    const newId = `#FLT-${Math.floor(8922 + Math.random() * 50)}`;
    const newTicket = `HK-${Math.floor(8500 + Math.random() * 500)}`;
    const newFault: FaultReport = {
      ...newFaultData,
      id: newId,
      ticketNumber: newTicket,
      reportedTime: 'Just now',
      status: 'Open'
    };

    setFaults((prev) => [newFault, ...prev]);
    setStats((prev) => ({
      ...prev,
      openFaults: prev.openFaults + 1
    }));

    // Add alert notification
    const newAlert: AlertNotification = {
      id: `ALT-${Date.now()}`,
      title: `${newFault.title} Logged`,
      subtitle: `Just now • ${newFault.location}`,
      time: 'Just now',
      type: newFault.severity === 'critical' ? 'critical' : 'warning',
      read: false,
      relatedId: newFault.id
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Update Fault Status & Assigned Technician
  const handleUpdateFaultStatus = (faultId: string, status: FaultReport['status'], assignedTech?: string) => {
    setFaults((prev) =>
      prev.map((f) => {
        if (f.id === faultId) {
          return {
            ...f,
            status,
            assignedTech: assignedTech || f.assignedTech,
            eta: assignedTech ? '25 mins' : f.eta
          };
        }
        return f;
      })
    );

    if (status === 'Resolved') {
      setStats((prev) => ({
        ...prev,
        openFaults: Math.max(0, prev.openFaults - 1)
      }));
    }
  };

  // Quick selection from live search or alert click
  const handleSelectPoleById = (poleId: string) => {
    const found = poles.find((p) => p.id === poleId);
    if (found) {
      setSelectedPole(found);
      setCurrentScreen('dashboard');
    }
  };

  const handleSelectFaultById = (faultId: string) => {
    const found = faults.find((f) => f.id === faultId);
    if (found) {
      setSelectedFaultModal(found);
      setCurrentScreen('problems');
    }
  };

  // Render Login screen if not authenticated
  if (!isAuthenticated || currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  const openFaultCount = faults.filter((f) => f.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#0b0d13] text-[#e3e2e7] flex flex-col font-sans selection:bg-[#4b8eff] selection:text-[#00285c] relative overflow-hidden">
      {/* Background Liquid GL Shader for Frosted Refraction */}
      <LiquidShaderBackground opacity={0.75} />

      {/* Ambient Floating Glow Orbs */}
      <div className="ambient-glow-orb-blue w-[600px] h-[600px] -top-32 -left-32" />
      <div className="ambient-glow-orb-cyan w-[500px] h-[500px] top-1/3 -right-24" />
      <div className="ambient-glow-orb-violet w-[550px] h-[550px] -bottom-32 left-1/4" />

      {/* Top Header */}
      <Header
        notifications={alerts}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectPoleById={handleSelectPoleById}
        onSelectFaultById={handleSelectFaultById}
        poles={poles}
        faults={faults}
      />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          openFaultCount={openFaultCount}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentScreen('login');
          }}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        {/* Content View Area */}
        <main className="flex-1 lg:pl-64 pb-20 lg:pb-0 overflow-y-auto">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              poles={poles}
              faults={faults}
              stats={stats}
              alerts={alerts}
              selectedPole={selectedPole}
              onSelectPole={(p) => setSelectedPole(p)}
              onOpenPoleDetails={(p) => setSelectedPoleModal(p)}
              onTogglePolePower={handleTogglePolePower}
              onUpdatePoleBrightness={handleUpdatePoleBrightness}
              onNavigateToProblems={() => setCurrentScreen('problems')}
              onNavigateToReport={() => setCurrentScreen('report')}
            />
          )}

          {currentScreen === 'problems' && (
            <ProblemsScreen
              faults={faults}
              onOpenFaultDetails={(f) => setSelectedFaultModal(f)}
              onNavigateToReport={() => setCurrentScreen('report')}
            />
          )}

          {currentScreen === 'report' && (
            <ReportFaultScreen
              onBack={() => setCurrentScreen('problems')}
              onSubmitFault={handleCreateFault}
              onNavigateToProblems={() => setCurrentScreen('problems')}
            />
          )}

          {currentScreen === 'maintenance' && (
            <MaintenanceScreen
              technicians={technicians}
              faults={faults}
              onOpenFaultDetails={(f) => setSelectedFaultModal(f)}
            />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsScreen stats={stats} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavBar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        openFaultCount={openFaultCount}
      />

      {/* Modal Dialogs */}
      <FaultDetailsModal
        fault={selectedFaultModal}
        technicians={technicians}
        onClose={() => setSelectedFaultModal(null)}
        onUpdateStatus={handleUpdateFaultStatus}
        onNavigateToPole={(poleId) => {
          handleSelectPoleById(poleId);
          setSelectedFaultModal(null);
        }}
      />

      <PoleDetailsModal
        pole={selectedPoleModal}
        onClose={() => setSelectedPoleModal(null)}
        onUpdateBrightness={handleUpdatePoleBrightness}
        onTogglePower={handleTogglePolePower}
        onReportIssue={() => {
          setSelectedPoleModal(null);
          setCurrentScreen('report');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
