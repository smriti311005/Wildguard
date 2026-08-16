import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline, 
  Tooltip,
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Eye, 
  Navigation, 
  Trees, 
  Droplets,
  Activity
} from 'lucide-react';
import { recalculateRisk, getHabitatTelemetry } from '../api';

// Animal Icon / Emoji Mapper
const getSpeciesIcon = (species = '') => {
  const s = species.toLowerCase();
  if (s.includes('elephant')) return '🐘';
  if (s.includes('tiger')) return '🐅';
  if (s.includes('leopard')) return '🐆';
  if (s.includes('boar')) return '🐗';
  if (s.includes('bear')) return '🐻';
  if (s.includes('deer')) return '🦌';
  return '🐾';
};

// Custom Leaflet DivIcon Generator
const createCustomMarker = (species, status) => {
  const emoji = getSpeciesIcon(species);
  const isDanger = status === 'ACTIVE';
  const color = isDanger ? '#e53e3e' : (status === 'ACKNOWLEDGED' ? '#dd6b20' : '#38a169');
  const bg = isDanger ? '#fff5f5' : (status === 'ACKNOWLEDGED' ? '#fffaf0' : '#edfdf5');

  return L.divIcon({
    className: 'custom-map-div-icon',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${bg};
        border: 2px solid ${color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const createNodeMarker = (type, battery) => {
  return L.divIcon({
    className: 'custom-node-icon',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: #edfdf5;
        border: 1.5px solid #48bb78;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #276749;
        font-size: 0.8rem;
        font-weight: 800;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      ">
        📷
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Map Click Coordinate Inspector Listener
function MapClickInspector({ onInspectCoords }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onInspectCoords(lat, lng);
    }
  });
  return null;
}

export default function WildlifeMap({ 
  alerts = [], 
  corridorsData, 
  onUpdateAlertStatus 
}) {
  const [showDetections, setShowDetections] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);

  const [inspectedLocation, setInspectedLocation] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  // Default coordinate center (Belur / Hassan reserve corridor)
  const centerCoords = [19.231, 72.825];

  // Forward trajectory vector of latest sighting
  const latestAlert = alerts && alerts.length > 0 ? alerts[0] : null;
  const trajectoryLine = latestAlert
    ? [
        [latestAlert.latitude, latestAlert.longitude],
        [latestAlert.latitude + 0.007, latestAlert.longitude + 0.009] // 15-min vector projection
      ]
    : [];

  const handleInspectCoords = async (lat, lon) => {
    setInspectLoading(true);
    try {
      const [habitatRes, riskRes] = await Promise.all([
        getHabitatTelemetry(lat, lon),
        recalculateRisk({
          species: 'Elephant',
          confidence: 0.85,
          latitude: lat,
          longitude: lon,
          time_of_day: 'NIGHT',
          ndvi_canopy: 0.65,
          distance_water_m: 350
        })
      ]);
      setInspectedLocation({
        lat,
        lon,
        habitat: habitatRes,
        risk: riskRes
      });
    } catch (e) {
      console.error('Inspection failed:', e);
    } finally {
      setInspectLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Map Control Toolbar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#edfdf5',
            border: '1px solid #c6f6d5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38a169'
          }}>
            <Layers size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c' }}>
              Spatial GIS Layer Controls
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#718096' }}>
              Toggle migration vectors, safe zone buffers, and click anywhere to evaluate terrain risk
            </p>
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button 
            onClick={() => setShowDetections(!showDetections)}
            className={`btn btn-sm ${showDetections ? 'btn-primary' : 'btn-secondary'}`}
          >
            🐾 Sightings ({alerts.length})
          </button>
          <button 
            onClick={() => setShowCorridors(!showCorridors)}
            className={`btn btn-sm ${showCorridors ? 'btn-primary' : 'btn-secondary'}`}
          >
            🌿 Corridors
          </button>
          <button 
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`btn btn-sm ${showSafeZones ? 'btn-primary' : 'btn-secondary'}`}
          >
            🛡️ Safe Zones
          </button>
          <button 
            onClick={() => setShowNodes(!showNodes)}
            className={`btn btn-sm ${showNodes ? 'btn-primary' : 'btn-secondary'}`}
          >
            📷 Sensors
          </button>
          <button 
            onClick={() => setShowTrajectory(!showTrajectory)}
            className={`btn btn-sm ${showTrajectory ? 'btn-primary' : 'btn-secondary'}`}
          >
            🎯 15m Trajectory
          </button>
        </div>
      </div>

      {/* ─── LEAFLET INTERACTIVE MAP ─── */}
      <div className="glass-panel" style={{ padding: '6px', overflow: 'hidden', position: 'relative' }}>
        <MapContainer
          center={centerCoords}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '540px', width: '100%', borderRadius: '10px' }}
        >
          {/* CartoDB Voyager Light Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> Voyager & OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapClickInspector onInspectCoords={handleInspectCoords} />

          {/* 1. Sighting Detection Markers */}
          {showDetections && alerts.map((alert) => (
            <Marker
              key={alert.id}
              position={[alert.latitude, alert.longitude]}
              icon={createCustomMarker(alert.species, alert.status)}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '190px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1a202c' }}>
                      {getSpeciesIcon(alert.species)} {alert.species}
                    </span>
                    <span className={`badge badge-${alert.status.toLowerCase()}`}>
                      {alert.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#4a5568', marginBottom: '2px' }}>
                    Node: <b>{alert.node_id}</b>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '8px' }}>
                    Confidence: <b>{(alert.confidence * 100).toFixed(1)}%</b> | {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'ACKNOWLEDGED')}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 2. Corridor Polyline Paths */}
          {showCorridors && corridorsData?.corridors?.map((corridor, idx) => (
            <Polyline
              key={idx}
              positions={corridor.coordinates}
              pathOptions={{
                color: corridor.risk_rating === 'HIGH' ? '#e53e3e' : '#dd6b20',
                weight: 4,
                dashArray: '6, 8',
                opacity: 0.85
              }}
            >
              <Tooltip sticky>
                <b>{corridor.name}</b> ({corridor.species} Corridor)
              </Tooltip>
            </Polyline>
          ))}

          {/* 3. Safe Zones Circles */}
          {showSafeZones && corridorsData?.safe_zones?.map((zone, idx) => (
            <Circle
              key={idx}
              center={zone.center}
              radius={zone.radius_meters}
              pathOptions={{
                color: '#48bb78',
                fillColor: '#48bb78',
                fillOpacity: 0.15,
                weight: 2
              }}
            >
              <Tooltip sticky>
                🛡️ <b>{zone.name}</b> (Buffer Radius: {zone.radius_meters}m)
              </Tooltip>
            </Circle>
          ))}

          {/* 4. Monitoring Camera Nodes */}
          {showNodes && corridorsData?.nodes?.map((node) => (
            <Marker
              key={node.id}
              position={[node.lat, node.lon]}
              icon={createNodeMarker(node.type, node.battery)}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <div style={{ fontWeight: '800', color: '#1a202c', fontSize: '0.88rem' }}>
                    📷 {node.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#4a5568', marginTop: '4px' }}>
                    Status: <b style={{ color: '#276749' }}>{node.status}</b> | Battery: <b>{node.battery}%</b>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 5. Projected 15-min Trajectory Vector */}
          {showTrajectory && trajectoryLine.length === 2 && (
            <Polyline
              positions={trajectoryLine}
              pathOptions={{
                color: '#3182ce',
                weight: 5,
                dashArray: '4, 6',
                opacity: 0.9
              }}
            >
              <Tooltip permanent>
                🎯 15-Min Projected Animal Vector
              </Tooltip>
            </Polyline>
          )}
        </MapContainer>
      </div>

      {/* ─── COORD INSPECTION DRAWER ─── */}
      {inspectedLocation && (
        <div className="glass-panel" style={{
          padding: '20px 24px',
          border: '1px solid #c6f6d5',
          background: '#edfdf5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} color="#276749" />
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1a202c' }}>
                Spatial Risk Analysis at [{inspectedLocation.lat.toFixed(4)}, {inspectedLocation.lon.toFixed(4)}]
              </h4>
            </div>
            <button 
              onClick={() => setInspectedLocation(null)}
              className="btn btn-secondary btn-sm"
              style={{ background: '#ffffff' }}
            >
              Dismiss
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            fontSize: '0.85rem'
          }}>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase' }}>Computed Risk</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: inspectedLocation.risk?.score >= 60 ? '#e53e3e' : '#276749' }}>
                {inspectedLocation.risk?.score} / 100 ({inspectedLocation.risk?.risk_category})
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase' }}>NDVI Canopy</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1a202c' }}>
                {inspectedLocation.habitat?.ndvi}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase' }}>Water Distance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1a202c' }}>
                {inspectedLocation.habitat?.dist_water_m} meters
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#718096', fontSize: '0.72rem', textTransform: 'uppercase' }}>Terrain Slope</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1a202c' }}>
                {inspectedLocation.habitat?.slope_deg}°
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
