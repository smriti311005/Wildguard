import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Compass, 
  Camera, 
  Map as MapIcon, 
  Users, 
  HeartHandshake, 
  BarChart3, 
  ShieldCheck, 
  Home, 
  LogOut, 
  Volume2, 
  VolumeX, 
  X,
  Eye
} from 'lucide-react';
import { getAuthorizedTabs, ROLES } from '../rbac';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onLogout, 
  onGoHome, 
  isAudioAlertEnabled, 
  setIsAudioAlertEnabled, 
  onlineNodesCount = 4,
  isOpenMobile,
  onCloseMobile
}) {
  const role = user ? user.role : ROLES.GUEST;
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
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            display: 'block'
          }}
          className="mobile-sidebar-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`dashboard-sidebar ${isOpenMobile ? 'sidebar-open' : ''}`}>
        
        {/* ─── 1. TOP BRAND HEADER ─── */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              onClick={onGoHome}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              title="Return to Public Landing Page"
            >
              {/* Wildlife Insights styled eye/shield icon */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#edfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #c6f6d5',
                color: '#38a169',
                flexShrink: 0
              }}>
                <Eye size={22} color="#38a169" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: '900',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: '#1a202c'
                }}>
                  Wildlife <span style={{ color: '#48bb78' }}>Insights</span>
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#718096'
                }}>
                  COEXISTENCE PLATFORM
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="mobile-sidebar-close-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Sensor Pulse Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            background: '#edfdf5',
            border: '1px solid #c6f6d5',
            borderRadius: '999px',
            width: 'fit-content'
          }}>
            <span className="pulse-beacon"></span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#276749'
            }}>
              {onlineNodesCount} NODES ONLINE
            </span>
          </div>
        </div>

        {/* ─── 2. NAVIGATION MENU ITEMS ─── */}
        <div style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#a0aec0',
            padding: '4px 10px 8px'
          }}>
            MODULES
          </div>

          {authorizedTabs.map((item) => {
            const Icon = iconMap[item.id] || Compass;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} className="nav-item-icon" />
                  <span style={{ fontWeight: '750', fontSize: '0.88rem' }}>{item.label}</span>
                </div>
                {isActive && (
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#48bb78'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── 3. BOTTOM USER PROFILE & QUICK ACTIONS ─── */}
        <div style={{
          padding: '14px',
          borderTop: '1px solid var(--border-subtle)',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* User Info Card */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: role === 'ADMIN' ? '#f3e8ff' : (role === 'CITIZEN' ? '#ecfdf5' : '#fffbeb'),
                  border: `1px solid ${role === 'ADMIN' ? '#d8b4fe' : (role === 'CITIZEN' ? '#a7f3d0' : '#fde68a')}`,
                  color: role === 'ADMIN' ? '#7e22ce' : (role === 'CITIZEN' ? '#065f46' : '#92400e'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '900',
                  flexShrink: 0
                }}>
                  {role === 'ADMIN' ? '⚡' : (role === 'CITIZEN' ? '🌾' : '🛡️')}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontWeight: '800',
                    fontSize: '0.82rem',
                    color: '#1a202c',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#718096' }}>
                    {role.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Audio toggle button inside user card */}
              <button
                onClick={() => setIsAudioAlertEnabled(!isAudioAlertEnabled)}
                title={isAudioAlertEnabled ? "Mute alert audio" : "Enable alert audio"}
                style={{
                  background: isAudioAlertEnabled ? '#fee2e2' : '#f1f5f9',
                  border: `1px solid ${isAudioAlertEnabled ? '#fca5a5' : '#e2e8f0'}`,
                  color: isAudioAlertEnabled ? '#dc2626' : '#64748b',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {isAudioAlertEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
            </div>
          )}

          {/* Quick Footer Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              onClick={onGoHome}
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 10px', fontSize: '0.76rem' }}
              title="Return to Public Landing Page"
            >
              <Home size={13} />
              <span>Landing</span>
            </button>

            <button 
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 10px', fontSize: '0.76rem', color: '#dc2626' }}
              title="Sign out of account"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
