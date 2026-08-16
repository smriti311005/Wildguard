import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Compass, 
  Camera, 
  Bell, 
  Map as MapIcon, 
  Users, 
  HeartHandshake, 
  BarChart3,
  Home,
  ShieldCheck
} from 'lucide-react';
import { getAuthorizedTabs, ROLES } from '../rbac';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onOpenAuth, 
  onLogout, 
  onGoHome,
  isAudioAlertEnabled, 
  setIsAudioAlertEnabled,
  onlineNodesCount = 4
}) {
  const role = user ? user.role : ROLES.GUEST;

  const roleColor = {
    ADMIN: 'text-purple-400 bg-purple-950/60 border-purple-500/50',
    FOREST_OFFICER: 'text-amber-400 bg-amber-950/60 border-amber-500/50',
    CITIZEN: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50',
    GUEST: 'text-slate-400 bg-slate-900/60 border-slate-700/50'
  }[role] || 'text-slate-400';

  // Get only the tabs this user is authorized to see
  const authorizedTabs = getAuthorizedTabs(user);

  const iconMap = {
    command: Compass,
    detection: Camera,
    map: MapIcon,
    community: Users,
    citizen: HeartHandshake,
    analytics: BarChart3,
    admin: ShieldCheck
  };

  return (
    <header className="header-wrapper">
      {/* Top Utility Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(6, 20, 12, 0.9)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(16px)',
        marginBottom: '16px',
        gap: '12px'
      }}>
        {/* Brand Logo & Home Link */}
        <div 
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          title="Return to Public Landing Page"
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #065f46, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
            border: '1px solid rgba(74, 222, 128, 0.4)'
          }}>
            <ShieldAlert size={22} color="#4ade80" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#ffffff'
            }}>
              Wild<span style={{ color: '#4ade80' }}>Care</span>
            </div>
            <div style={{
              fontSize: '0.6rem',
              fontWeight: '800',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#a7f3d0'
            }}>
              TACTICAL OPERATIONS CONSOLE
            </div>
          </div>
        </div>

        {/* Center: Live Sensor Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px',
          background: 'rgba(4, 16, 9, 0.8)',
          border: '1px solid rgba(74, 222, 128, 0.25)',
          borderRadius: '999px'
        }}>
          <span className="pulse-beacon"></span>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: '800',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: '#bbf7d0'
          }}>
            {onlineNodesCount} SENSORS ONLINE
          </span>
        </div>

        {/* Right Actions: Home, Audio Toggle, User Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={onGoHome}
            className="btn btn-secondary btn-sm"
            title="Go to Public Landing Page"
          >
            <Home size={15} />
            <span>Landing</span>
          </button>

          <button 
            onClick={() => setIsAudioAlertEnabled(!isAudioAlertEnabled)}
            title={isAudioAlertEnabled ? "Mute alert audio" : "Enable alert audio"}
            style={{
              background: isAudioAlertEnabled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isAudioAlertEnabled ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
              color: isAudioAlertEnabled ? '#f87171' : '#94a3b8',
              borderRadius: '8px',
              padding: '7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {isAudioAlertEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(10, 32, 20, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span className={`badge ${role === 'CITIZEN' ? 'badge-verified' : (role === 'ADMIN' ? 'badge-active' : 'badge-acknowledged')}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {role.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>
                  {user.name}
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Sign out of account"
              >
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Authorized Navigation Tabs */}
      <nav className="nav-pills" style={{ margin: '0 0 24px 0' }}>
        {authorizedTabs.map((item) => {
          const Icon = iconMap[item.id] || Compass;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`nav-pill-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
