import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CommandCentre from './components/CommandCentre';
import WildlifeMap from './components/WildlifeMap';
import DetectionConsole from './components/DetectionConsole';
import CommunityReports from './components/CommunityReports';
import CitizenPortal from './components/CitizenPortal';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';

import { 
  getAlerts, 
  getStatsOverview, 
  getCorridors, 
  updateAlertStatus, 
  getSavedUser, 
  logoutUser 
} from './api';
import { 
  PERMISSIONS, 
  hasPermission, 
  getDefaultTabForRole 
} from './rbac';

export default function App() {
  // Primary Navigation View: 'landing' | 'auth' | 'dashboard'
  const [viewMode, setViewMode] = useState('landing');
  const [authInitialTab, setAuthInitialTab] = useState('signin');
  
  // Dashboard Sub-Tab (controlled by Sidebar)
  const [currentTab, setCurrentTab] = useState('command');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Session State
  const [user, setUser] = useState(getSavedUser());
  const [isAudioAlertEnabled, setIsAudioAlertEnabled] = useState(false);

  // Operational Telemetry Data
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [corridorsData, setCorridorsData] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Audio Siren Synthesis (Web Audio API)
  const playSiren = useCallback(() => {
    if (!isAudioAlertEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // restricted before user interaction
    }
  }, [isAudioAlertEnabled]);

  // Load telemetry & alert data from FastAPI backend
  const fetchData = useCallback(async () => {
    try {
      const [alertsRes, statsRes, corridorsRes] = await Promise.all([
        getAlerts(50),
        getStatsOverview(),
        getCorridors()
      ]);
      setAlerts(alertsRes || []);
      setStats(statsRes);
      setCorridorsData(corridorsRes);
      setBackendStatus('online');
    } catch (err) {
      console.error('Fetch error:', err);
      setBackendStatus('offline');
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Play audio chime if active threat alert occurs
  useEffect(() => {
    if (alerts.length > 0 && alerts[0].status === 'ACTIVE' && isAudioAlertEnabled) {
      playSiren();
    }
  }, [alerts, isAudioAlertEnabled, playSiren]);

  // ─── AUTHENTICATION & ROUTING FLOW ───

  const handleOpenAuth = (initialMode = 'signin') => {
    setAuthInitialTab(initialMode);
    setViewMode('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    const defaultTab = getDefaultTabForRole(authenticatedUser?.role);
    setCurrentTab(defaultTab);
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDashboard = (targetTab) => {
    if (!user) {
      handleOpenAuth('signin');
      return;
    }
    const tabToOpen = targetTab || getDefaultTabForRole(user.role);
    setCurrentTab(tabToOpen);
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setViewMode('landing');
    setCurrentTab('command');
  };

  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      await updateAlertStatus(alertId, newStatus);
      fetchData();
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  // ─── VIEW 1: LANDING PAGE ───
  if (viewMode === 'landing') {
    return (
      <LandingPage 
        stats={stats}
        alerts={alerts}
        corridorsData={corridorsData}
        user={user}
        onOpenAuth={handleOpenAuth}
        onEnterDashboard={handleEnterDashboard}
      />
    );
  }

  // ─── VIEW 2: AUTHENTICATION (SIGN IN / SIGN UP) ───
  if (viewMode === 'auth') {
    return (
      <AuthPage 
        initialTab={authInitialTab}
        onAuthSuccess={handleAuthSuccess}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // ─── VIEW 3: AUTHENTICATED DASHBOARD WITH SIDEBAR NAVIGATION ───
  return (
    <div className="dashboard-layout">
      {/* ─── LEFT SIDEBAR NAVIGATION ─── */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        onGoHome={() => setViewMode('landing')}
        isAudioAlertEnabled={isAudioAlertEnabled}
        setIsAudioAlertEnabled={setIsAudioAlertEnabled}
        onlineNodesCount={stats?.sensor_network?.online_nodes || 4}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="dashboard-main-content">
        
        {/* Top Header Bar */}
        <TopBar 
          currentTab={currentTab}
          user={user}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onGoHome={() => setViewMode('landing')}
          alerts={alerts}
          isAudioAlertEnabled={isAudioAlertEnabled}
          setIsAudioAlertEnabled={setIsAudioAlertEnabled}
        />

        {/* Backend Offline Warning (if any) */}
        {backendStatus === 'offline' && (
          <div style={{
            padding: '14px 20px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              ⚠️ <b>FastAPI Backend Offline:</b> Server connection interrupted on <code>http://localhost:8000</code>.
            </div>
            <button onClick={fetchData} className="btn btn-secondary btn-sm">
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Section Rendering with RBAC Guards */}
        <main>
          {currentTab === 'command' && (
            hasPermission(user, PERMISSIONS.VIEW_COMMAND_CENTRE) ? (
              <CommandCentre 
                stats={stats}
                alerts={alerts}
                onUpdateAlertStatus={handleUpdateAlertStatus}
                onNavigateTab={setCurrentTab}
              />
            ) : (
              <CitizenPortal user={user} alerts={alerts} onNavigateTab={setCurrentTab} />
            )
          )}

          {currentTab === 'detection' && (
            hasPermission(user, PERMISSIONS.RUN_EDGE_AI_DETECTION) ? (
              <DetectionConsole 
                onAlertCreated={fetchData}
                onNavigateTab={setCurrentTab}
              />
            ) : (
              <CitizenPortal user={user} alerts={alerts} onNavigateTab={setCurrentTab} />
            )
          )}

          {currentTab === 'map' && (
            <WildlifeMap 
              alerts={alerts}
              corridorsData={corridorsData}
              onUpdateAlertStatus={handleUpdateAlertStatus}
            />
          )}

          {currentTab === 'community' && (
            <CommunityReports 
              user={user}
              onReportVerified={fetchData}
            />
          )}

          {currentTab === 'citizen' && (
            <CitizenPortal 
              user={user}
              alerts={alerts}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && (
            hasPermission(user, PERMISSIONS.VIEW_ANALYTICS_LOGS) ? (
              <Analytics 
                stats={stats}
                alerts={alerts}
                corridorsData={corridorsData}
              />
            ) : (
              <CitizenPortal user={user} alerts={alerts} onNavigateTab={setCurrentTab} />
            )
          )}

          {currentTab === 'admin' && (
            hasPermission(user, PERMISSIONS.SYSTEM_ADMIN_PANEL) ? (
              <AdminPanel 
                user={user}
                stats={stats}
                corridorsData={corridorsData}
              />
            ) : (
              <CitizenPortal user={user} alerts={alerts} onNavigateTab={setCurrentTab} />
            )
          )}
        </main>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#718096',
          fontSize: '0.78rem',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌿 <b>WildGuard Operations Console</b></span>
            <span>•</span>
            <span>Active Role: <b style={{ color: '#276749' }}>{user?.role || 'GUEST'}</b></span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setViewMode('landing')} 
              style={{ background: 'transparent', border: 'none', color: '#38a169', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}
            >
              Public Landing Page
            </button>
            <span>•</span>
            <span>FastAPI Swagger: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ color: '#38a169' }}>/docs</a></span>
          </div>
        </footer>

      </div>
    </div>
  );
}
