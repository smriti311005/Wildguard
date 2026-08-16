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
    command: { title: 'Real-Time Operations', subtitle: 'Live telemetry, movement risks, and immediate field alerts', icon: Compass },
    detection: { title: 'Camera Trap Identification', subtitle: 'AI species classification, demo presets, and image uploads', icon: Camera },
    map: { title: 'Wildlife Movement Map', subtitle: 'Interactive migration paths, active corridors, and 15-min trajectory vectors', icon: MapIcon },
    community: { title: 'Community Wildlife Sightings', subtitle: 'Crowdsourced citizen reports and Range Officer verification queue', icon: Users },
    citizen: { title: 'Citizen Safety Portal', subtitle: 'Local village threat status, instant reports, and emergency helplines', icon: HeartHandshake },
    analytics: { title: 'Analytics & Incident Logs', subtitle: 'Species detection trends, 24-hr activity histogram, and CSV export', icon: BarChart3 },
    admin: { title: 'System & Sensor Fleet Settings', subtitle: 'User role approvals, edge node diagnostics, and system settings', icon: ShieldCheck }
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.command;
  const TabIcon = currentMeta.icon;

  const activeAlertCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '20px',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Left: Mobile Toggle & Breadcrumb Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
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

        <div style={{ minWidth: 0 }}>
          <div className="category-tag" style={{ marginBottom: '2px', fontSize: '0.65rem' }}>
            WILDGUARD // {currentTab.toUpperCase()}
          </div>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: '900',
            color: '#1a202c',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentMeta.title}
          </h2>
        </div>
      </div>

      {/* Right Actions: Active Alerts Counter & Home Shortcut */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Active Threat Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: activeAlertCount > 0 ? '#fff5f5' : '#edfdf5',
          border: `1px solid ${activeAlertCount > 0 ? '#feb2b2' : '#c6f6d5'}`,
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: '800',
          color: activeAlertCount > 0 ? '#c53030' : '#276749'
        }}>
          <ShieldAlert size={14} color={activeAlertCount > 0 ? "#e53e3e" : "#38a169"} />
          <span>{activeAlertCount} ACTIVE INCIDENTS</span>
        </div>

        {/* Return to Home Button */}
        <button
          onClick={onGoHome}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 12px' }}
        >
          <Home size={14} />
          <span style={{ display: 'inline' }}>Public Page</span>
        </button>
      </div>
    </div>
  );
}
