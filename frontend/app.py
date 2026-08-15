import sys
import os
import streamlit as st
import pandas as pd
import requests
import folium
from streamlit_folium import st_folium
from datetime import datetime

# Link internal modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from satellite_engine.habitat_service import HabitatService
from ml_engine.movement_predictor import WildlifePredictiveEngine

predictor = WildlifePredictiveEngine()
API_URL = "http://localhost:8000/api/alerts"

st.set_page_config(page_title="Human-Wildlife Coexistence System", layout="wide")
st.title("🐾 Human-Wildlife Coexistence: Edge, Satellite & ML Platform")

def fetch_data():
    try:
        response = requests.get(API_URL, timeout=3)
        if response.status_code == 200:
            data = response.json()
            if data:
                return pd.DataFrame(data)
    except Exception:
        pass
    return pd.DataFrame()

df = fetch_data()

if not df.empty:
    # Filter out any placeholder/test entries with non-numeric coordinates
    df = df[pd.to_numeric(df['latitude'], errors='coerce').notnull()]
    df = df[df['latitude'] != 0.0]

if not df.empty:
    df = df.sort_values(by="id", ascending=False)
    latest = df.iloc[0]

    # 1. Satellite & ML Feature Extraction for Latest Detection
    try:
        dt = datetime.fromisoformat(latest['timestamp'].replace('Z', ''))
        detection_hour = dt.hour
    except Exception:
        detection_hour = 12

    habitat = HabitatService.get_habitat_features(latest['latitude'], latest['longitude'])
    ml_reason = predictor.predict_reason(
        hour=detection_hour,
        ndvi=habitat['ndvi'],
        dist_water=habitat['dist_water_m'],
        slope=habitat['slope_deg'],
        species=latest['species']
    )

    history = df[['latitude', 'longitude']].values.tolist()
    spatial_intel = predictor.compute_corridors_and_trajectory(
        latest['latitude'], latest['longitude'], latest['species'], history
    )

    # --- Top KPI Metrics ---
    st.subheader("📡 Real-Time Ground & Satellite Telemetry")
    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Active Species", f"{latest['species']} ({latest['confidence']*100:.0f}%)")
    col2.metric("Vegetation (NDVI)", f"{habitat['ndvi']}")
    col3.metric("Nearest Water", f"{habitat['dist_water_m']} m")
    col4.metric("Terrain Slope", f"{habitat['slope_deg']}°")
    col5.metric("Movement Driver", ml_reason['predicted_reason'])

    # --- Geospatial Intelligence Map ---
    st.markdown("---")
    st.subheader("🗺️ Live Habitat Corridors & Future Movement Trajectory")

    map_center = [latest['latitude'], latest['longitude']]
    m = folium.Map(location=map_center, zoom_start=14, tiles="CartoDB positron")

    # A. Current Detection Marker
    folium.Marker(
        location=[latest['latitude'], latest['longitude']],
        popup=f"<b>Current: {latest['species']}</b><br>Reason: {ml_reason['predicted_reason']}",
        tooltip=f"Active Edge Detection: {latest['species']}",
        icon=folium.Icon(color="red", icon="warning-sign")
    ).add_to(m)

    # B. Future Predicted Location Marker
    next_loc = spatial_intel['predicted_next_location']
    folium.Marker(
        location=next_loc,
        popup=f"<b>Predicted Location (+20 min)</b><br>Target Trajectory",
        tooltip="Predicted Next Node",
        icon=folium.Icon(color="blue", icon="arrow-up")
    ).add_to(m)

    # C. Movement Vector Line (Connecting Current -> Predicted)
    folium.PolyLine(
        locations=[[latest['latitude'], latest['longitude']], next_loc],
        color="purple",
        weight=4,
        dash_array='8, 8',
        tooltip="Projected Movement Vector"
    ).add_to(m)

    # D. Historical Corridors
    for corr in spatial_intel['corridors']:
        folium.Circle(
            location=[corr['lat'], corr['lon']],
            radius=180,
            color="orange",
            fill=True,
            fill_opacity=0.35,
            tooltip=f"Identified Wildlife Corridor ({corr['count']} crossings)"
        ).add_to(m)

    st_folium(m, width=1200, height=480)

    # --- Live Feed Log ---
    st.markdown("---")
    st.subheader("📋 Ingestion Logs")
    st.dataframe(df[['id', 'timestamp', 'node_id', 'species', 'confidence', 'latitude', 'longitude']].head(10), use_container_width=True)

else:
    st.info("No live detections recorded yet. Start `run_inference.py` to transmit detection telemetry.")

if st.button("🔄 Refresh Telemetry"):
    st.rerun()