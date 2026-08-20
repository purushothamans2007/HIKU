export type ScreenType = 'login' | 'dashboard' | 'problems' | 'report' | 'maintenance' | 'analytics';

export type SeverityType = 'critical' | 'medium' | 'low';

export type PoleStatus = 'active' | 'dimmed' | 'warning' | 'offline' | 'fault';

export interface StreetLightPole {
  id: string; // e.g. CHN-1089
  name: string;
  location: string;
  zone: string;
  ward: string;
  lat: number;
  lng: number;
  status: PoleStatus;
  powerDraw: number; // in Watts e.g. 120
  brightness: number; // 0 to 100%
  ambientLux: number;
  temperature: number; // in °C
  lastPing: string;
  hardwareModel: string;
  firmware: string;
  solarEquipped: boolean;
  batteryLevel?: number; // %
  voltage: number; // in Volts
  currentFaultId?: string;
}

export interface FaultReport {
  id: string; // e.g. #FLT-8921
  ticketNumber: string;
  title: string;
  location: string;
  zone: string;
  ward: string;
  poleId?: string;
  severity: SeverityType;
  issueType: 'outage' | 'sensor' | 'flickering' | 'damage' | 'dim' | 'surge';
  description: string;
  reportedTime: string;
  status: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved';
  assignedTech?: string;
  eta?: string;
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'Available' | 'On Duty' | 'En Route' | 'Offline';
  assignedZone: string;
  currentTask?: string;
  avatarUrl: string;
  completedTasksToday: number;
}

export interface AlertNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  relatedId?: string;
}

export interface GridTelemetryStats {
  activePoles: number;
  activePolesDelta: number;
  openFaults: number;
  techniciansOnline: number;
  totalEnergyKwh: number;
  energySavedPercent: number;
  solarStoredKwh: number;
  avgBrightness: number;
  gridStatus: 'Nominal' | 'Degraded' | 'Critical Alert';
}
