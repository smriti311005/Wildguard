import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  FileText,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { getCommunityReports, submitCommunityReport, verifyCommunityReport } from '../api';

export default function CommunityReports({ user, onReportVerified }) {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Form State
  const [species, setSpecies] = useState('Elephant');
  const [latitude, setLatitude] = useState(19.233);
  const [longitude, setLongitude] = useState(72.829);
  const [severity, setSeverity] = useState('Dangerous');
  const [description, setDescription] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(null);

  // Verification Officer Notes
  const [officerNotes, setOfficerNotes] = useState({});

  const isOfficer = user && ['FOREST_OFFICER', 'ADMIN'].includes(user.role);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getCommunityReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(4)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(4)));
        },
        () => {
          setLatitude(19.231);
          setLongitude(72.825);
        }
      );
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const res = await submitCommunityReport({
        species,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description,
        severity
      });
      setSubmittedNotice(res.report_id);
      setDescription('');
      fetchReports();
    } catch (err) {
      alert('Error submitting report: ' + err.message);
    }
  };

  const handleVerify = async (reportId, status) => {
    try {
      const notes = officerNotes[reportId] || '';
      await verifyCommunityReport(reportId, status, notes);
      fetchReports();
      if (onReportVerified) onReportVerified();
    } catch (err) {
      alert('Error verifying report: ' + err.message);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status.toUpperCase() === filterStatus.toUpperCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ─── HEADER ─── */}
      <div className="glass-panel" style={{ padding: '24px 30px' }}>
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
            <Users size={22} />
          </div>
          <div>
            <div className="category-tag" style={{ marginBottom: '2px' }}>CROWDSOURCED SIGHTINGS</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#1a202c' }}>
              Community Sighting Reports & Verification
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>
              Crowdsourced early-warning sightings reported by rural communities & verified by Forest Officers
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* ─── SUBMIT REPORT FORM ─── */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38a169" />
            <span>Submit Wildlife Sighting</span>
          </h3>

          <form onSubmit={handleSubmitReport}>
            <div className="form-group">
              <label className="form-label">Observed Species</label>
              <select 
                value={species} 
                onChange={(e) => setSpecies(e.target.value)} 
                className="form-select"
              >
                <option value="Elephant">Elephant (Elephas maximus)</option>
                <option value="Tiger">Bengal Tiger (Panthera tigris)</option>
                <option value="Leopard">Indian Leopard (Panthera pardus)</option>
                <option value="Wild Boar">Wild Boar (Sus scrofa)</option>
                <option value="Sloth Bear">Sloth Bear (Melursus ursinus)</option>
                <option value="Spotted Deer">Spotted Deer (Axis axis)</option>
                <option value="Other">Other / Unknown Species</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleUseMyLocation}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginBottom: '14px' }}
            >
              <MapPin size={14} />
              <span>Use Current GPS Coordinates</span>
            </button>

            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <select 
                value={severity} 
                onChange={(e) => setSeverity(e.target.value)} 
                className="form-select"
              >
                <option value="Normal">Normal — Sighted in far buffer zone</option>
                <option value="Concerning">Concerning — Near farm perimeter or canal</option>
                <option value="Dangerous">Dangerous — Inside village or near school</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Observation Notes / Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe animal direction, group size, behavior..." 
                className="form-textarea" 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Send size={16} />
              <span>Submit Sighting</span>
            </button>
          </form>

          {submittedNotice && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: '#edfdf5',
              border: '1px solid #9ae6b4',
              borderRadius: 'var(--radius-sm)',
              color: '#276749',
              fontSize: '0.85rem'
            }}>
              ✅ Sighting filed with Tracking ID: <b>{submittedNotice}</b>. Forest team notified.
            </div>
          )}
        </div>

        {/* ─── OFFICER VERIFICATION QUEUE ─── */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c' }}>
                Department Review Queue
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#718096' }}>
                {isOfficer ? 'Officers can verify reports to auto-create map pins' : 'Showing recent sightings'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Reports */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
            {filteredReports.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#a0aec0', padding: '40px 0' }}>
                No reports found in this category.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report.id || report.report_id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '900', color: '#1a202c' }}>
                        {report.species}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#718096' }}>
                        {report.report_id}
                      </span>
                    </div>
                    <span className={`badge badge-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '8px', lineHeight: 1.4 }}>
                    "{report.description}"
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.75rem', color: '#718096', marginBottom: '12px' }}>
                    <div>Reporter: <b style={{ color: '#1a202c' }}>{report.reporter_name}</b></div>
                    <div>Location: <b>{report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}</b></div>
                    <div>Severity: <b style={{ color: report.severity === 'Dangerous' ? '#e53e3e' : '#dd6b20' }}>{report.severity}</b></div>
                  </div>

                  {/* Officer Actions */}
                  {isOfficer && report.status === 'PENDING' && (
                    <div style={{
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input 
                          type="text"
                          placeholder="Officer assessment remarks..."
                          value={officerNotes[report.report_id] || ''}
                          onChange={(e) => setOfficerNotes({ ...officerNotes, [report.report_id]: e.target.value })}
                          className="form-input"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleVerify(report.report_id, 'VERIFIED')}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleVerify(report.report_id, 'INVESTIGATING')}
                          className="btn btn-secondary btn-sm"
                        >
                          <HelpCircle size={14} />
                          <span>Investigate</span>
                        </button>
                        <button
                          onClick={() => handleVerify(report.report_id, 'REJECTED')}
                          className="btn btn-danger btn-sm"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {report.officer_notes && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.75rem',
                      color: '#276749',
                      background: '#edfdf5',
                      border: '1px solid #c6f6d5',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}>
                      <b>Officer Note:</b> {report.officer_notes}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
