import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Trees, 
  Droplets, 
  Mountain, 
  Send,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { detectWildlife, getPresets, createAlert } from '../api';

export default function DetectionConsole({ onAlertCreated, onNavigateTab }) {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('elephant-herd');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [selectedNode, setSelectedNode] = useState('Village-Perimeter-001');
  const [nodeCoords, setNodeCoords] = useState({ lat: 19.231, lon: 72.825 });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Load presets on mount
  useEffect(() => {
    async function loadDemoPresets() {
      try {
        const data = await getPresets();
        setPresets(data);
        if (data.length > 0) {
          setSelectedPresetId(data[0].id);
          setPreviewUrl(data[0].thumbnail);
        }
      } catch (e) {
        console.error('Error loading presets:', e);
      }
    }
    loadDemoPresets();
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setSelectedFile(null);
    setPreviewUrl(preset.thumbnail);
    setSelectedNode(preset.node_id);
    setNodeCoords({ lat: preset.latitude, lon: preset.longitude });
    setResult(null);
    setDispatchedSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedPresetId(null);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setDispatchedSuccess(false);
    }
  };

  const handleRunInference = async () => {
    setLoading(true);
    setResult(null);
    setDispatchedSuccess(false);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedPresetId) {
        formData.append('preset', selectedPresetId);
      }
      formData.append('node_id', selectedNode);
      formData.append('latitude', nodeCoords.lat);
      formData.append('longitude', nodeCoords.lon);
      formData.append('conf_threshold', confThreshold);
      formData.append('auto_save', false);

      const data = await detectWildlife(formData);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error running inference: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchAlert = async () => {
    if (!result || !result.top_detection) return;
    try {
      await createAlert({
        species: result.top_detection.species,
        confidence: result.top_detection.confidence,
        node_id: selectedNode,
        latitude: nodeCoords.lat,
        longitude: nodeCoords.lon,
        status: 'ACTIVE'
      });
      setDispatchedSuccess(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      if (onAlertCreated) onAlertCreated();
    } catch (e) {
      alert('Dispatch failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
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
            <Camera size={22} />
          </div>
          <div>
            <div className="category-tag" style={{ marginBottom: '2px' }}>AI TAGGING PIPELINE</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#1a202c' }}>
              Edge Camera Trap Neural Classifier
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#718096' }}>
              Evaluate camera trap photos with fine-tuned YOLOv8 weights and Sentinel-2 GIS habitat correlation
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Preset Selector & Upload */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '14px' }}>
            1. Select Wildlife Sample Preset
          </h3>

          {/* Presets Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {presets.map((p) => {
              const isSelected = selectedPresetId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isSelected ? '#48bb78' : '#e2e8f0'}`,
                    background: isSelected ? '#edfdf5' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ height: '75px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9' }}>
                    <img src={p.thumbnail} alt={p.species} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.84rem', color: '#1a202c' }}>{p.species}</span>
                    {isSelected && <CheckCircle2 size={15} color="#38a169" />}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#718096' }}>{p.node_id}</span>
                </div>
              );
            })}
          </div>

          {/* Custom Upload Dropzone */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
            2. Or Upload Custom Camera Trap Snapshot
          </h3>
          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '24px',
              border: `2px dashed ${selectedFile ? '#48bb78' : '#cbd5e0'}`,
              borderRadius: 'var(--radius-md)',
              background: selectedFile ? '#edfdf5' : '#f8fafc',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s ease'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <Upload size={28} color={selectedFile ? "#38a169" : "#718096"} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: '750', fontSize: '0.88rem', color: '#1a202c' }}>
              {selectedFile ? selectedFile.name : 'Click to Upload Image / Drag & Drop'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '4px' }}>
              Supports JPG, PNG, WEBP camera trap captures
            </div>
          </div>

          {/* Model Configuration Sliders */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="form-label" style={{ marginBottom: 0 }}>Confidence Threshold</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#276749', fontSize: '0.82rem' }}>
                {(confThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0.10" 
              max="0.90" 
              step="0.05" 
              value={confThreshold} 
              onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#48bb78' }}
            />
          </div>

          <button 
            onClick={handleRunInference}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Processing YOLOv8 Inference...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Run Edge AI Inference</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output & Movement Prediction */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
            Inference & GIS Telemetry Results
          </h3>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Annotated YOLO Image */}
              {result.annotated_image && (
                <div style={{
                  width: '100%',
                  height: '240px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-medium)',
                  position: 'relative'
                }}>
                  <img 
                    src={result.annotated_image} 
                    alt="Annotated Inference" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid #48bb78',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    color: '#276749',
                    fontWeight: '800'
                  }}>
                    YOLOv8 DETECTED ({result.count} target{result.count > 1 ? 's' : ''})
                  </div>
                </div>
              )}

              {/* Detected Top Species Banner */}
              {result.top_detection && (
                <div style={{
                  background: '#edfdf5',
                  border: '1px solid #9ae6b4',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#276749', textTransform: 'uppercase' }}>
                      PRIMARY IDENTIFICATION
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1a202c' }}>
                      {result.top_detection.species}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#276749', textTransform: 'uppercase' }}>
                      CONFIDENCE
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#38a169' }}>
                      {(result.top_detection.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {/* ML Movement Intent & Habitat */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                fontSize: '0.82rem'
              }}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Predicted Intent
                  </div>
                  <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>
                    {result.movement?.predicted_reason || 'Water Source Seeking'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Conflict Risk Level
                  </div>
                  <div style={{ color: result.risk?.score >= 60 ? '#e53e3e' : '#276749', fontWeight: '800', marginTop: '2px' }}>
                    {result.risk?.score} / 100 ({result.risk?.risk_category})
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    NDVI Canopy Index
                  </div>
                  <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>
                    {result.habitat?.ndvi || 0.68} (Dense)
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Waterhole Distance
                  </div>
                  <div style={{ color: '#1a202c', fontWeight: '800', marginTop: '2px' }}>
                    {result.habitat?.dist_water_m || 420} meters
                  </div>
                </div>
              </div>

              {/* Dispatch Action */}
              {dispatchedSuccess ? (
                <div style={{
                  padding: '12px',
                  background: '#edfdf5',
                  border: '1px solid #9ae6b4',
                  borderRadius: 'var(--radius-md)',
                  color: '#276749',
                  fontWeight: '700',
                  textAlign: 'center',
                  fontSize: '0.88rem'
                }}>
                  ✅ Incident Alert Dispatched to Database & Active Feed!
                </div>
              ) : (
                <button
                  onClick={handleDispatchAlert}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <Send size={16} />
                  <span>Dispatch Incident Alert to Network</span>
                </button>
              )}

            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '320px',
              color: '#a0aec0',
              textAlign: 'center'
            }}>
              <Activity size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', maxWidth: '280px', color: '#718096' }}>
                Select a preset or upload an image and click <b>Run Edge AI Inference</b> to process.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
