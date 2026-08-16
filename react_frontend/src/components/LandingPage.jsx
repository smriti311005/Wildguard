import React, { useState } from 'react';
import { 
  Eye, 
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
  Database
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
      
      {/* ─── WILDLIFE INSIGHTS STYLE HEADER & NAVBAR ─── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
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
              <Eye size={22} color="#38a169" />
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
                Wild<span style={{ color: '#48bb78' }}>Guard</span>
              </div>
            </div>
          </div>

          {/* Center Nav Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '32px', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }} className="desktop-nav-links">
            <a href="#capabilities" style={{ color: '#4a5568' }}>Explore Data</a>
            <a href="#interactive-preview" style={{ color: '#4a5568' }}>Live Platform</a>
            <a href="#architecture" style={{ color: '#4a5568' }}>Technology</a>
            <a href="#security" style={{ color: '#4a5568' }}>Community</a>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <button 
                onClick={() => onEnterDashboard()}
                className="btn btn-primary btn-sm"
              >
                <span>Dashboard ({user.role})</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onOpenAuth('signin')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid #48bb78', color: '#276749', background: '#ffffff' }}
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

      {/* ─── HERO SECTION 01: A QUICKER WAY TO IDENTIFY AND MITIGATE ─── */}
      <section style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '70px 24px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        <div>
          <div className="category-tag">
            UPLOAD & IDENTIFY
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            fontWeight: '900',
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: '#1a202c'
          }}>
            A Quicker Way to Detect and Protect
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: '#4a5568',
            lineHeight: 1.65,
            marginBottom: '32px',
            maxWidth: '520px'
          }}>
            Anyone collecting camera trap photos can run real-time YOLOv8 neural detection. Data is fused with Sentinel-2 GIS habitat layers to generate immediate, corridor-scale early warnings for surrounding communities.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button 
              onClick={() => user ? onEnterDashboard() : onOpenAuth('signup')}
              className="btn btn-primary"
              style={{ padding: '13px 28px', fontSize: '0.95rem' }}
            >
              <span>Get Started</span>
            </button>
            <a 
              href="#interactive-preview"
              className="btn btn-secondary"
              style={{ padding: '13px 24px', fontSize: '0.95rem' }}
            >
              <span>Explore Platform</span>
            </a>
          </div>
        </div>

        {/* Camera Trap Grid Graphic (Styled exactly like Wildlife Insights!) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Tile 1 with green bounding box */}
          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #48bb78', background: '#edfdf5', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem' }}>🐘</span>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#276749', background: '#c6f6d5', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
              Elephant 94%
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem', opacity: 0.7 }}>🐅</span>
            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '4px' }}>Tiger</div>
          </div>

          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem', opacity: 0.7 }}>🐆</span>
            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '4px' }}>Leopard</div>
          </div>

          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem', opacity: 0.7 }}>🐗</span>
            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '4px' }}>Wild Boar</div>
          </div>

          {/* Tile 5 with green bounding box */}
          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #48bb78', background: '#edfdf5', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem' }}>🦊</span>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#276749', background: '#c6f6d5', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
              Fox 88%
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.4rem', opacity: 0.7 }}>🦌</span>
            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '4px' }}>Spotted Deer</div>
          </div>
        </div>
      </section>

      {/* ─── HERO SECTION 02: LET A COMPUTER DO THE TAGGING ─── */}
      <section style={{
        background: '#f9fafb',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '56px',
          alignItems: 'center'
        }}>
          {/* Real Live Preview Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            background: '#ffffff',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-beacon"></span>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#276749', textTransform: 'uppercase' }}>
                  Node: Belur-Perimeter-001
                </span>
              </div>
              <span className="badge badge-resolved">● SENTRY ACTIVE</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: '800', textTransform: 'uppercase' }}>
                Predicted Species Classification
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a202c', marginTop: '2px' }}>
                {latestAlert ? latestAlert.species : 'Elephant Herd'} (94.0% Confidence)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#38a169', marginTop: '2px' }}>
                Inference Latency: 171.2ms (On-Device Neural)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#718096', fontWeight: '800' }}>CANOPY DENSITY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1a202c' }}>0.68 NDVI</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#718096', fontWeight: '800' }}>WATER PROXIMITY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1a202c' }}>352 meters</div>
              </div>
            </div>
          </div>

          <div>
            <div className="category-tag">
              IDENTIFY & AUTOMATE
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: '900',
              lineHeight: 1.15,
              color: '#1a202c',
              marginBottom: '18px'
            }}>
              Let a Computer do the Tagging
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: '#4a5568',
              lineHeight: 1.65,
              marginBottom: '28px'
            }}>
              Animals in your camera trap photos are automatically identified using fine-tuned machine learning models. Thousands of images can be tagged within minutes, saving you time to do the crucial field work.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button 
                onClick={() => user ? onEnterDashboard('detection') : onOpenAuth('signin')}
                className="btn btn-primary"
              >
                <span>About our AI</span>
              </button>
              <button 
                onClick={() => user ? onEnterDashboard('analytics') : onOpenAuth('signin')}
                className="btn btn-secondary"
              >
                <span>AI Performance</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES (WHAT → HOW → WHY) ─── */}
      <section id="capabilities" style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="category-tag">
            INTELLIGENT COEXISTENCE CAPABILITIES
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '900', color: '#1a202c', marginTop: '4px' }}>
            Four layers of proactive wildlife defense
          </h2>
          <p style={{ color: '#718096', maxWidth: '600px', margin: '8px auto 0', fontSize: '0.95rem' }}>
            Engineered to eliminate false alarms and give forest officers and rural communities decisive advance notice.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '28px 24px' }}>
            <div className="category-tag">01 // SENTRY VISION</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
              Edge YOLOv8 Neural Sentry
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '16px' }}>
              <b>WHAT:</b> Ultra-fast species classification running on camera traps.<br />
              <b>HOW:</b> On-device inference tags elephants, tigers, and leopards in &lt;180ms.<br />
              <b>WHY:</b> Delivers immediate alerts without depending on cloud bandwidth.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#276749', fontWeight: '700' }}>
              <CheckCircle2 size={15} color="#38a169" />
              <span>91.5% Validation Accuracy</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px 24px' }}>
            <div className="category-tag">02 // SATELLITE GIS</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
              Sentinel-2 GIS Telemetry
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '16px' }}>
              <b>WHAT:</b> Vegetation canopy index and terrain slope analysis.<br />
              <b>HOW:</b> Correlates NDVI greenness, elevation, and water proximity.<br />
              <b>WHY:</b> Distinguishes safe forest foraging from crop-raiding intent.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#276749', fontWeight: '700' }}>
              <CheckCircle2 size={15} color="#38a169" />
              <span>10m Spatial Resolution</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px 24px' }}>
            <div className="category-tag">03 // MOVEMENT VECTOR</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
              Predictive Vector Trajectory
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '16px' }}>
              <b>WHAT:</b> Random Forest behavioral intent & corridor projection.<br />
              <b>HOW:</b> Calculates 15-minute advance arrival coordinates.<br />
              <b>WHY:</b> Gives rangers and villagers actionable reaction time.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#276749', fontWeight: '700' }}>
              <CheckCircle2 size={15} color="#38a169" />
              <span>15-Minute Advance Notice</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px 24px' }}>
            <div className="category-tag">04 // DISPATCH</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
              Autonomous SMS Broadcast
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '16px' }}>
              <b>WHAT:</b> Targeted emergency SMS alerts and solar siren activation.<br />
              <b>HOW:</b> Geo-targeted Kannada/English broadcast to 2.5km radius.<br />
              <b>WHY:</b> Prevents accidental encounters and protects rural livelihoods.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#276749', fontWeight: '700' }}>
              <CheckCircle2 size={15} color="#38a169" />
              <span>Zero Delay Dispatch</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── INTERACTIVE LIVE DEMO TABS ─── */}
      <section id="interactive-preview" style={{
        background: '#f9fafb',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="category-tag">LIVE OPERATIONS DEMO</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: '#1a202c' }}>
              Explore the Field Dashboard
            </h2>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveFeatureTab('command')}
              className={`btn btn-sm ${activeFeatureTab === 'command' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Command Centre
            </button>
            <button 
              onClick={() => setActiveFeatureTab('detection')}
              className={`btn btn-sm ${activeFeatureTab === 'detection' ? 'btn-primary' : 'btn-secondary'}`}
            >
              YOLOv8 AI Console
            </button>
            <button 
              onClick={() => setActiveFeatureTab('map')}
              className={`btn btn-sm ${activeFeatureTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            >
              GIS Movement Map
            </button>
          </div>

          {/* Frame */}
          <div className="glass-panel" style={{ padding: '28px', background: '#ffffff' }}>
            {activeFeatureTab === 'command' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c' }}>Live Tactical Operations View</h4>
                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>Real-time 6-factor explainability telemetry from field nodes</p>
                  </div>
                  <button onClick={() => onEnterDashboard('command')} className="btn btn-primary btn-sm">
                    <span>Open Full Console</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #e53e3e', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#c53030', fontWeight: '800' }}>CURRENT THREAT</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1a202c', marginTop: '2px' }}>Elephant Detected</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>Node: Forest-Node-002</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #48bb78', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#276749', fontWeight: '800' }}>AI CONFIDENCE</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#276749', marginTop: '2px' }}>94.0% Match</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>YOLOv8 Sentry Weights</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3182ce', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#2b6cb0', fontWeight: '800' }}>CANOPY (NDVI)</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2b6cb0', marginTop: '2px' }}>0.68 NDVI</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>Sentinel-2 Multi-Spectral</div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'detection' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c' }}>Edge AI YOLOv8 Classifier Console</h4>
                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>Upload camera trap snapshots or select 1-click wildlife presets</p>
                  </div>
                  <button onClick={() => onEnterDashboard('detection')} className="btn btn-primary btn-sm">
                    <span>Open Detection Console</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
                    <span className="badge badge-active">🐅 Bengal Tiger</span>
                    <span className="badge badge-acknowledged">🐘 Elephant Herd</span>
                    <span className="badge badge-resolved">🐆 Indian Leopard</span>
                    <span className="badge badge-pending">🐗 Wild Boar Sounder</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                    Instant neural bounding-box annotation and automated telemetry extraction.
                  </p>
                </div>
              </div>
            )}

            {activeFeatureTab === 'map' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c' }}>GIS Movement & Corridor Vectors</h4>
                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>Interactive map with migration corridors and safe zones</p>
                  </div>
                  <button onClick={() => onEnterDashboard('map')} className="btn btn-primary btn-sm">
                    <span>Open GIS Map</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                <div style={{
                  height: '200px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px dashed #cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <MapPin size={28} color="#48bb78" />
                  <div style={{ fontWeight: '800', color: '#1a202c' }}>Western Ghats & Hassan Buffer Corridor Layer</div>
                  <div style={{ fontSize: '0.78rem', color: '#718096' }}>Interactive GIS map with live animal pins and 15-min trajectory</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FINAL CALL TO ACTION ─── */}
      <section style={{
        maxWidth: '1100px',
        margin: '60px auto',
        padding: '48px 24px',
        textAlign: 'center',
        background: '#edfdf5',
        border: '1px solid #c6f6d5',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div className="category-tag">DEPLOY INTELLIGENCE</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: '#1a202c', marginBottom: '12px' }}>
          Ready to bring early warning to your reserve corridor?
        </h2>
        <p style={{ color: '#4a5568', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 24px' }}>
          Experience zero-latency wildlife coexistence intelligence with YOLOv8 vision and Sentinel-2 satellite data.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => user ? onEnterDashboard() : onOpenAuth('signup')}
            className="btn btn-primary"
            style={{ padding: '13px 30px' }}
          >
            <span>Get Started</span>
            <ArrowRight size={15} />
          </button>
          <button 
            onClick={() => onOpenAuth('signin')}
            className="btn btn-secondary"
            style={{ padding: '13px 24px' }}
          >
            <span>Sign In</span>
          </button>
        </div>
      </section>

      {/* ─── CLEAN FOOTER ─── */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 24px 32px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Eye size={20} color="#38a169" />
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1a202c' }}>WildGuard</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#718096', lineHeight: 1.6 }}>
              Human–Wildlife Coexistence & Early-Warning Platform.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#1a202c', marginBottom: '12px' }}>
              Explore
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#capabilities">Camera Traps</a></li>
              <li><a href="#interactive-preview">AI Tagging</a></li>
              <li><a href="#interactive-preview">GIS Corridors</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#1a202c', marginBottom: '12px' }}>
              Technology
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><span style={{ color: '#718096' }}>Ultralytics YOLOv8</span></li>
              <li><span style={{ color: '#718096' }}>Sentinel-2 GIS</span></li>
              <li><span style={{ color: '#718096' }}>Random Forest ML</span></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#1a202c', marginBottom: '12px' }}>
              API & Governance
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">FastAPI Swagger</a></li>
              <li><span style={{ color: '#718096' }}>Karnataka Forest Dept</span></li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#a0aec0',
          gap: '12px'
        }}>
          <div>© 2026 WildGuard Coexistence Initiative. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
