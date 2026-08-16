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
  Shield
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
          padding: '22px 20px 18px',
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
              title="Return to WildGuard Home"
            >
              {/* WildGuard Shield Icon */}
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
                <Shield size={22} color="#38a169" />
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
                  Wild<span style={{ color: '#38a169' }}>Guard</span>
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  letterSpacing: '0.8px',
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
            <span className="live-dot"></span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#276749'
            }}>
              {onlineNodesCount} SENSORS ONLINE
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
            MAIN MENU
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
                    background: '#38a169'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── 3. USER PROFILE & FOOTER CONTROL ─── */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#ffffff'
        }}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '800', fontSize: '0.84rem', color: '#1a202c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: user.role === 'ADMIN' ? '#7e22ce' : (user.role === 'FOREST_OFFICER' ? '#38a169' : '#3182ce')
                  }}></span>
                  <span>{user.role.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Siren Audio Alarm Toggle */}
              <button
                onClick={() => setIsAudioAlertEnabled(!isAudioAlertEnabled)}
                title={isAudioAlertEnabled ? "Audio Sirens Enabled" : "Audio Sirens Muted"}
                style={{
                  background: isAudioAlertEnabled ? '#edfdf5' : '#f1f5f9',
                  border: `1px solid ${isAudioAlertEnabled ? '#9ae6b4' : '#cbd5e1'}`,
                  color: isAudioAlertEnabled ? '#276749' : '#718096',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isAudioAlertEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          )}

          {/* Landing Page Button */}
          <button
            onClick={onGoHome}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
          >
            <Home size={15} />
            <span>Public Landing Page</span>
          </button>

          {/* Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', color: '#e53e3e', borderColor: '#feb2b2', padding: '8px 12px' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}
        </div>

      </aside>
    </>
  );
}
