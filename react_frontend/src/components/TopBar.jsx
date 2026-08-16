import React from 'react';
import { 
  Menu, 
  Radio, 
  ShieldAlert, 
  Bell, 
  Volume2, 
  VolumeX, 
  Home, 
  Compass, 
  Camera, 
  Map as MapIcon, 
  Users, 
  HeartHandshake, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';

export default function TopBar({ 
  currentTab, 
  user, 
  onToggleMobileSidebar, 
  onGoHome, 
  alerts = [],
  isAudioAlertEnabled, 
  setIsAudioAlertEnabled 
}) {
  const tabTitles = {
    command: { title: 'Tactical Command Centre', subtitle: 'Real-time telemetry, 6-factor risk assessment, and live alerts', icon: Compass },
    detection: { title: 'Edge AI Detection Console', subtitle: 'On-device YOLOv8 neural inference, presets & manual uploads', icon: Camera },
    map: { title: 'GIS Movement & Corridor Map', subtitle: 'Interactive migration paths, safe zones, and 15-min trajectory vectors', icon: MapIcon },
    community: { title: 'Community Sighting Reports', subtitle: 'Crowdsourced citizen reports & Range Officer verification queue', icon: Users },
    citizen: { title: 'Citizen Safety & Advisory Portal', subtitle: 'Mobile-first village threat status, 1-tap reports, and emergency helplines', icon: HeartHandshake },
    analytics: { title: 'Analytics & Incident Telemetry Logs', subtitle: 'Species frequency charts, 24-hr activity histogram, and CSV export', icon: BarChart3 },
    admin: { title: 'System Administration & Fleet Health', subtitle: 'User role approvals, sensor diagnostics, and audit logs', icon: ShieldCheck }
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.command;
  const TabIcon = currentMeta.icon;

  const activeAlertCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '24px',
      gap: '16px'
    }}>
      {/* Left: Mobile Toggle & Breadcrumb Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onToggleMobileSidebar}
          className="mobile-sidebar-toggle-btn"
          style={{
            display: 'none',
            background: '#edfdf5',
            border: '1px solid #c6f6d5',
            color: '#38a169',
            borderRadius: '6px',
            padding: '8px',
            cursor: 'pointer'
          }}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#edfdf5',
          border: '1px solid #c6f6d5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38a169',
          flexShrink: 0
        }}>
          <TabIcon size={18} />
        </div>

        <div>
          <div className="category-tag" style={{ marginBottom: '2px', fontSize: '0.68rem' }}>
            MODULE // {currentTab.toUpperCase()}
          </div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '900',
            color: '#1a202c',
            lineHeight: 1.15
          }}>
            {currentMeta.title}
          </h2>
        </div>
      </div>

      {/* Right: Active Alert Ticker & Landing Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {activeAlertCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '999px',
            color: '#c53030',
            fontSize: '0.75rem',
            fontWeight: '800'
          }}>
            <Bell size={13} className="animate-pulse" />
            <span>{activeAlertCount} ACTIVE INCIDENT{activeAlertCount > 1 ? 'S' : ''}</span>
          </div>
        )}

        <button 
          onClick={onGoHome}
          className="btn btn-secondary btn-sm"
          style={{ padding: '7px 14px', fontSize: '0.78rem' }}
        >
          <Home size={14} />
          <span>Public Landing</span>
        </button>
      </div>
    </div>
  );
}
