import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Radio, 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Server, 
  HardDrive, 
  Cpu, 
  Activity,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { getUsers, approveUser } from '../api';

export default function AdminPanel({ user, stats, corridorsData }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsersList(data || []);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId, userName) => {
    try {
      await approveUser(userId);
      setActionSuccess(`Officer ${userName} approved successfully.`);
      fetchUsers();
      setTimeout(() => setActionSuccess(''), 3500);
    } catch (e) {
      alert('Approval failed: ' + e.message);
    }
  };

  const sensorFleet = [
    { id: 'Perimeter-Node-001', name: 'Belur Village Perimeter Node', lat: 19.231, lon: 72.825, type: 'YOLOv8 Edge Camera', battery: 94, rssi: '-68 dBm (4G LTE)', status: 'HEALTHY', uptime: '18d 6h' },
    { id: 'Forest-Node-002', name: 'North Western Ghats Corridor Node', lat: 19.238, lon: 72.832, type: 'YOLOv8 Dual IR Camera', battery: 88, rssi: '-72 dBm (LoRaWAN)', status: 'HEALTHY', uptime: '24d 11h' },
    { id: 'Farm-Node-003', name: 'Agricultural Boundary East', lat: 19.224, lon: 72.841, type: 'Acoustic / Seismic Sentry', battery: 91, rssi: '-65 dBm (4G LTE)', status: 'HEALTHY', uptime: '12d 3h' },
    { id: 'River-Node-004', name: 'Hemavathi Water Crossing', lat: 19.245, lon: 72.836, type: 'Thermal Night Vision', battery: 82, rssi: '-79 dBm (LoRaWAN)', status: 'HEALTHY', uptime: '7d 19h' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#f3e8ff',
            border: '1px solid #d8b4fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7e22ce'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="category-tag" style={{ color: '#7e22ce', marginBottom: '2px' }}>ADMINISTRATION & DIAGNOSTICS</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#1a202c' }}>
              System Administration & Fleet Diagnostics
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>
              Manage role-based department permissions, edge sensor nodes, and operational telemetry
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div style={{
          padding: '12px 18px',
          background: '#edfdf5',
          border: '1px solid #9ae6b4',
          borderRadius: 'var(--radius-sm)',
          color: '#276749',
          fontWeight: '700',
          fontSize: '0.88rem'
        }}>
          ✅ {actionSuccess}
        </div>
      )}

      {/* ─── SYSTEM DIAGNOSTICS STRIP ─── */}
      <div className="telemetry-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">AI Engine</span>
            <div className="stat-icon-box" style={{ color: '#7e22ce', background: '#f3e8ff', borderColor: '#d8b4fe' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.3rem' }}>YOLOv8 + RF</div>
          <div className="stat-subtext" style={{ color: '#38a169', fontWeight: '700' }}>● Neural Inference Ready</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Database Storage</span>
            <div className="stat-icon-box" style={{ color: '#3182ce', background: '#ebf8ff', borderColor: '#bee3f8' }}>
              <Database size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.3rem' }}>SQLite (alerts.db)</div>
          <div className="stat-subtext">{stats?.total_detections || 0} Detections Logged</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Registered Personnel</span>
            <div className="stat-icon-box">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{usersList.length} Accounts</div>
          <div className="stat-subtext">{usersList.filter(u => u.status === 'PENDING').length} Pending Verification</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">GIS Satellite Proxy</span>
            <div className="stat-icon-box">
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.3rem' }}>Sentinel-2 SRTM</div>
          <div className="stat-subtext" style={{ color: '#38a169', fontWeight: '700' }}>● 10m Multi-Spectral Online</div>
        </div>
      </div>

      {/* ─── USER ACCESS & VERIFICATION QUEUE ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c' }}>
              Department Personnel & Verification Queue
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#718096' }}>
              Approve Range Forest Officers and review registered community accounts
            </p>
          </div>
          <button 
            onClick={fetchUsers} 
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Users</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>District / Dept</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#a0aec0', padding: '24px 0' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '800', color: '#1a202c' }}>
                      {u.name}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {u.email}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-active' : (u.role === 'FOREST_OFFICER' ? 'badge-acknowledged' : 'badge-resolved')}`} style={{ fontSize: '0.7rem' }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {u.district || 'Hassan'} {u.department ? `(${u.department})` : ''}
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'PENDING' ? 'badge-pending' : 'badge-resolved'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {u.status === 'PENDING' ? (
                        <button
                          onClick={() => handleApprove(u.id, u.name)}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve Access</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#276749', fontWeight: '700' }}>
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SENSOR FLEET HEALTH & TELEMETRY ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="#38a169" />
          <span>Edge Sensor Fleet Status & Telemetry</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Node ID & Name</th>
                <th>Sensor Type</th>
                <th>GPS Location</th>
                <th>Battery</th>
                <th>Signal RSSI</th>
                <th>Uptime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sensorFleet.map((node) => (
                <tr key={node.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#1a202c' }}>{node.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#718096', fontFamily: 'var(--font-mono)' }}>{node.id}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {node.type}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {node.lat.toFixed(3)}°N, {node.lon.toFixed(3)}°E
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', color: node.battery > 85 ? '#276749' : '#c05621' }}>
                      {node.battery}%
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#718096' }}>
                    {node.rssi}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#718096' }}>
                    {node.uptime}
                  </td>
                  <td>
                    <span className="badge badge-resolved">
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
