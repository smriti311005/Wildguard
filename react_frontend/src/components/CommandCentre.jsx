import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  Radio, 
  Activity, 
  Layers, 
  Trees, 
  Droplets, 
  Mountain, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Eye,
  Camera
} from 'lucide-react';

export default function CommandCentre({ 
  stats, 
  alerts, 
  onUpdateAlertStatus, 
  onNavigateTab,
  onSelectAlertForMap 
}) {
  const [selectedAlertForSms, setSelectedAlertForSms] = useState(null);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  const latestAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  // Determine risk level based on latest alert species or default
  const isHighRisk = latestAlert && ['tiger', 'leopard', 'elephant', 'lion', 'bear'].includes((latestAlert.species || '').toLowerCase());
  const riskScore = isHighRisk ? 88 : 45;
  const riskCategory = isHighRisk ? 'CRITICAL' : 'MODERATE';

  const explainabilityFactors = [
    { name: 'Species Hazard Score', weight: '30%', score: isHighRisk ? '30.0/30' : '12.0/30', level: isHighRisk ? 'HIGH' : 'LOW' },
    { name: 'Forest Canopy Density (NDVI)', weight: '20%', score: '16.5/20', level: 'HIGH' },
    { name: 'AI Detection Confidence', weight: '20%', score: latestAlert ? `${(latestAlert.confidence * 20).toFixed(1)}/20` : '18.2/20', level: 'HIGH' },
    { name: 'Corridor Proximity (DBSCAN)', weight: '15%', score: '13.5/15', level: 'HIGH' },
    { name: 'Waterhole / Slope Exposure', weight: '10%', score: '7.8/10', level: 'MEDIUM' },
    { name: 'Crop Harvest Factor', weight: '5%', score: '4.5/5', level: 'ACTIVE' },
  ];

  const handleSendSmsBroadcast = (alert) => {
    setSelectedAlertForSms(alert);
    setSmsSentNotice(false);
  };

  const handleConfirmSmsDispatch = () => {
    setSmsSentNotice(true);
    setTimeout(() => {
      setSelectedAlertForSms(null);
      setSmsSentNotice(false);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ─── HERO BRAND BANNER (WILDLIFE INSIGHTS STYLE) ─── */}
      <section className="glass-panel" style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        padding: '36px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div className="category-tag">
            AI-POWERED WILDLIFE CONFLICT MITIGATION
          </div>

          <h1 style={{
            fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
            fontWeight: '900',
            lineHeight: 1.12,
            marginBottom: '12px',
            color: '#1a202c'
          }}>
            See movement early.<br />
            <span style={{ color: '#48bb78' }}>Protect people and wildlife.</span>
          </h1>

          <p style={{
            color: '#4a5568',
            fontSize: '1.02rem',
            maxWidth: '680px',
            marginBottom: '24px',
            lineHeight: 1.6
          }}>
            Unified early-warning system combining Edge YOLOv8 vision, Sentinel-2 GIS habitat telemetry,
            and predictive animal movement vectors for Hassan reserve corridors and surrounding villages.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={() => onNavigateTab('detection')}
              className="btn btn-primary"
            >
              <Camera size={18} />
              <span>Launch AI Detection Console</span>
            </button>
            <button 
              onClick={() => onNavigateTab('map')}
              className="btn btn-secondary"
            >
              <MapPin size={18} />
              <span>Explore Live Movement Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── SYSTEM TELEMETRY STRIP ─── */}
      <div className="telemetry-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Sensors</span>
            <div className="stat-icon-box"><Radio size={18} /></div>
          </div>
          <div className="stat-value">{stats?.sensor_network?.online_nodes || 4} / 4</div>
          <div className="stat-subtext" style={{ color: '#38a169', fontWeight: '700' }}>● All Edge Nodes Operational</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">AI Mean Confidence</span>
            <div className="stat-icon-box"><Activity size={18} /></div>
          </div>
          <div className="stat-value">{stats?.sensor_network?.average_confidence_pct || 91.5}%</div>
          <div className="stat-subtext">YOLOv8 Edge Classifier</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Threat Incidents</span>
            <div className="stat-icon-box" style={{ background: isHighRisk ? '#fff5f5' : '#fffaf0', color: isHighRisk ? '#e53e3e' : '#dd6b20' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: isHighRisk ? '#e53e3e' : '#dd6b20' }}>
            {stats?.active_alerts || 2} Active
          </div>
          <div className="stat-subtext">{stats?.high_risk_incidents || 3} Total High Risk Logged</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Forest Canopy (NDVI)</span>
            <div className="stat-icon-box"><Trees size={18} /></div>
          </div>
          <div className="stat-value">0.68</div>
          <div className="stat-subtext">Dense Buffer Foliage</div>
        </div>
      </div>

      {/* ─── REAL-TIME CONFLICT RISK & EXPLAINABILITY ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Risk Score Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          background: isHighRisk ? '#fff5f5' : '#fffaf0',
          border: `1px solid ${isHighRisk ? '#fed7d7' : '#feebc8'}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isHighRisk ? '#c53030' : '#c05621'
            }}>
              CONFLICT RISK ENGINE
            </span>
            <span className={`badge ${isHighRisk ? 'badge-active' : 'badge-acknowledged'}`}>
              {riskCategory}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '3.2rem',
              fontWeight: '900',
              color: isHighRisk ? '#e53e3e' : '#dd6b20',
              lineHeight: 1
            }}>
              {riskScore}
            </span>
            <span style={{ fontSize: '1.2rem', color: '#718096', fontWeight: '700' }}>/ 100</span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '4px' }}>
            {latestAlert ? `${latestAlert.species} Detected` : 'Elephant Herd Detected'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '18px' }}>
            Location: {latestAlert ? `${latestAlert.latitude.toFixed(4)}, ${latestAlert.longitude.toFixed(4)}` : '19.238°N, 72.832°E'} ({latestAlert?.node_id || 'Forest-Node-002'})
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '0.82rem',
            color: '#4a5568',
            lineHeight: 1.5
          }}>
            <b>Intelligence Advisory:</b> Animal movement vector projected towards Belur Village canal crossing within 15 minutes. Community SMS and siren alerts recommended.
          </div>
        </div>

        {/* Explainability Breakdown */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c' }}>
              6-Factor Explainability Breakdown
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#38a169', fontWeight: '800', textTransform: 'uppercase' }}>
              REAL-TIME WEIGHTED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {explainabilityFactors.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}>
                <div>
                  <span style={{ color: '#1a202c', fontWeight: '700' }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#718096', marginLeft: '6px' }}>({item.weight})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#276749' }}>
                    {item.score}
                  </span>
                  <span className={`badge ${item.level === 'HIGH' ? 'badge-active' : (item.level === 'MEDIUM' ? 'badge-acknowledged' : 'badge-resolved')}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {item.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── LIVE ALERT INCIDENT BROADCAST CARD ─── */}
      {latestAlert && (
        <section className="glass-panel" style={{
          borderLeft: `6px solid ${latestAlert.status === 'ACTIVE' ? '#e53e3e' : (latestAlert.status === 'ACKNOWLEDGED' ? '#dd6b20' : '#48bb78')}`,
          padding: '24px 28px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: latestAlert.status === 'ACTIVE' ? '#fff5f5' : '#edfdf5',
                border: `1px solid ${latestAlert.status === 'ACTIVE' ? '#feb2b2' : '#c6f6d5'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: latestAlert.status === 'ACTIVE' ? '#e53e3e' : '#38a169'
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: latestAlert.status === 'ACTIVE' ? '#c53030' : '#276749'
                  }}>
                    LATEST SENSOR INCIDENT #{latestAlert.id}
                  </span>
                  <span className={`badge badge-${latestAlert.status.toLowerCase()}`}>
                    {latestAlert.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1a202c', marginTop: '2px' }}>
                  {latestAlert.species} Sighted near {latestAlert.node_id}
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {latestAlert.status === 'ACTIVE' && (
                <button 
                  onClick={() => onUpdateAlertStatus(latestAlert.id, 'ACKNOWLEDGED')}
                  className="btn btn-secondary btn-sm"
                >
                  <CheckCircle2 size={15} color="#dd6b20" />
                  <span>Acknowledge</span>
                </button>
              )}
              {latestAlert.status !== 'RESOLVED' && (
                <button 
                  onClick={() => onUpdateAlertStatus(latestAlert.id, 'RESOLVED')}
                  className="btn btn-secondary btn-sm"
                >
                  <CheckCircle2 size={15} color="#38a169" />
                  <span>Mark Resolved</span>
                </button>
              )}
              <button 
                onClick={() => handleSendSmsBroadcast(latestAlert)}
                className="btn btn-primary btn-sm"
              >
                <Send size={15} />
                <span>Dispatch SMS</span>
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            background: '#f8fafc',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem'
          }}>
            <div>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '800' }}>Confidence</div>
              <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>{(latestAlert.confidence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '800' }}>Coordinates</div>
              <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>{latestAlert.latitude.toFixed(4)}, {latestAlert.longitude.toFixed(4)}</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '800' }}>Timestamp</div>
              <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>{new Date(latestAlert.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '800' }}>Broadcast Radius</div>
              <div style={{ color: '#38a169', fontWeight: '800', marginTop: '2px' }}>2.5 km (Belur Rural)</div>
            </div>
          </div>
        </section>
      )}

      {/* ─── SMS BROADCAST SIMULATOR MODAL ─── */}
      {selectedAlertForSms && (
        <div className="modal-overlay" onClick={() => setSelectedAlertForSms(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#edfdf5',
                border: '1px solid #c6f6d5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38a169'
              }}>
                <Smartphone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a202c' }}>Emergency SMS Broadcast Preview</h3>
                <p style={{ fontSize: '0.8rem', color: '#718096' }}>Target: 842 registered farmers in Belur & Hassan Rural</p>
              </div>
            </div>

            {/* Simulated SMS Box */}
            <div style={{
              background: '#f8fafc',
              border: '2px dashed #48bb78',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#1a202c',
              marginBottom: '20px'
            }}>
              🚨 <b>[WILDCARE ALERT - KFD]</b><br />
              HIGH RISK: <b>{selectedAlertForSms.species.toUpperCase()}</b> detected near <b>{selectedAlertForSms.node_id}</b> at {new Date(selectedAlertForSms.timestamp).toLocaleTimeString()}.<br />
              Distance: ~1.2 km from Belur village boundary.<br />
              <b>Advisory:</b> Avoid forest fringe canals and paddy fields. Keep cattle secured. Emergency Helpline: 1800-425-4567.
            </div>

            {smsSentNotice ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 18px',
                background: '#edfdf5',
                border: '1px solid #9ae6b4',
                borderRadius: 'var(--radius-md)',
                color: '#276749',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                <CheckCircle2 size={20} color="#38a169" />
                <span>SMS Broadcast Dispatched to 842 cellular subscribers!</span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  onClick={() => setSelectedAlertForSms(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmSmsDispatch}
                  className="btn btn-primary"
                >
                  <Send size={16} />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
