import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { MyFarmsPage } from './pages/MyFarmsPage';
import { AddFarmPage } from './pages/AddFarmPage';
import { GisMapPage } from './pages/GisMapPage';
import { SatellitePage } from './pages/SatellitePage';
import { SensorsPage } from './pages/SensorsPage';
import { WeatherPage } from './pages/WeatherPage';
import { AiAnalysisPage } from './pages/AiAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AiLeafDoctorModal } from './components/AiLeafDoctorModal';
import { ReportModal } from './components/ReportModal';
import {
  sensorsApi,
  weatherApi,
  satelliteApi,
  zonesApi,
  alertsApi,
  reportsApi
} from './services/api';
import {
  SensorReading,
  SensorHistoryPoint,
  WeatherData,
  SatelliteObservation,
  ManagementZone,
  Alert,
  FarmReport
} from './types';

function MainAppContent() {
  const { isAuthenticated, isLoading, selectedFarm, selectedFarmId, setSelectedFarmId, demoLogin, refreshFarms } = useAuth();

  // Auth screen state (if not authenticated)
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');

  // App navigation state (if authenticated)
  const [currentTab, setCurrentTab] = useState<NavTab | 'add-farm'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isLeafDoctorOpen, setIsLeafDoctorOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Farm Data States
  const [sensor, setSensor] = useState<SensorReading | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorHistoryPoint[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [satelliteObs, setSatelliteObs] = useState<SatelliteObservation[]>([]);
  const [zones, setZones] = useState<ManagementZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [report, setReport] = useState<FarmReport | null>(null);

  // Load all telemetry when selected farm changes
  const loadFarmData = async () => {
    if (!selectedFarmId) return;

    try {
      const [sensorData, historyData, weatherData, satData, zonesData, alertsData, reportData] =
        await Promise.allSettled([
          sensorsApi.getByFarm(selectedFarmId),
          sensorsApi.getHistory(selectedFarmId),
          weatherApi.getByFarm(selectedFarmId),
          satelliteApi.getByFarm(selectedFarmId),
          zonesApi.getByFarm(selectedFarmId),
          alertsApi.getAll({ farmId: selectedFarmId }),
          reportsApi.getByFarm(selectedFarmId)
        ]);

      if (sensorData.status === 'fulfilled') setSensor(sensorData.value);
      if (historyData.status === 'fulfilled') setSensorHistory(historyData.value);
      if (weatherData.status === 'fulfilled') setWeather(weatherData.value);
      if (satData.status === 'fulfilled') setSatelliteObs(satData.value);
      if (zonesData.status === 'fulfilled') setZones(zonesData.value);
      if (alertsData.status === 'fulfilled') setAlerts(alertsData.value.alerts);
      if (reportData.status === 'fulfilled') setReport(reportData.value);
    } catch (err) {
      console.error('Error fetching farm telemetry', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && selectedFarmId) {
      loadFarmData();
    }
  }, [isAuthenticated, selectedFarmId]);

  // Real-time sensor polling every 8 seconds
  useEffect(() => {
    if (!isAuthenticated || !selectedFarmId) return;

    const interval = setInterval(async () => {
      try {
        const latestSensor = await sensorsApi.getByFarm(selectedFarmId);
        setSensor(latestSensor);
        const latestHistory = await sensorsApi.getHistory(selectedFarmId);
        setSensorHistory(latestHistory);
      } catch (e) {
        // quiet catch on poll
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isAuthenticated, selectedFarmId]);

  // Loading indicator for token validation
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Connecting to AgriVision AI Satellite Feeds...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Landing, Login, or Register
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onGoToRegister={() => setAuthView('register')}
          onGoToLanding={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'register') {
      return (
        <RegisterPage
          onGoToLogin={() => setAuthView('login')}
          onGoToLanding={() => setAuthView('landing')}
        />
      );
    }

    return (
      <LandingPage
        onGoToLogin={() => setAuthView('login')}
        onGoToRegister={() => setAuthView('register')}
        onInstantDemo={async () => {
          await demoLogin();
        }}
      />
    );
  }

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="flex min-h-screen bg-[#f9fafb] font-sans text-gray-900 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab as NavTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f9fafb]">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenLeafDoctor={() => setIsLeafDoctorOpen(true)}
          onNavigateToAlerts={() => setCurrentTab('alerts')}
          unreadAlertsCount={unreadAlertsCount}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'dashboard' && (
              <DashboardOverview
                farm={selectedFarm}
                sensor={sensor}
                sensorHistory={sensorHistory}
                weather={weather}
                zones={zones}
                alerts={alerts}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onRunAiAnalysis={() => setCurrentTab('crop-health')}
                onOpenLeafDoctor={() => setIsLeafDoctorOpen(true)}
                onOpenReport={() => setIsReportModalOpen(true)}
              />
            )}

            {currentTab === 'farms' && (
              <MyFarmsPage
                onSelectFarmAndGoToDashboard={(id) => {
                  setSelectedFarmId(id);
                  setCurrentTab('dashboard');
                }}
                onSelectFarmAndGoToGis={(id) => {
                  setSelectedFarmId(id);
                  setCurrentTab('gis');
                }}
                onOpenAddFarm={() => setCurrentTab('add-farm')}
              />
            )}

            {currentTab === 'add-farm' && (
              <AddFarmPage
                onFarmCreated={(newFarm) => {
                  setSelectedFarmId(newFarm.id);
                  setCurrentTab('gis');
                }}
                onCancel={() => setCurrentTab('farms')}
              />
            )}

            {currentTab === 'gis' && (
              <GisMapPage
                farm={selectedFarm}
                zones={zones}
                onRefreshZones={loadFarmData}
              />
            )}

            {currentTab === 'satellite' && (
              <SatellitePage
                farm={selectedFarm}
                observations={satelliteObs}
              />
            )}

            {(currentTab === 'crop-health' || currentTab === 'recommendations') && (
              <AiAnalysisPage
                farm={selectedFarm}
                onAnalysisFinished={loadFarmData}
              />
            )}

            {currentTab === 'sensors' && (
              <SensorsPage
                farm={selectedFarm}
                sensor={sensor}
                history={sensorHistory}
                onRefreshSensor={async () => {
                  if (selectedFarmId) {
                    const s = await sensorsApi.getByFarm(selectedFarmId);
                    setSensor(s);
                  }
                }}
              />
            )}

            {currentTab === 'weather' && (
              <WeatherPage
                farm={selectedFarm}
                weather={weather}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onRefreshAlerts={loadFarmData}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsPage
                farm={selectedFarm}
              />
            )}

            {currentTab === 'profile' && (
              <ProfilePage />
            )}
          </div>
        </main>
      </div>

      {/* Global AI Modals */}
      <AiLeafDoctorModal
        isOpen={isLeafDoctorOpen}
        onClose={() => setIsLeafDoctorOpen(false)}
        cropType={selectedFarm?.cropType}
      />

      <ReportModal
        report={report}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
