import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Search, 
  Filter, 
  PieChart, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Analytics({ stats, alerts = [], corridorsData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const speciesDist = stats?.species_distribution || {
    Elephant: 4,
    Tiger: 3,
    Leopard: 3,
    'Wild Boar': 2,
    Bear: 1
  };

  const timeline = stats?.activity_timeline || [
    { time: '00:00 - 04:00', detections: 6, risk: 'HIGH' },
    { time: '04:00 - 08:00', detections: 4, risk: 'MEDIUM' },
    { time: '08:00 - 12:00', detections: 2, risk: 'LOW' },
    { time: '12:00 - 16:00', detections: 3, risk: 'LOW' },
    { time: '16:00 - 20:00', detections: 5, risk: 'MEDIUM' },
    { time: '20:00 - 24:00', detections: 7, risk: 'HIGH' }
  ];

  const maxTimelineDetections = Math.max(...timeline.map(t => t.detections), 1);

  // Filter alerts for the logs table
  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch = 
      (a.species || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.node_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CSV Export
  const handleExportCSV = () => {
    if (alerts.length === 0) return;
    const headers = ['Incident_ID', 'Species', 'Confidence', 'Node_ID', 'Latitude', 'Longitude', 'Status', 'Timestamp'];
    const rows = alerts.map(a => [
      a.id,
      `"${a.species}"`,
      a.confidence,
      `"${a.node_id}"`,
      a.latitude,
      a.longitude,
      `"${a.status}"`,
      `"${a.timestamp}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wildlife_Incident_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ─── HEADER ─── */}
      <div className="glass-panel" style={{
        padding: '24px 30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#edfdf5',
            border: '1px solid #c6f6d5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38a169'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="category-tag" style={{ marginBottom: '2px' }}>DATA & INTELLIGENCE</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#1a202c' }}>
              Operational Analytics & Incident Intelligence
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>
              Historical trends, species activity distribution, and audit log exports
            </p>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          className="btn btn-primary"
        >
          <Download size={16} />
          <span>Export Logs (.CSV)</span>
        </button>
      </div>

      {/* ─── CHARTS & VISUALIZERS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Species Distribution Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#38a169" />
            <span>Species Detection Frequency</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(speciesDist).map(([sp, count]) => {
              const total = Object.values(speciesDist).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={sp}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: '#1a202c' }}>{sp}</span>
                    <span style={{ color: '#718096' }}>{count} sightings ({pct}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f1f5f9',
                    borderRadius: '999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: ['Tiger', 'Leopard', 'Elephant'].includes(sp) 
                        ? '#e53e3e' 
                        : '#48bb78',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time of Day Activity Timeline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#3182ce" />
            <span>Detections by Time of Day (24-Hr Cycle)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {timeline.map((t, idx) => {
              const heightPct = Math.round((t.detections / maxTimelineDetections) * 100);
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.82rem'
                }}>
                  <span style={{ width: '100px', color: '#718096', fontFamily: 'var(--font-mono)' }}>
                    {t.time}
                  </span>
                  <div style={{ flex: 1, height: '18px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${heightPct}%`,
                      height: '100%',
                      background: t.risk === 'HIGH' 
                        ? '#e53e3e' 
                        : (t.risk === 'MEDIUM' ? '#dd6b20' : '#48bb78'),
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.72rem'
                    }}>
                      {t.detections}
                    </div>
                  </div>
                  <span className={`badge ${t.risk === 'HIGH' ? 'badge-active' : (t.risk === 'MEDIUM' ? 'badge-acknowledged' : 'badge-resolved')}`} style={{ fontSize: '0.65rem' }}>
                    {t.risk}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── FILTERABLE INCIDENT AUDIT TABLE ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '18px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c' }}>Incident Telemetry Logs</h3>
            <p style={{ fontSize: '0.78rem', color: '#718096' }}>
              Showing {filteredAlerts.length} of {alerts.length} total database records
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
              <input 
                type="text" 
                placeholder="Search species / node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px', padding: '7px 12px 7px 34px', fontSize: '0.82rem' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: '150px', padding: '7px 12px', fontSize: '0.82rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Species</th>
                <th>Confidence</th>
                <th>Sensor Node</th>
                <th>GPS Coords</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#a0aec0', padding: '30px 0' }}>
                    No matching detection logs found.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#276749' }}>
                      #{alert.id}
                    </td>
                    <td style={{ fontWeight: '800', color: '#1a202c' }}>
                      {alert.species}
                    </td>
                    <td>
                      {(alert.confidence * 100).toFixed(1)}%
                    </td>
                    <td>
                      {alert.node_id}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge badge-${alert.status.toLowerCase()}`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
