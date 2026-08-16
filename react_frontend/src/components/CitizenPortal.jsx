import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  HeartHandshake, 
  HelpCircle, 
  Info,
  Radio,
  Clock
} from 'lucide-react';
import { submitCommunityReport } from '../api';

export default function CitizenPortal({ user, alerts = [], onNavigateTab }) {
  const [quickSpecies, setQuickSpecies] = useState('Elephant');
  const [quickDesc, setQuickDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const userName = user?.name || 'Community Member';
  const village = user?.village || 'Belur Rural';

  const latestAlert = alerts && alerts.length > 0 ? alerts[0] : null;
  const isNearbyDanger = latestAlert && ['tiger', 'leopard', 'elephant', 'bear'].includes((latestAlert.species || '').toLowerCase());

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitCommunityReport({
        species: quickSpecies,
        latitude: 19.231,
        longitude: 72.825,
        description: quickDesc || `Quick sighting of ${quickSpecies} reported near ${village} perimeter`,
        severity: 'Dangerous'
      });
      setSubmitted(true);
      setQuickDesc('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (e) {
      alert('Failed to send report: ' + e.message);
    }
  };

  const emergencyContacts = [
    { title: 'Forest Department Control Room', number: '1800-425-4567', tag: '24x7 Toll Free' },
    { title: 'Elephant Squad Quick Response (QRT)', number: '+91 98451 22334', tag: 'Emergency Flying Squad' },
    { title: 'Belur Range Forest Office', number: '+91 81772 34567', tag: 'Local Range' },
    { title: 'Wildlife SOS Hassan Helpline', number: '+91 99001 88990', tag: 'Veterinary Support' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* ─── CITIZEN GREETING BANNER ─── */}
      <div className="glass-panel" style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        padding: '28px 32px'
      }}>
        <div className="category-tag">
          COMMUNITY SAFETY PORTAL
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1a202c' }}>
          Namaskara, {userName}
        </h2>
        <p style={{ color: '#4a5568', fontSize: '0.95rem', marginTop: '4px' }}>
          Live safety telemetry & movement alerts for <b>{village}</b> and surrounding farmland.
        </p>
      </div>

      {/* ─── HIGH VISIBILITY DANGER / SAFETY BANNER ─── */}
      <div className="glass-panel" style={{
        padding: '22px 26px',
        background: isNearbyDanger ? '#fff5f5' : '#edfdf5',
        border: `1px solid ${isNearbyDanger ? '#feb2b2' : '#c6f6d5'}`,
        borderLeft: `6px solid ${isNearbyDanger ? '#e53e3e' : '#48bb78'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            background: '#ffffff',
            border: `1px solid ${isNearbyDanger ? '#feb2b2' : '#c6f6d5'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isNearbyDanger ? '#e53e3e' : '#38a169',
            flexShrink: 0
          }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: isNearbyDanger ? '#c53030' : '#276749' }}>
              {isNearbyDanger ? 'CRITICAL WILDLIFE PROXIMITY ADVISORY' : 'NORMAL PERIMETER STATUS'}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a202c', marginTop: '2px' }}>
              {isNearbyDanger 
                ? `${latestAlert.species} Movement Sighted ~1.2 km from ${village}`
                : `No Immediate Predator Intrusion Detected in ${village}`
              }
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '2px' }}>
              {isNearbyDanger 
                ? 'Avoid solitary travel near forest canals and sugarcane plots after 18:00 hrs. Solar fences are active.'
                : 'Sensor camera traps are operational and monitoring buffer zones.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* ─── QUICK 1-TAP SIGHTING REPORTER ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#dd6b20" />
          <span>Quick 1-Tap Sighting Alert</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#718096', marginBottom: '16px' }}>
          Spotted wild animals near your field or village? Broadcast immediately to the Forest Patrol.
        </p>

        <form onSubmit={handleQuickSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {['Elephant', 'Leopard', 'Tiger', 'Wild Boar', 'Sloth Bear'].map((sp) => (
              <button
                type="button"
                key={sp}
                onClick={() => setQuickSpecies(sp)}
                className={`btn btn-sm ${quickSpecies === sp ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                {sp}
              </button>
            ))}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              placeholder={`Details (e.g. 2 ${quickSpecies}s near lake canal heading north)...`}
              value={quickDesc}
              onChange={(e) => setQuickDesc(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <Send size={16} />
            <span>Transmit Instant Alert to Range Officer</span>
          </button>
        </form>

        {submitted && (
          <div style={{
            marginTop: '14px',
            padding: '12px',
            background: '#edfdf5',
            border: '1px solid #9ae6b4',
            borderRadius: 'var(--radius-sm)',
            color: '#276749',
            fontWeight: '700',
            textAlign: 'center',
            fontSize: '0.88rem'
          }}>
            ✅ Instant Alert Transmitted! Range team dispatched.
          </div>
        )}
      </div>

      {/* ─── EMERGENCY SPEED DIAL DIRECTORY ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={18} color="#3182ce" />
          <span>Emergency Forest Department Helplines</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#276749', fontWeight: '800', textTransform: 'uppercase' }}>
                {contact.tag}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1a202c', margin: '4px 0' }}>
                {contact.title}
              </div>
              <a 
                href={`tel:${contact.number.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#3182ce',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              >
                <Phone size={13} />
                <span>{contact.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ─── COEXISTENCE SAFETY ADVISORY ─── */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a202c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={18} color="#38a169" />
          <span>Community Wildlife Encounter Protocol</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: '800', color: '#276749', marginBottom: '4px' }}>🐘 Elephant Encounter</div>
            <p style={{ color: '#4a5568', lineHeight: 1.4 }}>
              Maintain minimum 100m distance. Never throw stones or light firecrackers directly at herds. Keep lights low and alert neighbors via gong or whistle.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: '800', color: '#c05621', marginBottom: '4px' }}>🐆 Leopard Sighting</div>
            <p style={{ color: '#4a5568', lineHeight: 1.4 }}>
              Do not run. Make loud clapping noises and walk backwards slowly. Keep livestock inside sheds with wire mesh. Carry a flashlight when outdoors at night.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: '800', color: '#2b6cb0', marginBottom: '4px' }}>🐗 Crop Protection</div>
            <p style={{ color: '#4a5568', lineHeight: 1.4 }}>
              Maintain solar fencing voltage. Avoid sleeping in open field watchtowers during harvest without solar searchlights.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
