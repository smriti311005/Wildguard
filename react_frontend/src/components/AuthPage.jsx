import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Eye as EyeIcon, 
  Lock, 
  Mail, 
  ArrowLeft,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { loginUser, signupUser } from '../api';

export default function AuthPage({ 
  initialTab = 'signin', 
  onAuthSuccess, 
  onBackToLanding 
}) {
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Registration Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Hassan');
  const [village, setVillage] = useState('Belur');
  const [department, setDepartment] = useState('Karnataka Forest Department');
  const [designation, setDesignation] = useState('Range Forest Officer');
  const [employeeId, setEmployeeId] = useState('KFD-2026-081');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(demoEmail, demoPassword);
      if (onAuthSuccess) onAuthSuccess(data.user);
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
    } catch (err) {
      setError('Unable to sign in. Please verify your email and password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

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
      setError(err.message || 'Registration failed. Please check the entered fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: '#f8fafc',
      position: 'relative'
    }}>
      
      {/* Top Back to Landing Button */}
      <button 
        onClick={onBackToLanding}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '999px',
          padding: '8px 18px',
          color: '#4a5568',
          fontSize: '0.85rem',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Main Auth Container */}
      <div className="glass-panel" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '36px 36px',
        background: '#ffffff',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#edfdf5',
            border: '1px solid #c6f6d5',
            display: 'inline-flex',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38a169',
            margin: '0 auto 12px'
          }}>
            <EyeIcon size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a202c' }}>
            {tab === 'signin' ? 'Sign In to WildGuard' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '4px' }}>
            {tab === 'signin' 
              ? 'Access real-time early warning and field telemetry' 
              : 'Register for citizen safety advisories or officer credentials'
            }
          </p>
        </div>

        {/* ─── 1-CLICK INSTANT DEMO LOGINS ─── */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#276749',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="#38a169" />
            <span>1-Click Instant Demo Credentials</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button 
              type="button"
              onClick={() => handleDemoLogin('officer@wildguard.org', 'officer123')}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', padding: '8px 4px', textAlign: 'center', background: '#ffffff' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
              <span style={{ fontWeight: '800', fontSize: '0.75rem', marginTop: '2px', color: '#1a202c' }}>Forest Officer</span>
              <span style={{ fontSize: '0.62rem', color: '#718096' }}>Tactical Console</span>
            </button>

            <button 
              type="button"
              onClick={() => handleDemoLogin('citizen@wildguard.org', 'citizen123')}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', padding: '8px 4px', textAlign: 'center', background: '#ffffff' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🌾</span>
              <span style={{ fontWeight: '800', fontSize: '0.75rem', marginTop: '2px', color: '#1a202c' }}>Rural Citizen</span>
              <span style={{ fontSize: '0.62rem', color: '#718096' }}>Village Safety</span>
            </button>

            <button 
              type="button"
              onClick={() => handleDemoLogin('admin@wildguard.org', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ flexDirection: 'column', padding: '8px 4px', textAlign: 'center', background: '#ffffff' }}
            >
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <span style={{ fontWeight: '800', fontSize: '0.75rem', marginTop: '2px', color: '#1a202c' }}>SysAdmin</span>
              <span style={{ fontSize: '0.62rem', color: '#718096' }}>Full Access</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
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
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: 'var(--radius-sm)',
            color: '#c53030',
            fontSize: '0.84rem',
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
            background: '#edfdf5',
            border: '1px solid #9ae6b4',
            borderRadius: 'var(--radius-sm)',
            color: '#276749',
            fontSize: '0.84rem',
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
        {tab === 'signin' && (
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
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingRight: '40px' }}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#718096',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              <LogIn size={16} />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* ─── SIGN UP FORM ─── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
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
                  placeholder="ramesh@email.com"
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
              <label className="form-label">Select Account Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="CITIZEN">Rural Citizen / Farmer (Immediate Access)</option>
                <option value="FOREST_OFFICER">Range Forest Officer (Requires Verification)</option>
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
                  placeholder="KFD-2026-081"
                  className="form-input"
                  required 
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
