import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Radio, 
  Camera, 
  MapPin, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Users, 
  ExternalLink,
  Upload,
  Cpu,
  Layers,
  ChevronRight,
  Database,
  Bell,
  HeartHandshake
} from 'lucide-react';

export default function LandingPage({ 
  stats, 
  alerts = [], 
  corridorsData, 
  onOpenAuth, 
  onEnterDashboard, 
  user 
}) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('command');

  const latestAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  return (
    <div style={{ color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      
      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#edfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #c6f6d5',
              color: '#38a169'
            }}>
              <Shield size={22} color="#38a169" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#1a202c'
              }}>
                Wild<span style={{ color: '#38a169' }}>Guard</span>
              </div>
            </div>
          </div>

          {/* Center Nav Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '32px', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }} className="desktop-nav-links">
            <a href="#overview" style={{ color: '#4a5568', textDecoration: 'none' }}>Overview</a>
            <a href="#features" style={{ color: '#4a5568', textDecoration: 'none' }}>Features</a>
            <a href="#tech" style={{ color: '#4a5568', textDecoration: 'none' }}>Technology</a>
            <a href="#community" style={{ color: '#4a5568', textDecoration: 'none' }}>Community</a>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <button 
                onClick={() => onEnterDashboard()}
                className="btn btn-primary btn-sm"
              >
                <span>Dashboard ({user.role.replace('_', ' ')})</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onOpenAuth('signin')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid #38a169', color: '#276749', background: '#ffffff' }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="btn btn-primary btn-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section id="overview" style={{
        padding: '56px 24px 48px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Text Column */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#edfdf5',
              border: '1px solid #c6f6d5',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '800',
              color: '#276749',
              marginBottom: '20px'
            }}>
              <span className="live-dot"></span>
              <span>HUMAN-WILDLIFE COEXISTENCE PLATFORM</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: '900',
              lineHeight: 1.1,
              color: '#1a202c',
              marginBottom: '20px'
            }}>
              Protecting Communities. <br />
              <span style={{ color: '#38a169' }}>Preserving Wildlife.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: '#4a5568',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '560px'
            }}>
              WildGuard combines camera trap AI identification, satellite habitat mapping, and early-warning notifications to prevent human-wildlife conflicts in real time.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              <button 
                onClick={() => user ? onEnterDashboard() : onOpenAuth('signup')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <span>Launch Operations Console</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => user ? onEnterDashboard('detection') : onOpenAuth('signin')}
                className="btn btn-secondary"
                style={{ padding: '14px 24px', fontSize: '0.95rem' }}
              >
                <Camera size={18} color="#38a169" />
                <span>Test Camera Classifier</span>
              </button>
            </div>

            {/* Quick Proof Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.82rem', color: '#718096' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#38a169" />
                <span>Camera AI Detection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#38a169" />
                <span>Satellite GIS Telemetry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#38a169" />
                <span>Instant SMS & App Alerts</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e53e3e' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1a202c' }}>LIVE INCIDENT FEED</span>
              </div>
              <span className="badge badge-active">ACTIVE ALERT</span>
            </div>

            {/* Sample Alert Display */}
            <div style={{
              background: '#fff5f5',
              border: '1px solid #feb2b2',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1a202c' }}>
                  {latestAlert ? latestAlert.species : 'Elephant Herd'}
                </span>
                <span style={{ fontWeight: '800', color: '#c53030' }}>
                  {latestAlert ? `${(latestAlert.confidence * 100).toFixed(0)}% Conf` : '96% Conf'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '8px' }}>
                Location: <b>Belur Village Perimeter Node</b> (19.231°N, 72.825°E)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                Distance to Nearest Farmland: <b>420 meters</b> • Movement Intent: <b>Water Hole Trajectory</b>
              </div>
            </div>

            {/* Metric Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1a202c' }}>4</div>
                <div style={{ fontSize: '0.68rem', color: '#718096', fontWeight: '700' }}>Active Nodes</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#38a169' }}>98.2%</div>
                <div style={{ fontSize: '0.68rem', color: '#718096', fontWeight: '700' }}>Accuracy</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#3182ce' }}>&lt;15s</div>
                <div style={{ fontSize: '0.68rem', color: '#718096', fontWeight: '700' }}>Alert Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section id="features" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="category-tag" style={{ marginBottom: '6px' }}>SYSTEM CAPABILITIES</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a202c' }}>
            Built for Forest Officers & Local Communities
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#718096', maxWidth: '600px', margin: '8px auto 0' }}>
            An integrated toolkit providing early warnings, camera trap intelligence, and community incident reports.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#edfdf5', border: '1px solid #c6f6d5', color: '#38a169', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Camera size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1a202c' }}>Camera Trap Classifier</h3>
            <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>
              Automatic species identification from camera trap snapshot feeds. Detects elephants, leopards, tigers, and wild boars instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ebf8ff', border: '1px solid #bee3f8', color: '#3182ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1a202c' }}>GIS Movement Vectors</h3>
            <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>
              Correlates vegetation density, slope, and water sources to project 15-minute wildlife movement trajectories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffaf0', border: '1px solid #fbd38d', color: '#dd6b20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#1a202c' }}>Community Sightings</h3>
            <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>
              Allows villagers to report sightings with 1 tap. Range Forest Officers review and verify reports before broadcasting map warnings.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: '#f8fafc',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 24px 24px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={20} color="#38a169" />
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1a202c' }}>WildGuard</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#718096', lineHeight: 1.6 }}>
              Human–Wildlife Coexistence Platform for Forest Departments & Rural Communities.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#1a202c', marginBottom: '12px' }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#overview" style={{ color: '#718096', textDecoration: 'none' }}>Overview</a></li>
              <li><a href="#features" style={{ color: '#718096', textDecoration: 'none' }}>Capabilities</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#1a202c', marginBottom: '12px' }}>
              System APIs
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ color: '#38a169', textDecoration: 'none' }}>FastAPI Swagger Docs</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#718096',
          gap: '12px'
        }}>
          <div>© 2026 WildGuard Coexistence Platform. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
