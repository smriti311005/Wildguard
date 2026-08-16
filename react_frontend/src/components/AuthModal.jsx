import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  User as UserIcon, 
  Lock, 
  Mail, 
  MapPin, 
  Building2, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { loginUser, signupUser, getUsers, approveUser } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentUser }) {
  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup State
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Hassan');
  const [village, setVillage] = useState('Belur');
  const [department, setDepartment] = useState('Karnataka Forest Department');
  const [designation, setDesignation] = useState('Range Officer');
  const [employeeId, setEmployeeId] = useState('KFD-2026-08');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin users view
  const [allUsers, setAllUsers] = useState([]);
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin && isOpen) {
      getUsers().then(setAllUsers).catch(console.error);
    }
  }, [isAdmin, isOpen]);

  if (!isOpen) return null;

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(demoEmail, demoPassword);
      if (onAuthSuccess) onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      if (onAuthSuccess) onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signupUser({
        name,
        email,
        phone,
        password,
        role,
        district,
        village,
        department,
        designation,
        employee_id: employeeId
      });
      setSuccessMsg(res.data?.message || 'Account created successfully!');
      setTimeout(() => {
        setTab('signin');
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOfficer = async (userId) => {
    try {
      await approveUser(userId);
      const updated = await getUsers();
      setAllUsers(updated);
    } catch (e) {
      alert('Error approving user: ' + e.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#ffffff' }}>
              {isAdmin ? 'System Administration & User Roles' : (tab === 'signin' ? 'Sign In to WildCare' : 'Create New WildCare Account')}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isAdmin ? 'Manage department personnel & verify officer credentials' : 'Role-based access for Citizens, Forest Officers & Administrators'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── 1-CLICK DEMO ACCOUNTS ─── */}
        {!isAdmin && (
          <div style={{
            background: 'rgba(6, 20, 12, 0.9)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#4ade80', marginBottom: '10px' }}>
              ⚡ 1-Click Instant Demo Logins
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleDemoLogin('officer@wildcare.demo', 'officer123')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', padding: '10px 6px', fontSize: '0.75rem', textAlign: 'center' }}
              >
                <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                <span style={{ fontWeight: '800', marginTop: '2px' }}>Forest Officer</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Range Officer</span>
              </button>

              <button 
                type="button"
                onClick={() => handleDemoLogin('citizen@wildcare.demo', 'citizen123')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', padding: '10px 6px', fontSize: '0.75rem', textAlign: 'center' }}
              >
                <span style={{ fontSize: '1.1rem' }}>🌾</span>
                <span style={{ fontWeight: '800', marginTop: '2px' }}>Rural Citizen</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Belur Village</span>
              </button>

              <button 
                type="button"
                onClick={() => handleDemoLogin('admin@wildcare.demo', 'admin123')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', padding: '10px 6px', fontSize: '0.75rem', textAlign: 'center' }}
              >
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span style={{ fontWeight: '800', marginTop: '2px' }}>SysAdmin</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Full Access</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        {!isAdmin && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <button
              onClick={() => { setTab('signin'); setError(''); }}
              className={`btn btn-sm ${tab === 'signin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`btn btn-sm ${tab === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              <UserPlus size={15} />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Error / Success alerts */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            borderRadius: 'var(--radius-md)',
            color: '#4ade80',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ─── SIGN IN FORM ─── */}
        {!isAdmin && tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@wildcare.demo"
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              <LogIn size={16} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* ─── SIGN UP FORM ─── */}
        {!isAdmin && tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Ramesh Kumar"
                className="form-input"
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="form-input"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="CITIZEN">Citizen / Farmer</option>
                <option value="FOREST_OFFICER">Forest Officer (Requires Department Verification)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">District</label>
                <input 
                  type="text" 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Village / Range</label>
                <input 
                  type="text" 
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {role === 'FOREST_OFFICER' && (
              <div className="form-group">
                <label className="form-label">Department Employee ID</label>
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="form-input"
                  placeholder="KFD-2026-081"
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>
        )}

        {/* ─── ADMIN USER MANAGEMENT PANEL ─── */}
        {isAdmin && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>
              Registered Users & Verification Queue
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {allUsers.map((u) => (
                <div key={u.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#ffffff' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email} | {u.role}</div>
                  </div>
                  <div>
                    {u.status === 'PENDING' ? (
                      <button 
                        onClick={() => handleApproveOfficer(u.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Approve Officer
                      </button>
                    ) : (
                      <span className="badge badge-resolved">ACTIVE</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
