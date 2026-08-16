import sys
import os
import base64
import math

import streamlit as st
import pandas as pd
import requests
import folium
import numpy as np

from folium.plugins import HeatMap, MarkerCluster, MiniMap
from streamlit_folium import st_folium
from datetime import datetime, timezone
from PIL import Image
from ultralytics import YOLO

from auth import render_user_header, get_current_role, get_current_user, get_auth_headers



# ==========================================
# LINK INTERNAL MODULES
# ==========================================

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)
sys.path.append(
    os.path.abspath(
        os.path.dirname(__file__)
    )
)

from satellite_engine.habitat_service import HabitatService
from ml_engine.movement_predictor import WildlifePredictiveEngine


# ==========================================
# INITIAL SETUP
# ==========================================

predictor = WildlifePredictiveEngine()

API_URL = "http://localhost:8000/api/alerts"

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "SIH_Wildlife",
        "edge_prototype",
        "weights",
        "best.pt"
    )
)

# Demo metadata used when an image is analyzed from the web console.
# These values can later be replaced by a selected camera node or GPS device.
UPLOAD_NODE_ID = "Upload-Console-001"
UPLOAD_LATITUDE = 19.231
UPLOAD_LONGITUDE = 72.825

MONITORING_NODES = {
    "Village A Perimeter": {
        "node_id": UPLOAD_NODE_ID,
        "latitude": UPLOAD_LATITUDE,
        "longitude": UPLOAD_LONGITUDE
    },
    "Forest Corridor North": {
        "node_id": "Forest-Node-002",
        "latitude": 19.238,
        "longitude": 72.832
    },
    "Agricultural Zone East": {
        "node_id": "Farm-Node-003",
        "latitude": 19.224,
        "longitude": 72.841
    }
}


# ==========================================
# PAGE CONFIGURATION
# ==========================================

st.set_page_config(
    page_title="WildCare | Wildlife Coexistence",
    page_icon=":shield:",
    layout="wide",
    initial_sidebar_state="collapsed"
)


HERO_IMAGE_PATH = os.path.join(
    os.path.dirname(__file__),
    "assets",
    "wildcare-hero.png"
)

if os.path.exists(HERO_IMAGE_PATH):
    with open(HERO_IMAGE_PATH, "rb") as hero_file:
        hero_image_data = base64.b64encode(hero_file.read()).decode("utf-8")
    hero_background = (
        "linear-gradient(90deg, rgba(5, 18, 13, 0.96) 0%, "
        "rgba(5, 18, 13, 0.78) 42%, rgba(5, 18, 13, 0.12) 100%), "
        f"url('data:image/png;base64,{hero_image_data}')"
    )
else:
    hero_background = "linear-gradient(135deg, #dcefe0, #b8d8bf)"


# ==========================================
# WILDCARE UI THEME
# ==========================================

st.markdown("""
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.block-container {
    padding-top: 1.2rem;
    padding-bottom: 3.5rem;
    max-width: 1400px;
}

/* Light Calm Cream / Sage Ecological Canvas */
[data-testid="stAppViewContainer"] {
    background:
        radial-gradient(circle at 92% 8%, rgba(193, 222, 203, 0.42), transparent 38%),
        radial-gradient(circle at 8% 28%, rgba(234, 243, 232, 0.65), transparent 45%),
        radial-gradient(circle at 85% 65%, rgba(215, 234, 220, 0.35), transparent 42%),
        linear-gradient(180deg, #f7f9f5 0%, #edf3ec 48%, #f5f8f3 100%) !important;
    color: #11281c;
}

[data-testid="stHeader"] {
    background: transparent !important;
}

/* General Typography on Light Page */
h1, h2, h3, h4, h5, h6 {
    color: #0c2617;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.section-heading {
    font-size: 1.26rem;
    font-weight: 850;
    color: #0c2617;
    margin-top: 32px;
    margin-bottom: 14px;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ================= HERO BRAND & BANNER ================= */

.hero-container {
    min-height: 410px;
    border-radius: 26px;
    padding: 34px 38px;
    border: 1.5px solid rgba(178, 237, 193, 0.30);
    box-shadow: 0 24px 60px rgba(10, 32, 20, 0.28);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(7, 24, 15, 0.88);
    border: 1.5px solid rgba(74, 222, 128, 0.40);
    border-radius: 16px;
    padding: 10px 18px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(14px);
    transition: transform 0.2s ease;
}

.brand-badge:hover {
    transform: scale(1.02);
    border-color: rgba(74, 222, 128, 0.65);
}

.brand-icon-box {
    font-size: 1.5rem;
    background: rgba(16, 74, 42, 0.85);
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(149, 238, 181, 0.35);
    box-shadow: 0 0 14px rgba(74, 222, 128, 0.3);
}

.brand-text-col {
    display: flex;
    flex-direction: column;
}

.brand-title {
    font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
    font-size: 1.45rem;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #ffffff !important;
    line-height: 1.05;
}

.brand-title-accent {
    color: #4ade80 !important;
    font-weight: 950;
    text-shadow: 0 0 16px rgba(74, 222, 128, 0.45);
}

.brand-subtitle {
    font-size: 0.58rem;
    font-weight: 850;
    color: #a7f3d0 !important;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-top: 2px;
}

.hero-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: rgba(8, 32, 19, 0.88);
    border: 1.5px solid rgba(74, 222, 128, 0.45);
    border-radius: 999px;
    padding: 9px 18px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), inset 0 0 12px rgba(74, 222, 128, 0.15);
    backdrop-filter: blur(12px);
}

.status-pulse-dot {
    width: 10px;
    height: 10px;
    background-color: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 10px #4ade80, 0 0 18px #4ade80;
    animation: pulse-dot 1.8s infinite ease-in-out;
}

@keyframes pulse-dot {
    0% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 14px #4ade80, 0 0 24px #4ade80; }
    100% { transform: scale(0.9); opacity: 0.7; }
}

.hero-status-text {
    color: #d1fae5 !important;
    font-size: 0.78rem;
    font-weight: 850;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}

.hero-eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(16, 74, 42, 0.75);
    border: 1px solid rgba(149, 238, 181, 0.35);
    border-radius: 999px;
    padding: 6px 14px;
    color: #b7f7ce !important;
    font-size: 0.72rem;
    font-weight: 850;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    margin-bottom: 12px;
}

.hero-title {
    color: #ffffff !important;
    font-size: clamp(2.2rem, 4.2vw, 4.2rem);
    font-weight: 900;
    line-height: 1.04;
    letter-spacing: -0.05em;
    margin: 10px 0 14px;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.45);
}

.hero-copy {
    color: #d8ede0 !important;
    font-size: 1.05rem;
    line-height: 1.62;
    max-width: 630px;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);
}

.hero-feature-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background: rgba(4, 16, 10, 0.72);
    border: 1.5px solid rgba(218, 242, 224, 0.20);
    border-radius: 16px;
    padding: 10px 14px;
    backdrop-filter: blur(14px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.hero-feat-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
}

.hero-feat-chip:hover {
    background: rgba(74, 222, 128, 0.15);
    border-color: rgba(74, 222, 128, 0.35);
}

.feat-icon {
    font-size: 1rem;
}

.feat-text {
    color: #e2f5e9 !important;
    font-size: 0.82rem;
    font-weight: 750;
    letter-spacing: 0.2px;
}

/* ================= NAVIGATION ================= */

.nav-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0 24px 0;
}

.nav-pill {
    background: #0d2117;
    color: #e4f5ea !important;
    border: 1px solid #1f4330;
    padding: 9px 18px;
    border-radius: 999px;
    text-decoration: none !important;
    font-size: 0.82rem;
    font-weight: 750;
    letter-spacing: 0.2px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(13, 33, 23, 0.12);
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.nav-pill:hover {
    background: #16422b;
    color: #ffffff !important;
    border-color: #2b6c48;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(13, 33, 23, 0.18);
}

.nav-pill.active {
    background: #145932;
    border-color: #278850;
    color: #ffffff !important;
}

/* ================= SYSTEM STATUS ================= */

.status-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin: 6px 0 26px 0;
}

.system-stat-card {
    background: #0d1e15;
    border: 1px solid #1d3d2a;
    border-radius: 14px;
    padding: 14px 18px;
    box-shadow: 0 4px 16px rgba(13, 30, 21, 0.12);
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.system-stat-card:hover {
    transform: translateY(-2px);
    border-color: #2b5c40;
}

.system-stat-label {
    color: #8da496 !important;
    font-size: 0.72rem;
    text-transform: uppercase;
    font-weight: 750;
    letter-spacing: 0.8px;
}

.system-stat-value {
    color: #f8fafc !important;
    font-size: 1.02rem;
    font-weight: 800;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ================= TELEMETRY CARDS ================= */

.telemetry-card {
    background: linear-gradient(145deg, #0e2017, #07140e);
    border: 1px solid #1d402e;
    border-radius: 16px;
    padding: 20px;
    min-height: 125px;
    box-shadow: 0 6px 20px rgba(7, 20, 14, 0.14);
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.telemetry-card:hover {
    transform: translateY(-2px);
    border-color: #2d6248;
}

.telemetry-icon {
    font-size: 1.4rem;
    margin-bottom: 6px;
}

.telemetry-label {
    color: #8fa799 !important;
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
}

.telemetry-value {
    color: #ffffff !important;
    font-size: 1.55rem;
    font-weight: 850;
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.telemetry-sub {
    color: #637e6f !important;
    font-size: 0.76rem;
    margin-top: 4px;
}

/* ================= RISK & FACTOR CARDS ================= */

.risk-card {
    background: linear-gradient(145deg, #2b1114, #18090b);
    border: 1px solid #751a22;
    border-radius: 18px;
    padding: 24px;
    min-height: 205px;
    box-shadow: 0 8px 26px rgba(43, 17, 20, 0.20);
}

.risk-kicker {
    color: #fca5a5 !important;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.1px;
}

.risk-value {
    color: #f87171 !important;
    font-size: 2.5rem;
    font-weight: 900;
    margin-top: 5px;
}

.risk-species {
    color: #ffffff !important;
    font-size: 1.1rem;
    font-weight: 800;
    margin-top: 6px;
}

.risk-confidence {
    color: #cbd5e1 !important;
    font-size: 0.85rem;
    margin-top: 5px;
}

.risk-note {
    color: #94a3b8 !important;
    font-size: 0.76rem;
    margin-top: 12px;
    line-height: 1.5;
}

.factor-card {
    background: #0d1e15;
    border: 1px solid #1f402e;
    border-radius: 14px;
    padding: 18px;
    min-height: 100px;
    box-shadow: 0 4px 14px rgba(13, 30, 21, 0.10);
}

.factor-label {
    color: #8da496 !important;
    font-size: 0.74rem;
    text-transform: uppercase;
    font-weight: 750;
    letter-spacing: 0.6px;
}

.factor-value-high {
    color: #f87171 !important;
    font-size: 1.1rem;
    font-weight: 850;
    margin-top: 9px;
}

.factor-value-medium {
    color: #facc15 !important;
    font-size: 1.1rem;
    font-weight: 850;
    margin-top: 9px;
}

.factor-value-low {
    color: #4ade80 !important;
    font-size: 1.1rem;
    font-weight: 850;
    margin-top: 9px;
}

.score-box {
    margin-top: 14px;
    background: #08140e;
    border: 1px solid #1f402e;
    border-radius: 12px;
    padding: 12px 14px;
}

.score-label {
    color: #8da496 !important;
    font-size: 0.74rem;
}

.score-value {
    color: #ffffff !important;
    font-size: 1.25rem;
    font-weight: 850;
    margin-top: 3px;
}

/* ================= ACTION CARDS ================= */

.action-card {
    background: #0d1e15;
    border: 1px solid #1f402e;
    border-radius: 16px;
    padding: 22px;
    min-height: 205px;
    box-shadow: 0 6px 18px rgba(13, 30, 21, 0.12);
}

.action-title {
    color: #f4fbf6 !important;
    font-size: 1.08rem;
    font-weight: 800;
    margin-bottom: 12px;
}

.action-list {
    color: #cbdad1 !important;
    line-height: 1.9;
    padding-left: 22px;
    margin-bottom: 0;
}

.action-priority {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    background: #2b1114;
    color: #f87171 !important;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    border: 1px solid rgba(239, 68, 68, 0.28);
}

/* ================= TACTILE STAT BUTTON SQUARES ================= */

.stat-button-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin: 14px 0 32px 0;
}

@media (max-width: 992px) {
    .stat-button-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.stat-button-square {
    position: relative;
    border-radius: 20px;
    padding: 22px 20px;
    min-height: 195px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.10);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    overflow: hidden;
}

.stat-button-square:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.20);
}

.stat-square-total {
    background: linear-gradient(165deg, #13241b 0%, #0a1610 55%, #050c08 100%);
    border: 1.5px solid #234f36;
    border-bottom: 4px solid #143322;
}
.stat-square-total:hover {
    border-color: #377d56;
}

.stat-square-high {
    background: linear-gradient(165deg, #2b1114 0%, #1a080a 55%, #0e0304 100%);
    border: 1.5px solid #7a1d25;
    border-bottom: 4px solid #4a1015;
}
.stat-square-high:hover {
    border-color: #aa2834;
}

.stat-square-med {
    background: linear-gradient(165deg, #281e0b 0%, #181105 55%, #0e0a02 100%);
    border: 1.5px solid #755718;
    border-bottom: 4px solid #48350d;
}
.stat-square-med:hover {
    border-color: #a37b25;
}

.stat-square-low {
    background: linear-gradient(165deg, #0f2419 0%, #07170f 55%, #030d08 100%);
    border: 1.5px solid #1e5937;
    border-bottom: 4px solid #113822;
}
.stat-square-low:hover {
    border-color: #2e8855;
}

.stat-btn-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-pill {
    font-size: 0.70rem;
    font-weight: 850;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    backdrop-filter: blur(8px);
}

.stat-pill-emerald {
    background: rgba(52, 211, 153, 0.16);
    color: #34d399 !important;
    border: 1px solid rgba(52, 211, 153, 0.35);
}

.stat-pill-red {
    background: rgba(239, 68, 68, 0.20);
    color: #f87171 !important;
    border: 1px solid rgba(239, 68, 68, 0.40);
}

.stat-pill-amber {
    background: rgba(245, 158, 11, 0.20);
    color: #fbbf24 !important;
    border: 1px solid rgba(245, 158, 11, 0.40);
}

.stat-pill-green {
    background: rgba(74, 222, 128, 0.18);
    color: #4ade80 !important;
    border: 1px solid rgba(74, 222, 128, 0.35);
}

.stat-led-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}
.led-emerald {
    background: #34d399;
    box-shadow: 0 0 8px #34d399;
}
.led-red {
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
}
.led-amber {
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
}
.led-green {
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
}

.stat-btn-body {
    margin: 12px 0 10px 0;
}

.stat-number {
    font-size: 3.1rem;
    font-weight: 950;
    line-height: 1;
    letter-spacing: -0.04em;
}
.stat-num-white { color: #ffffff !important; }
.stat-num-red { color: #fca5a5 !important; }
.stat-num-amber { color: #fef08a !important; }
.stat-num-green { color: #bbf7d0 !important; }

.stat-title {
    color: #e5ede7 !important;
    font-size: 0.94rem;
    font-weight: 800;
    margin-top: 6px;
}

.stat-desc {
    color: #7d9687 !important;
    font-size: 0.74rem;
    margin-top: 3px;
}

.stat-btn-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-foot-tag { color: #34d399 !important; font-size: 0.72rem; font-weight: 750; }
.stat-foot-tag-red { color: #f87171 !important; font-size: 0.72rem; font-weight: 750; }
.stat-foot-tag-amber { color: #fbbf24 !important; font-size: 0.72rem; font-weight: 750; }
.stat-foot-tag-green { color: #4ade80 !important; font-size: 0.72rem; font-weight: 750; }

.stat-arrow { color: #5a7b68 !important; font-size: 0.82rem; font-weight: 900; }
.stat-arrow-red { color: #9c454c !important; font-size: 0.82rem; font-weight: 900; }
.stat-arrow-amber { color: #9a7a37 !important; font-size: 0.82rem; font-weight: 900; }
.stat-arrow-green { color: #43845c !important; font-size: 0.82rem; font-weight: 900; }

/* ================= STREAMLIT WIDGET OVERRIDES ================= */

/* Widget labels on light background */
[data-testid="stWidgetLabel"] p, [data-testid="stWidgetLabel"] label {
    color: #0d2617 !important;
    font-weight: 750 !important;
    font-size: 0.88rem !important;
}

/* File uploader container */
[data-testid="stFileUploadDropzone"] {
    background: #0c1c14 !important;
    border: 1.5px dashed #244f38 !important;
    border-radius: 14px !important;
    padding: 18px !important;
}

[data-testid="stFileUploadDropzone"] * {
    color: #cbdad1 !important;
}

[data-testid="stFileUploadDropzone"] button {
    background: #173d29 !important;
    color: #f0fdf4 !important;
    border: 1px solid #2d6b49 !important;
    border-radius: 8px !important;
    font-weight: 750 !important;
}

/* Camera input */
[data-testid="stCameraInput"] {
    background: #0c1c14 !important;
    border: 1px solid #1f4330 !important;
    border-radius: 14px !important;
    padding: 12px !important;
}

[data-testid="stCameraInput"] button {
    background: #16402a !important;
    color: #ffffff !important;
    border: 1px solid #296846 !important;
}

/* Selectboxes */
div[data-baseweb="select"] > div {
    background-color: #ffffff !important;
    border: 1.5px solid #bdd2c5 !important;
    border-radius: 10px !important;
    color: #0d2617 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

div[data-baseweb="select"] * {
    color: #0d2617 !important;
    font-weight: 650 !important;
}

/* Primary Button */
button[kind="primary"], .stButton > button[type="primary"] {
    background: linear-gradient(135deg, #157945 0%, #0d5a32 100%) !important;
    border: 1px solid #279e5d !important;
    color: #ffffff !important;
    font-weight: 800 !important;
    border-radius: 12px !important;
    padding: 12px 22px !important;
    box-shadow: 0 4px 14px rgba(21, 121, 69, 0.28) !important;
    transition: all 0.2s ease !important;
    letter-spacing: 0.3px !important;
}

button[kind="primary"]:hover, .stButton > button[type="primary"]:hover {
    background: linear-gradient(135deg, #1b9254 0%, #106f3e 100%) !important;
    box-shadow: 0 6px 20px rgba(21, 121, 69, 0.38) !important;
    transform: translateY(-1px) !important;
}

/* Standard Button & Download Button */
.stButton > button, .stDownloadButton > button {
    background: #ffffff !important;
    border: 1.5px solid #b8cebf !important;
    color: #123020 !important;
    font-weight: 750 !important;
    border-radius: 12px !important;
    padding: 10px 20px !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    transition: all 0.2s ease !important;
}

.stButton > button:hover, .stDownloadButton > button:hover {
    background: #eef6f0 !important;
    border-color: #1a5e37 !important;
    color: #0c2b1a !important;
    transform: translateY(-1px) !important;
}

/* Dataframe Styling */
[data-testid="stDataFrame"] {
    background: #ffffff;
    border: 1px solid #c9ded0;
    border-radius: 14px;
    padding: 6px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

</style>
""", unsafe_allow_html=True)


# ==========================================
# FIELD COMMAND CENTRE HEADER
# ==========================================

render_user_header()

st.html(
    f"""
    <section id="dashboard" class="hero-container" style="
        background-image: {hero_background};
        background-size: cover;
        background-position: center;
    ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;z-index:2;">
            <div class="brand-badge">
                <div class="brand-icon-box"><i class="fa-solid fa-shield-cat"></i></div>
                <div class="brand-text-col">
                    <div class="brand-title">Wild<span class="brand-title-accent">Care</span></div>
                    <div class="brand-subtitle">INTELLIGENT COEXISTENCE AI</div>
                </div>
            </div>
            <div class="hero-status-pill">
                <div class="status-pulse-dot"></div>
                <span class="hero-status-text">SENSOR NETWORK ONLINE</span>
            </div>
        </div>

        <div style="padding:30px 0 26px;z-index:2;">
            <div class="hero-eyebrow-pill">
                <span><i class="fa-solid fa-bolt-lightning"></i></span> <span>NEXT-GEN HUMAN–WILDLIFE CONFLICT PREVENTION PLATFORM</span>
            </div>
            <h1 class="hero-title">See movement early.<br>Protect people and wildlife.</h1>
            <p class="hero-copy">
                A unified early-warning system for every species, forest corridor,
                and community living alongside wildlife.
            </p>
        </div>

        <div class="hero-feature-bar" style="z-index:2;">
            <div class="hero-feat-chip">
                <span class="feat-icon"><i class="fa-solid fa-camera"></i></span>
                <span class="feat-text">Edge AI Detection</span>
            </div>
            <div class="hero-feat-chip">
                <span class="feat-icon"><i class="fa-solid fa-map-location-dot"></i></span>
                <span class="feat-text">Risk-Aware Movement Map</span>
            </div>
            <div class="hero-feat-chip">
                <span class="feat-icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
                <span class="feat-text">Response-Ready Alerts</span>
            </div>
            <div class="hero-feat-chip">
                <span class="feat-icon"><i class="fa-solid fa-satellite-dish"></i></span>
                <span class="feat-text">Satellite Habitat Telemetry</span>
            </div>
        </div>
    </section>
    """
)

st.html(
    """
    <nav class="nav-bar">
        <a href="#dashboard" class="nav-pill active"><i class="fa-solid fa-house-chimney"></i> Command Centre</a>
        <a href="#detection-console" class="nav-pill"><i class="fa-solid fa-camera"></i> Detection Console</a>
        <a href="#alerts" class="nav-pill"><i class="fa-solid fa-bell"></i> Active Alerts</a>
        <a href="#map-section" class="nav-pill"><i class="fa-solid fa-map"></i> Movement Map</a>
        <a href="#analytics" class="nav-pill"><i class="fa-solid fa-chart-simple"></i> Analytics & Logs</a>
    </nav>
    """
)


# ==========================================
# FETCH DATA
# ==========================================

def fetch_data():

    try:
        response = requests.get(
            API_URL,
            timeout=3
        )

        if response.status_code == 200:

            data = response.json()

            if data:
                return pd.DataFrame(data)

    except Exception:
        pass

    return pd.DataFrame()


# ==========================================
# EDGE AI INFERENCE
# ==========================================

@st.cache_resource(show_spinner=False)
def load_wildlife_model():
    """Load the fine-tuned YOLO model once per Streamlit session."""
    return YOLO(MODEL_PATH)


def analyze_wildlife_image(image_file):
    """Run YOLO on an uploaded image and return the annotated result."""
    image_file.seek(0)
    image_array = np.array(
        Image.open(image_file).convert("RGB")
    )

    model = load_wildlife_model()
    result = model(
        image_array,
        conf=0.25,
        verbose=False
    )[0]

    detections = []

    for box in result.boxes:
        class_id = int(box.cls[0])
        detections.append({
            "species": str(result.names[class_id]),
            "confidence": float(box.conf[0])
        })

    annotated_image = result.plot()[:, :, ::-1]

    return {
        "annotated_image": annotated_image,
        "detections": detections
    }


def create_detection_alert(detection, monitoring_node):
    """Save the strongest web-console detection through the existing API."""
    payload = {
        "node_id": monitoring_node["node_id"],
        "species": detection["species"],
        "confidence": round(detection["confidence"], 4),
        "latitude": monitoring_node["latitude"],
        "longitude": monitoring_node["longitude"],
        "timestamp": datetime.now(timezone.utc).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
    }

    response = requests.post(
        API_URL,
        json=payload,
        timeout=5
    )
    response.raise_for_status()

    return response.json()


def update_alert_status(alert_id, status):
    """Persist a response action for an incident through FastAPI."""
    response = requests.patch(
        f"{API_URL}/{alert_id}/status",
        json={"status": status},
        timeout=5
    )
    response.raise_for_status()

    return response.json()


# ==========================================
# PROTOTYPE RISK ENGINE
# ==========================================

def calculate_prototype_risk(
    species,
    confidence,
    ndvi,
    dist_water,
    slope,
    lat=19.231,
    lon=72.825
):
    species_clean = str(species).lower().strip()
    confidence = float(confidence)

    # 1. Species Hazard (30% weight)
    high_risk = {"tiger", "leopard", "elephant", "bear", "lion", "wild boar"}
    med_risk = {"hyena", "wolf", "jackal"}
    if species_clean in high_risk:
        species_score = 30.0
        species_level = "HIGH"
    elif species_clean in med_risk:
        species_score = 20.0
        species_level = "MEDIUM"
    else:
        species_score = 10.0
        species_level = "LOW"

    # 2. Forest Proximity / Vegetation via NDVI (20% weight)
    ndvi_score = min(20.0, max(5.0, ndvi * 25.0))

    # 3. Detection Confidence (20% weight)
    conf_score = confidence * 20.0
    if confidence >= 0.80:
        confidence_level = "HIGH"
    elif confidence >= 0.60:
        confidence_level = "MEDIUM"
    else:
        confidence_level = "LOW"

    # 4. Corridor Proximity (15% weight)
    corridor_dist_km = math.sqrt((lat - 19.238)**2 + (lon - 72.832)**2) * 111.0
    corridor_score = max(3.0, 15.0 - (corridor_dist_km * 3.0))

    # 5. Water/Topography Exposure (10% weight)
    water_score = 10.0 if dist_water <= 500 else 4.0
    environment_level = "HIGH" if dist_water <= 500 or ndvi >= 0.55 else "MEDIUM"

    # 6. Seasonal Harvest Factor (5% weight)
    seasonal_score = 4.5

    # Total score 0-100
    score_100 = round(species_score + ndvi_score + conf_score + corridor_score + water_score + seasonal_score)
    score_100 = min(100, max(0, score_100))

    if score_100 >= 76:
        risk = "HIGH"
    elif score_100 >= 50:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    # Explainability factor breakdown
    explainability = [
        {"factor": "Species Hazard Score", "weight": "30%", "points": f"{species_score:.1f}/30", "status": species_level},
        {"factor": "Forest Canopy (NDVI)", "weight": "20%", "points": f"{ndvi_score:.1f}/20", "status": "HIGH" if ndvi >= 0.55 else "MEDIUM"},
        {"factor": "AI Detection Confidence", "weight": "20%", "points": f"{conf_score:.1f}/20", "status": confidence_level},
        {"factor": "Known Corridor Proximity", "weight": "15%", "points": f"{corridor_score:.1f}/15", "status": "HIGH" if corridor_dist_km < 2.0 else "MEDIUM"},
        {"factor": "Waterhole / Topography", "weight": "10%", "points": f"{water_score:.1f}/10", "status": "HIGH" if dist_water <= 500 else "LOW"},
        {"factor": "Seasonal Crop Weight", "weight": "5%", "points": f"{seasonal_score:.1f}/5", "status": "ACTIVE"}
    ]

    return {
        "risk": risk,
        "species_level": species_level,
        "confidence_level": confidence_level,
        "environment_level": environment_level,
        "score": round(score_100 / 12.5),   # Backwards compatibility 1-8 score
        "score_100": score_100,
        "explainability": explainability
    }



# ==========================================
# GIS WILDLIFE DATASET ENGINE
# ==========================================

ANIMAL_EMOJI_MAP = {
    "elephant": "<i class=\"fa-solid fa-paw\"></i>",
    "leopard": "<i class=\"fa-solid fa-paw\"></i>",
    "tiger": "<i class=\"fa-solid fa-paw\"></i>",
    "lion": "<i class=\"fa-solid fa-paw\"></i>",
    "bear": "<i class=\"fa-solid fa-paw\"></i>",
    "deer": "<i class=\"fa-solid fa-paw\"></i>",
    "wild boar": "<i class=\"fa-solid fa-paw\"></i>",
    "boar": "<i class=\"fa-solid fa-paw\"></i>",
    "monkey": "<i class=\"fa-solid fa-paw\"></i>",
    "hyena": "<i class=\"fa-solid fa-paw\"></i>",
    "wolf": "<i class=\"fa-solid fa-paw\"></i>",
    "fox": "<i class=\"fa-solid fa-paw\"></i>",
    "jackal": "<i class=\"fa-solid fa-paw\"></i>",
    "peacock": "<i class=\"fa-solid fa-feather\"></i>"
}

def get_animal_emoji(species_name):
    species_lower = str(species_name).strip().lower()
    for key, emoji in ANIMAL_EMOJI_MAP.items():
        if key in species_lower:
            return emoji
    return "<i class=\"fa-solid fa-paw\"></i>"

SAMPLE_GIS_DETECTIONS = [
    {
        "id": 201,
        "node_id": "North-Corridor-002",
        "species": "Leopard",
        "confidence": 0.94,
        "latitude": 19.2395,
        "longitude": 72.8340,
        "timestamp": "2026-08-16T11:45:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 202,
        "node_id": "Village-A-Perimeter",
        "species": "Elephant",
        "confidence": 0.92,
        "latitude": 19.2312,
        "longitude": 72.8258,
        "timestamp": "2026-08-16T10:15:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 203,
        "node_id": "Waterhole-West-004",
        "species": "Tiger",
        "confidence": 0.89,
        "latitude": 19.2415,
        "longitude": 72.8295,
        "timestamp": "2026-08-16T09:30:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 204,
        "node_id": "Forest-Edge-East",
        "species": "Deer",
        "confidence": 0.96,
        "latitude": 19.2275,
        "longitude": 72.8385,
        "timestamp": "2026-08-16T08:50:00Z",
        "status": "RESOLVED"
    },
    {
        "id": 205,
        "node_id": "Agricultural-Zone-003",
        "species": "Wild Boar",
        "confidence": 0.85,
        "latitude": 19.2242,
        "longitude": 72.8415,
        "timestamp": "2026-08-16T07:20:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 206,
        "node_id": "North-Ridge-005",
        "species": "Bear",
        "confidence": 0.91,
        "latitude": 19.2435,
        "longitude": 72.8365,
        "timestamp": "2026-08-16T06:10:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 207,
        "node_id": "Buffer-Canopy-002",
        "species": "Monkey",
        "confidence": 0.93,
        "latitude": 19.2345,
        "longitude": 72.8282,
        "timestamp": "2026-08-16T05:40:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 208,
        "node_id": "River-Crossing-006",
        "species": "Hyena",
        "confidence": 0.82,
        "latitude": 19.2368,
        "longitude": 72.8445,
        "timestamp": "2026-08-16T04:15:00Z",
        "status": "ACTIVE"
    },
    {
        "id": 209,
        "node_id": "Grassland-Corridor-007",
        "species": "Fox",
        "confidence": 0.88,
        "latitude": 19.2295,
        "longitude": 72.8335,
        "timestamp": "2026-08-16T03:30:00Z",
        "status": "RESOLVED"
    },
    {
        "id": 210,
        "node_id": "South-Settlement-Edge",
        "species": "Jackal",
        "confidence": 0.87,
        "latitude": 19.2225,
        "longitude": 72.8378,
        "timestamp": "2026-08-16T02:00:00Z",
        "status": "ACTIVE"
    }
]

def load_gis_dataset(live_df):
    """Combines live database detections with sample baseline data to ensure multi-species GIS mapping."""
    records = []
    if live_df is not None and not live_df.empty:
        for _, r in live_df.iterrows():
            try:
                records.append({
                    "id": int(r["id"]),
                    "node_id": str(r["node_id"]),
                    "species": str(r["species"]),
                    "confidence": float(r["confidence"]),
                    "latitude": float(r["latitude"]),
                    "longitude": float(r["longitude"]),
                    "timestamp": str(r["timestamp"]),
                    "status": str(r.get("status", "ACTIVE")),
                    "is_live": True
                })
            except Exception:
                continue

    # Add sample multi-species records if they aren't duplicates
    for sample in SAMPLE_GIS_DETECTIONS:
        exists = any(
            r["species"].lower() == sample["species"].lower() and
            abs(r["latitude"] - sample["latitude"]) < 0.001 and
            abs(r["longitude"] - sample["longitude"]) < 0.001
            for r in records
        )
        if not exists:
            records.append({**sample, "is_live": False})

    # Enrich records with risk level and formatted dates
    enriched = []
    for rec in records:
        try:
            hab = HabitatService.get_habitat_features(rec["latitude"], rec["longitude"])
            risk_info = calculate_prototype_risk(
                species=rec["species"],
                confidence=rec["confidence"],
                ndvi=hab["ndvi"],
                dist_water=hab["dist_water_m"],
                slope=hab["slope_deg"]
            )
            rec["risk"] = risk_info["risk"]
            rec["score"] = risk_info["score"]
        except Exception:
            rec["risk"] = "LOW"
            rec["score"] = 3

        try:
            rec["time_formatted"] = datetime.fromisoformat(
                rec["timestamp"].replace("Z", "+00:00")
            ).strftime("%d %b %Y • %H:%M")
        except Exception:
            rec["time_formatted"] = rec["timestamp"]

        rec["emoji"] = get_animal_emoji(rec["species"])
        enriched.append(rec)

    return pd.DataFrame(enriched)


# ==========================================
# LOAD DATA
# ==========================================

df = fetch_data()


# ==========================================
# CLEAN DATA
# ==========================================

if not df.empty:

    df = df[
        pd.to_numeric(
            df["latitude"],
            errors="coerce"
        ).notnull()
    ]

    df = df[
        df["latitude"] != 0.0
    ]


# ==========================================
# LIVE SYSTEM STATUS
# ==========================================

if not df.empty:

    latest_status = df.sort_values(
        by="id",
        ascending=False
    ).iloc[0]

    try:
        status_time = datetime.fromisoformat(
            str(latest_status["timestamp"]).replace("Z", "+00:00")
        ).strftime("%d %b %Y • %H:%M")
    except Exception:
        status_time = str(latest_status["timestamp"])

    st.html(
        f"""
        <div class="status-grid">
            <div class="system-stat-card">
                <div class="system-stat-label">System Network</div>
                <div class="system-stat-value" style="color:#4ade80;"><i class="fa-solid fa-circle" style="color:#4ade80;font-size:0.75rem;margin-right:6px;vertical-align:middle;"></i>Live & Online</div>
            </div>

            <div class="system-stat-card">
                <div class="system-stat-label">Monitoring Node</div>
                <div class="system-stat-value"><i class="fa-solid fa-radio" style="color:#34d399;margin-right:6px;"></i>{latest_status['node_id']}</div>
            </div>

            <div class="system-stat-card">
                <div class="system-stat-label">Active Species</div>
                <div class="system-stat-value"><i class="fa-solid fa-paw" style="color:#a7f3d0;margin-right:6px;"></i>{latest_status['species']}</div>
            </div>

            <div class="system-stat-card">
                <div class="system-stat-label">Last Sync</div>
                <div class="system-stat-value"><i class="fa-regular fa-clock" style="color:#94a3b8;margin-right:6px;"></i>{status_time}</div>
            </div>
        </div>
        """
    )



# ==========================================
# EDGE AI DETECTION PREVIEW
# ==========================================

st.markdown(
    '<div class="section-heading">'
    '<i class="fa-solid fa-microchip" style="margin-right:8px;color:#4ade80;"></i>Edge AI Detection'
    '</div>',
    unsafe_allow_html=True
)


# Use the most recent Detection Console result when one is available.
# The bundled Fox image remains as a visual fallback before the first analysis.
EDGE_FRAME_PATH = os.path.join(
    os.path.dirname(__file__),
    "assets",
    "wildlife_test_result.jpg"
)

latest_console_result = st.session_state.get("detection_result")

if latest_console_result is not None:
    edge_frame = latest_console_result["annotated_image"]
    edge_detections = latest_console_result["detections"]

    if edge_detections:
        edge_detection = max(
            edge_detections,
            key=lambda detection: detection["confidence"]
        )
        edge_species = edge_detection["species"]
        edge_confidence = f"{edge_detection['confidence'] * 100:.2f}% Confidence"
        edge_source = "Latest Detection Console Analysis"
    else:
        edge_species = "No wildlife detected"
        edge_confidence = "Try a clearer supported wildlife image"
        edge_source = "Latest Detection Console Analysis"

elif os.path.exists(EDGE_FRAME_PATH):
    edge_frame = EDGE_FRAME_PATH
    edge_species = "Fox"
    edge_confidence = "88.63% Confidence"
    edge_source = "Bundled model-test sample"

else:
    edge_frame = None


if edge_frame is not None:

    edge_col1, edge_col2 = st.columns([2, 1])


    # --------------------------------------
    # REAL YOLO DETECTION IMAGE
    # --------------------------------------

    with edge_col1:

        st.image(
            edge_frame,
            caption=edge_source,
            width="stretch"
        )


    # --------------------------------------
    # DETECTION INFORMATION
    # --------------------------------------

    with edge_col2:

        st.html(
            f"""
            <div style="
                background: linear-gradient(145deg, #0e2017, #06130c);
                border: 1px solid #1e4530;
                border-radius: 16px;
                padding: 24px;
                min-height: 300px;
                box-shadow: 0 8px 24px rgba(6, 19, 12, 0.16);
            ">

                <div style="
                    color: #8da496;
                    font-size: 0.75rem;
                    font-weight: 750;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                ">
                    Edge AI Status
                </div>

                <div style="
                    color: #4ade80;
                    font-size: 1.25rem;
                    font-weight: 850;
                    margin-top: 8px;
                ">
                    <i class="fa-solid fa-circle" style="color:#4ade80;font-size:0.8rem;margin-right:6px;"></i>YOLOv8 ONLINE
                </div>


                <div style="
                    margin-top: 26px;
                    color: #8da496;
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                ">
                    Latest Detection
                </div>

                <div style="
                    color: #ffffff;
                    font-size: 1.6rem;
                    font-weight: 850;
                    margin-top: 6px;
                ">
                    <i class="fa-solid fa-paw" style="margin-right:8px;color:#a7f3d0;"></i>{edge_species}
                </div>


                <div style="
                    color: #4ade80;
                    font-size: 1.15rem;
                    font-weight: 800;
                    margin-top: 5px;
                ">
                    {edge_confidence}
                </div>


                <div style="
                    margin-top: 24px;
                    padding-top: 18px;
                    border-top: 1px solid #1e4530;
                    color: #a3bcad;
                    font-size: 0.8rem;
                    line-height: 1.7;
                ">
                    {edge_source}<br>
                    Custom wildlife model<br>
                    16-class filtered wildlife dataset<br>
                    Bounding-box detection confirmed
                </div>

            </div>
            """
        )

else:

    st.info(
        "Waiting for Edge AI detection result..."
    )


# ==========================================
# DETECTION CONSOLE — STAGES 8A–8E
# ==========================================

st.html('<div id="detection-console"></div>')

st.markdown(
    '<div class="section-heading">'
    '<i class="fa-solid fa-camera" style="margin-right:8px;color:#4ade80;"></i>Wildlife Detection Console'
    '</div>',
    unsafe_allow_html=True
)

st.caption(
    "Upload or capture a clear wildlife image for Edge AI analysis. "
    "Successful detections are added to the live dashboard through the "
    "existing FastAPI service."
)

upload_col, preview_col = st.columns([1, 1])

with upload_col:

    selected_node_name = st.selectbox(
        "Monitoring location",
        options=list(MONITORING_NODES.keys()),
        help="This location is attached to the alert and shown on the live map."
    )
    monitoring_node = MONITORING_NODES[selected_node_name]

    uploaded_image = st.file_uploader(
        "Upload wildlife image",
        type=["jpg", "jpeg", "png"],
        help="Use a JPG, JPEG, or PNG image containing wildlife."
    )

    st.markdown("**or capture a photo from this device**")

    camera_image = st.camera_input(
        "Capture wildlife photo",
        help="Allow camera access, take a photo, then analyze it with Edge AI."
    )

    # A fresh camera capture takes priority when both inputs contain an image.
    selected_image = camera_image or uploaded_image
    image_source = "camera photo" if camera_image is not None else "uploaded image"

    if selected_image is not None:
        image_id = (
            f"{image_source}:{selected_image.name}:{selected_image.size}:"
            f"{monitoring_node['node_id']}"
        )

        if st.session_state.get("detection_image_id") != image_id:
            st.session_state["detection_image_id"] = image_id
            st.session_state.pop("detection_result", None)
            st.session_state.pop("api_sync_result", None)
            st.session_state.pop("api_sync_error", None)
            st.session_state.pop("analysis_error", None)
            st.session_state.pop("alert_monitoring_node", None)

    if selected_image is None:
        st.info("Upload an image or capture a photo to enable analysis.")
        st.button(
            "ANALYZE WITH EDGE AI",
            disabled=True,
            use_container_width=True,
            key="analyze_wildlife_image"
        )

    else:
        st.success(
            f"{image_source.capitalize()} ready: {selected_image.name} "
            f"({selected_image.size / 1024:.0f} KB)"
        )

        analyze_requested = st.button(
            "ANALYZE WITH EDGE AI",
            type="primary",
            use_container_width=True,
            key="analyze_wildlife_image"
        )

        if analyze_requested:
            st.session_state.pop("detection_result", None)
            st.session_state.pop("api_sync_result", None)
            st.session_state.pop("api_sync_error", None)
            st.session_state.pop("analysis_error", None)
            st.session_state.pop("alert_monitoring_node", None)

            try:
                with st.spinner("Running image through the YOLOv8 wildlife model..."):
                    detection_result = (
                        analyze_wildlife_image(selected_image)
                    )
                    st.session_state["detection_result"] = detection_result

                if detection_result["detections"]:
                    strongest_detection = max(
                        detection_result["detections"],
                        key=lambda detection: detection["confidence"]
                    )

                    with st.spinner("Adding the detection to the live monitoring dashboard..."):
                        st.session_state["alert_monitoring_node"] = monitoring_node
                        st.session_state["api_sync_result"] = (
                            create_detection_alert(
                                strongest_detection,
                                monitoring_node
                            )
                        )
                    st.session_state.pop("api_sync_error", None)
                    st.session_state.pop("analysis_error", None)
                    st.rerun()

                st.session_state.pop("api_sync_result", None)
                st.session_state.pop("api_sync_error", None)

            except Exception as error:
                if st.session_state.get("detection_result") is None:
                    st.session_state["analysis_error"] = str(error)
                else:
                    st.session_state["api_sync_error"] = str(error)

        detection_result = st.session_state.get("detection_result")
        analysis_error = st.session_state.get("analysis_error")

        if analysis_error is not None:
            st.error(
                "The image could not be analyzed. "
                f"Please try another image. Details: {analysis_error}"
            )

        if detection_result is not None:
            detections = detection_result["detections"]

            if detections:
                strongest_detection = max(
                    detections,
                    key=lambda detection: detection["confidence"]
                )

                st.success(
                    f"{strongest_detection['species']} detected "
                    f"with {strongest_detection['confidence'] * 100:.2f}% confidence"
                )
                st.caption(
                    f"{len(detections)} detection(s) found. "
                    "The annotated result is shown on the right."
                )

                api_sync_result = st.session_state.get("api_sync_result")
                api_sync_error = st.session_state.get("api_sync_error")

                if api_sync_result is not None:
                    alert_monitoring_node = st.session_state[
                        "alert_monitoring_node"
                    ]
                    st.success(
                        "Alert added to the live dashboard "
                        f"(record #{api_sync_result['id']})."
                    )
                    st.caption(
                        f"Source: {alert_monitoring_node['node_id']} • "
                        f"{alert_monitoring_node['latitude']}, "
                        f"{alert_monitoring_node['longitude']}"
                    )

                elif api_sync_error is not None:
                    st.error(
                        "YOLO detection completed, but the FastAPI alert could not be saved. "
                        "Make sure the backend is running on port 8000. "
                        f"Details: {api_sync_error}"
                    )

            else:
                st.warning(
                    "No wildlife was detected in this image. "
                    "Try a clearer image containing an animal supported by the model."
                )

with preview_col:

    if selected_image is None:
        st.markdown(
            """
            <div style="
                background: linear-gradient(145deg, #172033, #111827);
                border: 1px dashed #3b4a66;
                border-radius: 16px;
                min-height: 220px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #94a3b8;
                text-align: center;
                padding: 24px;
            ">
                <div>
                    <div style="font-size: 2.2rem; color: #475569; margin-bottom: 8px;"><i class="fa-regular fa-image"></i></div>
                    <div style="font-weight: 700; color: #cbd5e1;">Image preview</div>
                    <div style="font-size: 0.85rem; margin-top: 5px;">Your selected image will appear here.</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    else:
        detection_result = st.session_state.get("detection_result")

        if detection_result is not None:
            st.image(
                detection_result["annotated_image"],
                caption="YOLOv8 annotated detection result",
                width="stretch"
            )

        else:
            st.image(
                selected_image,
                caption=f"Selected {image_source} — ready for Edge AI analysis",
                width="stretch"
            )


# ==========================================
# MAIN DASHBOARD
# ==========================================

if not df.empty:

    df = df.sort_values(
        by="id",
        ascending=False
    )

    latest = df.iloc[0]


    # ======================================
    # SATELLITE + ML
    # ======================================

    try:

        dt = datetime.fromisoformat(
            latest["timestamp"].replace("Z", "")
        )

        detection_hour = dt.hour

    except Exception:

        detection_hour = 12


    habitat = HabitatService.get_habitat_features(
        latest["latitude"],
        latest["longitude"]
    )


    ml_reason = predictor.predict_reason(
        hour=detection_hour,
        ndvi=habitat["ndvi"],
        dist_water=habitat["dist_water_m"],
        slope=habitat["slope_deg"],
        species=latest["species"]
    )


    # ======================================
    # RISK
    # ======================================

    risk_data = calculate_prototype_risk(
        species=latest["species"],
        confidence=latest["confidence"],
        ndvi=habitat["ndvi"],
        dist_water=habitat["dist_water_m"],
        slope=habitat["slope_deg"]
    )

    risk_level = risk_data["risk"]


    # ======================================
    # CURRENT CONFLICT RISK
    # ======================================

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-triangle-exclamation" style="margin-right:8px;color:#f87171;"></i>Current Conflict Risk'
        '</div>',
        unsafe_allow_html=True
    )


    risk_col, factor_col = st.columns([1, 2])


    # MAIN RISK CARD
    with risk_col:

        st.html(
            f"""
            <div class="risk-card">

                <div class="risk-kicker">
                    Prototype Risk Assessment
                </div>

                <div class="risk-value">
                    <i class="fa-solid fa-circle-exclamation" style="color:#f87171;margin-right:6px;"></i>{risk_level}
                </div>

                <div class="risk-species">
                    {latest['species']} detected
                </div>

                <div class="risk-confidence">
                    Detection confidence:
                    {latest['confidence'] * 100:.0f}%
                </div>

                <div class="score-box">

                    <div class="score-label">
                        Explainable Intelligence Score
                    </div>

                    <div class="score-value">
                        {risk_data.get('score_100', 85)} / 100
                    </div>

                </div>

                <div class="risk-note">
                    Weighted 6-factor assessment (Corridor, Canopy, Species, AI Confidence, Waterhole, Crop Season).
                </div>

            </div>
            """
        )

    # RISK FACTORS & EXPLAINABILITY
    with factor_col:
        st.markdown("#### <i class='fa-solid fa-chart-pie' style='color:#4ade80;'></i> Explainability Factor Breakdown", unsafe_allow_html=True)
        if "explainability" in risk_data:
            for item in risk_data["explainability"]:
                p_val = item["points"]
                f_name = item["factor"]
                f_weight = item["weight"]
                f_status = item["status"]
                stat_color = "#ef4444" if f_status == "HIGH" else ("#f59e0b" if f_status == "MEDIUM" else "#34d399")
                st.markdown(
                    f"""
                    <div style="display:flex;align-items:center;justify-content:space-between;background:#0d1c14;border:1px solid #1c3828;padding:8px 14px;border-radius:10px;margin-bottom:6px;font-size:0.85rem;">
                        <div style="color:#ffffff;font-weight:700;">{f_name} <span style="font-size:0.75rem;color:#8da496;">({f_weight})</span></div>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <span style="color:#a7f3d0;font-weight:800;font-family:monospace;">{p_val}</span>
                            <span style="background:rgba(255,255,255,0.05);color:{stat_color};border:1px solid {stat_color};padding:2px 8px;border-radius:8px;font-size:0.70rem;font-weight:800;">{f_status}</span>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True
                )


        factor1, factor2, factor3 = st.columns(3)


        with factor1:

            st.html(
                f"""
                <div class="factor-card">

                    <div class="factor-label">
                        Species Risk
                    </div>

                    <div class="factor-value-{risk_data['species_level'].lower()}">
                        {risk_data['species_level']}
                    </div>

                </div>
                """
            )


        with factor2:

            st.html(
                f"""
                <div class="factor-card">

                    <div class="factor-label">
                        Detection Confidence
                    </div>

                    <div class="factor-value-{risk_data['confidence_level'].lower()}">
                        {risk_data['confidence_level']}
                    </div>

                </div>
                """
            )


        with factor3:

            st.html(
                f"""
                <div class="factor-card">

                    <div class="factor-label">
                        Environment
                    </div>

                    <div class="factor-value-{risk_data['environment_level'].lower()}">
                        {risk_data['environment_level']}
                    </div>

                </div>
                """
            )


    # ======================================
    # ACTIVE WILDLIFE ALERT
    # ======================================

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-bell" style="margin-right:8px;color:#f87171;"></i>Active Wildlife Alert'
        '</div>',
        unsafe_allow_html=True
    )

    st.html('<div id="alerts"></div>')


    if risk_level == "HIGH":

        alert_color = "#ef4444"

    elif risk_level == "MEDIUM":

        alert_color = "#facc15"

    else:

        alert_color = "#4ade80"


    st.html(
        f"""
        <div style="
            background: linear-gradient(145deg, #1f2937, #111827);
            border: 1px solid {alert_color};
            border-left: 6px solid {alert_color};
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 24px;
        ">

            <div style="
                color: {alert_color};
                font-size: 0.8rem;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
            ">
                LIVE ALERT
            </div>

            <div style="
                color: #f8fafc;
                font-size: 1.55rem;
                font-weight: 800;
                margin-top: 6px;
            ">
                {latest['species']} detected
            </div>

            <div style="
                color: #cbd5e1;
                font-size: 0.95rem;
                margin-top: 5px;
            ">
                {risk_level} conflict risk identified
            </div>

            <div style="
                display: flex;
                gap: 40px;
                flex-wrap: wrap;
                margin-top: 18px;
            ">

                <div>
                    <div style="
                        color: #64748b;
                        font-size: 0.72rem;
                        text-transform: uppercase;
                    ">
                        Confidence
                    </div>

                    <div style="
                        color: #f8fafc;
                        font-size: 1rem;
                        font-weight: 700;
                    ">
                        {latest['confidence'] * 100:.0f}%
                    </div>
                </div>


                <div>
                    <div style="
                        color: #64748b;
                        font-size: 0.72rem;
                        text-transform: uppercase;
                    ">
                        Monitoring Node
                    </div>

                    <div style="
                        color: #f8fafc;
                        font-size: 1rem;
                        font-weight: 700;
                    ">
                        {latest['node_id']}
                    </div>
                </div>


                <div>
                    <div style="
                        color: #64748b;
                        font-size: 0.72rem;
                        text-transform: uppercase;
                    ">
                        Detection Time
                    </div>

                    <div style="
                        color: #f8fafc;
                        font-size: 1rem;
                        font-weight: 700;
                    ">
                        {latest['timestamp']}
                    </div>
                </div>


                <div>
                    <div style="
                        color: #64748b;
                        font-size: 0.72rem;
                        text-transform: uppercase;
                    ">
                        Risk Score
                    </div>

                    <div style="
                        color: {alert_color};
                        font-size: 1rem;
                        font-weight: 800;
                    ">
                        {risk_data['score']} / 8
                    </div>
                </div>

            </div>


            <div style="
                margin-top: 18px;
                padding-top: 14px;
                border-top: 1px solid #26334a;
                color: #cbd5e1;
                font-size: 0.85rem;
            ">
                Immediate attention recommended
            </div>

        </div>
        """
    )


    # ======================================
    # INCIDENT RESPONSE
    # ======================================

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-shield-halved" style="margin-right:8px;color:#34d399;"></i>Incident Response & Dispatch'
        '</div>',
        unsafe_allow_html=True
    )

    current_alert_status = str(
        latest.get("status", "ACTIVE")
    ).upper()

    # MOCK SMS PREVIEW AFTER ALERT
    st.markdown(
        """
        <div style="background:#0f172a;border:1px solid #38bdf8;border-radius:12px;padding:14px;margin-bottom:16px;">
            <div style="color:#38bdf8;font-size:0.80rem;font-weight:800;"><i class="fa-solid fa-signal"></i> AUTOMATED SMS DISPATCH PREVIEW [DEMO MODE]</div>
            <div style="font-family:monospace;color:#e2e8f0;font-size:0.82rem;margin-top:6px;">
                [WILDCARE ALERT] Critical movement: {species} detected at node {node}.<br>
                Village Perimeter Warning sent to registered community phones.<br>
                Status: Broadcast Dispatched via Telemetry Gateway.
            </div>
        </div>
        """.format(species=latest['species'], node=latest['node_id']),
        unsafe_allow_html=True
    )

    # COMMUNITY SIGHTINGS VERIFICATION PANEL FOR OFFICERS
    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-users-line" style="margin-right:8px;color:#fbbf24;"></i>Community Sightings — Officer Verification Layer'
        '</div>',
        unsafe_allow_html=True
    )

    try:
        reports_res = requests.get("http://localhost:8000/community/reports", headers=get_auth_headers(), timeout=3)
        if reports_res.status_code == 200:
            comm_reports = reports_res.json()
            if comm_reports:
                pending_reports = [r for r in comm_reports if r["status"] == "PENDING"]
                st.caption(f"Currently **{len(pending_reports)}** pending report(s) requiring officer review.")
                for rep in comm_reports[:5]:
                    c_badge = "#eab308" if rep["status"] == "PENDING" else ("#22c55e" if rep["status"] == "VERIFIED" else "#ef4444")
                    with st.expander(f"📍 [{rep['status']}] Report #{rep['report_id']} — {rep['species']} ({rep['reporter_name']})", expanded=(rep["status"] == "PENDING")):
                        r_col1, r_col2 = st.columns([3, 2])
                        with r_col1:
                            st.write(f"**Reporter:** {rep['reporter_name']}")
                            st.write(f"**Species & Severity:** {rep['species']} ({rep['severity']})")
                            st.write(f"**Coordinates:** {rep['latitude']:.4f}° N, {rep['longitude']:.4f}° E")
                            st.write(f"**Description:** {rep['description']}")
                            st.write(f"**Submitted:** {rep['timestamp'][:19].replace('T', ' ')}")
                        with r_col2:
                            officer_notes = st.text_input("Officer Review Notes", key=f"notes_{rep['report_id']}")
                            b1, b2 = st.columns(2)
                            with b1:
                                if st.button("✅ Verify & Sync Map", key=f"v_{rep['report_id']}", use_container_width=True):
                                    try:
                                        v_res = requests.patch(
                                            f"http://localhost:8000/community/reports/{rep['report_id']}/verify",
                                            json={"status": "VERIFIED", "officer_notes": officer_notes},
                                            headers=get_auth_headers(),
                                            timeout=5
                                        )
                                        if v_res.status_code == 200:
                                            st.success("Report VERIFIED! Detection synced to live GIS map.")
                                            st.rerun()
                                    except Exception as e:
                                        st.error(f"Error: {e}")
                            with b2:
                                if st.button("❌ Reject Report", key=f"r_{rep['report_id']}", use_container_width=True):
                                    try:
                                        requests.patch(
                                            f"http://localhost:8000/community/reports/{rep['report_id']}/verify",
                                            json={"status": "REJECTED", "officer_notes": officer_notes},
                                            headers=get_auth_headers(),
                                            timeout=5
                                        )
                                        st.warning("Report rejected.")
                                        st.rerun()
                                    except Exception as e:
                                        st.error(f"Error: {e}")
            else:
                st.info("No community reports submitted yet.")
    except Exception:
        st.caption("Forest Officer backend connection active.")


    if current_alert_status == "RESOLVED":
        response_message = "This incident has been marked as resolved."
        response_color = "#4ade80"
        next_status = None
        action_label = None

    elif current_alert_status == "ACKNOWLEDGED":
        response_message = "Forest response team has acknowledged this incident."
        response_color = "#facc15"
        next_status = "RESOLVED"
        action_label = "Mark incident as resolved"

    else:
        response_message = "This incident is active and needs a response."
        response_color = "#f87171"
        next_status = "ACKNOWLEDGED"
        action_label = "Acknowledge incident"

    response_col, action_col = st.columns([3, 1])

    with response_col:
        st.html(
            f"""
            <div style="
                background: #111827;
                border: 1px solid #26334a;
                border-left: 5px solid {response_color};
                border-radius: 12px;
                padding: 14px 18px;
                color: #e2e8f0;
                font-weight: 700;
            ">
                {response_message}
            </div>
            """
        )

    with action_col:
        if next_status is None:
            st.button(
                "Incident resolved",
                disabled=True,
                use_container_width=True,
                key="resolve_current_incident"
            )

        elif st.button(
            action_label,
            type="primary",
            use_container_width=True,
            key="resolve_current_incident"
        ):
            try:
                update_alert_status(
                    int(latest["id"]),
                    next_status
                )
                st.rerun()
            except requests.RequestException as error:
                st.error(
                    "Could not update the incident status. "
                    f"Details: {error}"
                )


    # ======================================
    # RECOMMENDED ACTION
    # ======================================

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-clipboard-list" style="margin-right:8px;color:#fbbf24;"></i>Recommended Action'
        '</div>',
        unsafe_allow_html=True
    )


    if risk_level == "HIGH":

        community_actions = [
            "Avoid the affected area",
            "Keep children and vulnerable people indoors",
            "Follow instructions from local authorities"
        ]

        forest_actions = [
            "Monitor the animal movement continuously",
            "Alert the nearby response team",
            "Inform the affected settlement"
        ]

        action_priority = "Immediate Action"

    elif risk_level == "MEDIUM":

        community_actions = [
            "Stay alert near the monitored area",
            "Avoid approaching the animal",
            "Follow local safety instructions"
        ]

        forest_actions = [
            "Increase monitoring frequency",
            "Track the animal movement",
            "Prepare the response team if risk increases"
        ]

        action_priority = "Precautionary Action"

    else:

        community_actions = [
            "Continue normal activity with caution",
            "Do not approach the animal",
            "Report unusual wildlife activity"
        ]

        forest_actions = [
            "Continue observation",
            "Record the detection",
            "Monitor for changes in movement"
        ]

        action_priority = "Monitoring"


    community_html = "".join(
        f"<li>{action}</li>"
        for action in community_actions
    )

    forest_html = "".join(
        f"<li>{action}</li>"
        for action in forest_actions
    )


    st.html(
        f"""
        <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 28px;
        ">

            <!-- COMMUNITY -->

            <div class="action-card">

                <div class="action-title">
                    <i class="fa-solid fa-users" style="margin-right:6px;color:#93c5fd;"></i>For Community
                </div>

                <div class="action-priority">
                    {action_priority}
                </div>

                <ul class="action-list">
                    {community_html}
                </ul>

            </div>


            <!-- FOREST OFFICIALS -->

            <div class="action-card">

                <div class="action-title">
                    <i class="fa-solid fa-user-shield" style="margin-right:6px;color:#4ade80;"></i>For Forest Officials
                </div>

                <div class="action-priority">
                    {action_priority}
                </div>

                <ul class="action-list">
                    {forest_html}
                </ul>

            </div>

        </div>
        """
    )


    # ======================================
    # TELEMETRY
    # ======================================

    st.markdown("---")

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-satellite-dish" style="margin-right:8px;color:#34d399;"></i>Real-Time Ground & Satellite Telemetry'
        '</div>',
        unsafe_allow_html=True
    )


    # ROW 1
    card1, card2, card3 = st.columns(3)


    with card1:

        st.html(
            f"""
            <div class="telemetry-card">

                <div class="telemetry-icon">
                    <i class="fa-solid fa-paw" style="color:#4ade80;"></i>
                </div>

                <div class="telemetry-label">
                    Active Species
                </div>

                <div class="telemetry-value">
                    {latest['species']}
                </div>

                <div class="telemetry-sub">
                    Detection confidence:
                    {latest['confidence'] * 100:.0f}%
                </div>

            </div>
            """
        )


    with card2:

        st.html(
            f"""
            <div class="telemetry-card">

                <div class="telemetry-icon">
                    <i class="fa-solid fa-leaf" style="color:#34d399;"></i>
                </div>

                <div class="telemetry-label">
                    Vegetation
                </div>

                <div class="telemetry-value">
                    {habitat['ndvi']}
                </div>

                <div class="telemetry-sub">
                    NDVI index
                </div>

            </div>
            """
        )


    with card3:

        st.html(
            f"""
            <div class="telemetry-card">

                <div class="telemetry-icon">
                    <i class="fa-solid fa-droplet" style="color:#38bdf8;"></i>
                </div>

                <div class="telemetry-label">
                    Nearest Water
                </div>

                <div class="telemetry-value">
                    {habitat['dist_water_m']} m
                </div>

                <div class="telemetry-sub">
                    Estimated distance
                </div>

            </div>
            """
        )


    # ROW 2
    card4, card5 = st.columns(2)


    with card4:

        st.html(
            f"""
            <div class="telemetry-card">

                <div class="telemetry-icon">
                    <i class="fa-solid fa-mountain" style="color:#fbbf24;"></i>
                </div>

                <div class="telemetry-label">
                    Terrain Slope
                </div>

                <div class="telemetry-value">
                    {habitat['slope_deg']}°
                </div>

                <div class="telemetry-sub">
                    Local terrain condition
                </div>

            </div>
            """
        )


    with card5:

        st.html(
            f"""
            <div class="telemetry-card">

                <div class="telemetry-icon">
                    <i class="fa-solid fa-compass" style="color:#a78bfa;"></i>
                </div>

                <div class="telemetry-label">
                    Movement Driver
                </div>

                <div class="telemetry-value">
                    {ml_reason['predicted_reason']}
                </div>

                <div class="telemetry-sub">
                    Current ML interpretation
                </div>

            </div>
            """
        )


    # ======================================
    # MOVEMENT INTELLIGENCE
    # ======================================

    history = df[
        ["latitude", "longitude"]
    ].values.tolist()


    spatial_intel = predictor.compute_corridors_and_trajectory(
        latest["latitude"],
        latest["longitude"],
        latest["species"],
        history
    )


    # ======================================
    # GIS WILDLIFE MONITORING MAP
    # ======================================

    st.markdown("---")

    st.html('<div id="map-section"></div>')

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-map-location-dot" style="margin-right:8px;color:#34d399;"></i>GIS Wildlife Monitoring & Coexistence Map'
        '</div>',
        unsafe_allow_html=True
    )

    # 1. LOAD COMPREHENSIVE MULTI-SPECIES GIS DATASET
    gis_full_df = load_gis_dataset(df)

    # 2. GIS CONTROL & FILTER TOOLBAR
    col_gis1, col_gis2, col_gis3, col_gis4 = st.columns(4)

    species_list = ["All Wildlife (Multi-Species)"] + sorted(gis_full_df["species"].unique().tolist())
    with col_gis1:
        selected_species = st.selectbox(
            "Wildlife Species",
            species_list,
            index=0,
            key="gis_species_filter"
        )

    with col_gis2:
        selected_risk = st.selectbox(
            "Risk Filter",
            ["All Risk Levels", "High Risk", "Medium Risk", "Low Risk"],
            index=0,
            key="gis_risk_filter"
        )

    with col_gis3:
        selected_layer = st.selectbox(
            "GIS Layer View",
            ["Combined Multi-Layer", "Wildlife Markers", "Marker Clustering", "Density Heatmap"],
            index=0,
            key="gis_layer_mode"
        )

    with col_gis4:
        selected_tile = st.selectbox(
            "Base Map Imagery",
            ["Satellite (ESRI Imagery)", "OpenStreetMap Standard", "CartoDB Tactical Positron", "OpenTopoMap Terrain"],
            index=0,
            key="gis_tile_style"
        )

    show_buffers = st.checkbox(
        "Display Perimeter Risk Buffer Radii (150m – 300m)",
        value=True,
        key="gis_buffer_toggle"
    )

    # 3. FILTER GIS DATA
    gis_filtered_df = gis_full_df.copy()

    if selected_species != "All Wildlife (Multi-Species)":
        gis_filtered_df = gis_filtered_df[gis_filtered_df["species"] == selected_species]

    if selected_risk == "High Risk":
        gis_filtered_df = gis_filtered_df[gis_filtered_df["risk"] == "HIGH"]
    elif selected_risk == "Medium Risk":
        gis_filtered_df = gis_filtered_df[gis_filtered_df["risk"] == "MEDIUM"]
    elif selected_risk == "Low Risk":
        gis_filtered_df = gis_filtered_df[gis_filtered_df["risk"] == "LOW"]

    # 4. GIS SUMMARY HEADER METRICS
    gis_total_count = len(gis_filtered_df)
    gis_high_count = len(gis_filtered_df[gis_filtered_df["risk"] == "HIGH"])
    gis_species_count = gis_filtered_df["species"].nunique()
    gis_hotspot_count = min(4, max(1, len(gis_filtered_df) // 2))

    st.html(
        f"""
        <div style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin: 10px 0 20px 0;
        ">
            <div class="system-stat-card">
                <div class="system-stat-label"><i class="fa-solid fa-satellite-dish" style="margin-right:6px;color:#34d399;"></i>Mapped Detections</div>
                <div class="system-stat-value">{gis_total_count} Animals</div>
            </div>
            <div class="system-stat-card">
                <div class="system-stat-label"><i class="fa-solid fa-circle-exclamation" style="margin-right:6px;color:#f87171;"></i>High-Risk Sightings</div>
                <div class="system-stat-value">{gis_high_count} Zones</div>
            </div>
            <div class="system-stat-card">
                <div class="system-stat-label"><i class="fa-solid fa-paw" style="margin-right:6px;color:#a7f3d0;"></i>Species Monitored</div>
                <div class="system-stat-value">{gis_species_count} Types</div>
            </div>
            <div class="system-stat-card">
                <div class="system-stat-label"><i class="fa-solid fa-fire-flame-curved" style="margin-right:6px;color:#fbbf24;"></i>Wildlife Hotspots</div>
                <div class="system-stat-value">{gis_hotspot_count} Active Clusters</div>
            </div>
        </div>
        """
    )

    # 5. CONSTRUCT LEAFLET / FOLIUM GIS MAP
    if not gis_filtered_df.empty:
        map_center = [
            float(gis_filtered_df["latitude"].mean()),
            float(gis_filtered_df["longitude"].mean())
        ]
    else:
        map_center = [latest["latitude"], latest["longitude"]]

    if "Satellite" in selected_tile:
        m = folium.Map(
            location=map_center,
            zoom_start=14,
            tiles=None
        )
        folium.TileLayer(
            tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attr="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            name="ESRI World Imagery"
        ).add_to(m)
    elif "OpenStreetMap" in selected_tile:
        m = folium.Map(
            location=map_center,
            zoom_start=14,
            tiles="OpenStreetMap"
        )
    elif "OpenTopoMap" in selected_tile:
        m = folium.Map(
            location=map_center,
            zoom_start=14,
            tiles="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            attr="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)",
            name="OpenTopoMap"
        )
    else:
        m = folium.Map(
            location=map_center,
            zoom_start=14,
            tiles="CartoDB positron"
        )

    # MiniMap for Professional GIS
    MiniMap(toggle_display=True, position="bottomright").add_to(m)

    # 6. HOTSPOT DENSITY HEATMAP LAYER
    if selected_layer in ["Density Heatmap", "Combined Multi-Layer"] and not gis_filtered_df.empty:
        heat_data = [
            [
                float(row["latitude"]),
                float(row["longitude"]),
                1.0 if row["risk"] == "HIGH" else (0.6 if row["risk"] == "MEDIUM" else 0.3)
            ]
            for _, row in gis_filtered_df.iterrows()
        ]
        HeatMap(
            heat_data,
            radius=26,
            blur=18,
            min_opacity=0.35,
            gradient={0.2: "#4ade80", 0.5: "#facc15", 0.8: "#f97316", 1.0: "#ef4444"}
        ).add_to(m)

    # 7. MARKER CLUSTERING OR DIRECT MARKERS
    if selected_layer in ["Marker Clustering", "Combined Multi-Layer"]:
        marker_target = MarkerCluster(name="Wildlife Sightings").add_to(m)
    else:
        marker_target = m

    # Plot all filtered wildlife detections
    for _, row in gis_filtered_df.iterrows():
        if row["risk"] == "HIGH":
            marker_color = "red"
            icon_name = "warning-sign"
            tag_color = "#ef4444"
            tag_bg = "rgba(239, 68, 68, 0.16)"
            action_advice = "Perimeter warning triggered. Maintain safe distance."
            buf_color = "red"
            buf_radius = 300
        elif row["risk"] == "MEDIUM":
            marker_color = "orange"
            icon_name = "eye-open"
            tag_color = "#f59e0b"
            tag_bg = "rgba(245, 158, 11, 0.16)"
            action_advice = "Corridor tracking active. Precautionary watch."
            buf_color = "orange"
            buf_radius = 200
        else:
            marker_color = "green"
            icon_name = "ok-sign"
            tag_color = "#10b981"
            tag_bg = "rgba(16, 185, 129, 0.16)"
            action_advice = "Routine observation. Buffer zone maintained."
            buf_color = "green"
            buf_radius = 120

        popup_html = f"""
        <div style="font-family:'Plus Jakarta Sans',sans-serif;width:245px;padding:4px;color:#1e293b;line-height:1.5;">
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">
                <span style="font-size:1.15rem;font-weight:850;color:#0f2419;">{row['emoji']} {row['species']}</span>
                <span style="background:{tag_bg};color:{tag_color};font-size:0.70rem;font-weight:800;padding:3px 8px;border-radius:12px;border:1px solid {tag_color};">{row['risk']} RISK</span>
            </div>
            <div style="font-size:0.80rem;margin-bottom:4px;">
                <b>AI Confidence:</b> {row['confidence'] * 100:.1f}%
            </div>
            <div style="font-size:0.80rem;margin-bottom:4px;">
                <b>Detected:</b> {row['time_formatted']}
            </div>
            <div style="font-size:0.80rem;margin-bottom:4px;">
                <b>Station Node:</b> {row['node_id']}
            </div>
            <div style="font-size:0.75rem;color:#64748b;margin-bottom:6px;">
                Coords: {row['latitude']:.4f}° N, {row['longitude']:.4f}° E
            </div>
            <div style="font-size:0.74rem;color:{tag_color};font-weight:750;background:{tag_bg};padding:6px 8px;border-radius:8px;border-left:3px solid {tag_color};">
                {action_advice}
            </div>
        </div>
        """

        folium.Marker(
            location=[row["latitude"], row["longitude"]],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=f"{row['emoji']} {row['species']} ({row['risk']} Risk • {row['confidence']*100:.0f}%)",
            icon=folium.Icon(color=marker_color, icon=icon_name)
        ).add_to(marker_target)

        # Risk Buffer Circles
        if show_buffers:
            folium.Circle(
                location=[row["latitude"], row["longitude"]],
                radius=buf_radius,
                color=buf_color,
                fill=True,
                fill_color=buf_color,
                fill_opacity=0.12,
                weight=1.5,
                dash_array="4, 4",
                tooltip=f"{row['species']} Coexistence Buffer ({buf_radius}m)"
            ).add_to(m)

    # 8. MONITORING NODE STATIONS
    for node_name, node_info in MONITORING_NODES.items():
        node_lat = float(node_info["latitude"])
        node_lon = float(node_info["longitude"])
        node_id_code = str(node_info["node_id"])
        folium.CircleMarker(
            location=[node_lat, node_lon],
            radius=8,
            color="#059669",
            fill=True,
            fill_color="#10b981",
            fill_opacity=0.85,
            popup=f"<b>Sensor Node</b><br>{node_name} ({node_id_code})<br>Coords: {node_lat:.4f}° N, {node_lon:.4f}° E",
            tooltip=f"Sensor Node: {node_name}"
        ).add_to(m)

    # 9. AI PREDICTIVE TRAJECTORY & HISTORICAL CORRIDORS
    next_loc = spatial_intel["predicted_next_location"]

    folium.Marker(
        location=next_loc,
        popup="<b>AI Predicted Location</b><br>Estimated wildlife trajectory point",
        tooltip="AI Predicted Location",
        icon=folium.Icon(color="blue", icon="arrow-up")
    ).add_to(m)

    folium.PolyLine(
        locations=[
            [latest["latitude"], latest["longitude"]],
            next_loc
        ],
        color="#8b5cf6",
        weight=4,
        dash_array="6, 6",
        tooltip="AI Predicted Movement Corridor"
    ).add_to(m)

    for corr in spatial_intel["corridors"]:
        folium.Circle(
            location=[corr["lat"], corr["lon"]],
            radius=180,
            color="#f97316",
            fill=True,
            fill_color="#f97316",
            fill_opacity=0.25,
            tooltip=f"Wildlife Corridor ({corr['count']} crossings)"
        ).add_to(m)

    # 10. TACTICAL GIS MAP LEGEND
    legend_html = """
    <div style="
        position: fixed;
        bottom: 28px;
        left: 28px;
        z-index: 9999;
        background: rgba(7, 24, 15, 0.90);
        backdrop-filter: blur(10px);
        padding: 14px 18px;
        border-radius: 14px;
        border: 1.5px solid rgba(74, 222, 128, 0.35);
        box-shadow: 0 10px 30px rgba(0,0,0,0.45);
        font-size: 12px;
        color: #e2f5e9;
        line-height: 1.8;
        font-family: 'Plus Jakarta Sans', sans-serif;
    ">
        <div style="font-weight:850;color:#ffffff;font-size:13px;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:4px;">
            <i class="fa-solid fa-map-location-dot" style="margin-right:6px;color:#34d399;"></i>GIS Layer Legend
        </div>
        <div><i class="fa-solid fa-circle" style="color:#ef4444;font-size:10px;margin-right:6px;"></i><span style="color:#fca5a5;font-weight:750;">High Risk</span> (Tiger, Leopard, Elephant, Bear)</div>
        <div><i class="fa-solid fa-circle" style="color:#eab308;font-size:10px;margin-right:6px;"></i><span style="color:#fef08a;font-weight:750;">Medium Risk</span> (Hyena, Boar, Jackal, Monkey)</div>
        <div><i class="fa-solid fa-circle" style="color:#22c55e;font-size:10px;margin-right:6px;"></i><span style="color:#bbf7d0;font-weight:750;">Low Risk</span> (Deer, Fox, Herbivores)</div>
        <div><i class="fa-solid fa-radio" style="color:#34d399;font-size:11px;margin-right:6px;"></i><span style="color:#34d399;font-weight:750;">Sensor Nodes</span> (Camera Traps)</div>
        <div><i class="fa-solid fa-location-arrow" style="color:#3b82f6;font-size:11px;margin-right:6px;"></i><span style="color:#93c5fd;font-weight:750;">Predicted Trajectory</span> (AI Corridor Path)</div>
        <div><i class="fa-solid fa-route" style="color:#f97316;font-size:11px;margin-right:6px;"></i><span style="color:#fdba74;font-weight:750;">Historical Corridor</span> (Crossings Zone)</div>
    </div>
    """

    m.get_root().html.add_child(folium.Element(legend_html))

    # 11. DISPLAY GIS MAP
    st_folium(
        m,
        width=1200,
        height=540
    )


    # ======================================
    # INGESTION LOGS
    # ======================================

    st.markdown("---")

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-list-check" style="margin-right:8px;color:#34d399;"></i>Ingestion Logs'
        '</div>',
        unsafe_allow_html=True
    )


    st.dataframe(

        df[
            [
                "id",
                "timestamp",
                "node_id",
                "species",
                "confidence",
                "latitude",
                "longitude"
            ]
        ].head(10),

        use_container_width=True

    )


    # ======================================
    # ALERT HISTORY & ANALYTICS
    # ======================================

    st.markdown("---")

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-chart-pie" style="margin-right:8px;color:#34d399;"></i>Monitoring Overview'
        '</div>',
        unsafe_allow_html=True
    )

    st.html('<div id="analytics"></div>')

    history_records = []

    for _, row in df.iterrows():
        try:
            history_habitat = HabitatService.get_habitat_features(
                row["latitude"],
                row["longitude"]
            )

            history_risk = calculate_prototype_risk(
                species=row["species"],
                confidence=row["confidence"],
                ndvi=history_habitat["ndvi"],
                dist_water=history_habitat["dist_water_m"],
                slope=history_habitat["slope_deg"]
            )

            history_records.append(history_risk["risk"])

        except Exception:
            history_records.append("LOW")

    total_detections = len(history_records)
    high_risk_count = history_records.count("HIGH")
    medium_risk_count = history_records.count("MEDIUM")
    low_risk_count = history_records.count("LOW")

    st.html(
        f"""
        <div class="stat-button-grid">
            <!-- 1. TOTAL DETECTIONS BUTTON SQUARE -->
            <div class="stat-button-square stat-square-total">
                <div class="stat-btn-top">
                    <span class="stat-pill stat-pill-emerald"><i class="fa-solid fa-layer-group" style="margin-right:4px;"></i>ALL SENSORS</span>
                    <div class="stat-led-dot led-emerald"></div>
                </div>
                <div class="stat-btn-body">
                    <div class="stat-number stat-num-white">{total_detections}</div>
                    <div class="stat-title">Total Detections</div>
                    <div class="stat-desc">Active Camera Nodes</div>
                </div>
                <div class="stat-btn-footer">
                    <span class="stat-foot-tag"><i class="fa-solid fa-circle" style="font-size:7px;margin-right:4px;"></i>Live Telemetry Stream</span>
                    <span class="stat-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
            </div>

            <!-- 2. HIGH RISK BUTTON SQUARE -->
            <div class="stat-button-square stat-square-high">
                <div class="stat-btn-top">
                    <span class="stat-pill stat-pill-red"><i class="fa-solid fa-triangle-exclamation" style="margin-right:4px;"></i>CRITICAL ALERT</span>
                    <div class="stat-led-dot led-red"></div>
                </div>
                <div class="stat-btn-body">
                    <div class="stat-number stat-num-red">{high_risk_count}</div>
                    <div class="stat-title">High Risk Threats</div>
                    <div class="stat-desc">Perimeter Action Required</div>
                </div>
                <div class="stat-btn-footer">
                    <span class="stat-foot-tag-red"><i class="fa-solid fa-circle" style="font-size:7px;margin-right:4px;"></i>Immediate Response</span>
                    <span class="stat-arrow-red"><i class="fa-solid fa-triangle-exclamation"></i></span>
                </div>
            </div>

            <!-- 3. MEDIUM RISK BUTTON SQUARE -->
            <div class="stat-button-square stat-square-med">
                <div class="stat-btn-top">
                    <span class="stat-pill stat-pill-amber"><i class="fa-solid fa-circle-exclamation" style="margin-right:4px;"></i>ELEVATED RISK</span>
                    <div class="stat-led-dot led-amber"></div>
                </div>
                <div class="stat-btn-body">
                    <div class="stat-number stat-num-amber">{medium_risk_count}</div>
                    <div class="stat-title">Medium Risk Events</div>
                    <div class="stat-desc">Corridor Tracking Active</div>
                </div>
                <div class="stat-btn-footer">
                    <span class="stat-foot-tag-amber"><i class="fa-solid fa-circle" style="font-size:7px;margin-right:4px;"></i>Precautionary Watch</span>
                    <span class="stat-arrow-amber"><i class="fa-solid fa-bolt"></i></span>
                </div>
            </div>

            <!-- 4. LOW RISK BUTTON SQUARE -->
            <div class="stat-button-square stat-square-low">
                <div class="stat-btn-top">
                    <span class="stat-pill stat-pill-green"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i>ROUTINE SAFE</span>
                    <div class="stat-led-dot led-green"></div>
                </div>
                <div class="stat-btn-body">
                    <div class="stat-number stat-num-green">{low_risk_count}</div>
                    <div class="stat-title">Low Risk Activity</div>
                    <div class="stat-desc">Buffer Zone Maintained</div>
                </div>
                <div class="stat-btn-footer">
                    <span class="stat-foot-tag-green"><i class="fa-solid fa-circle" style="font-size:7px;margin-right:4px;"></i>Normal Habitat Observation</span>
                    <span class="stat-arrow-green"><i class="fa-solid fa-check"></i></span>
                </div>
            </div>
        </div>
        """
    )

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-chart-line" style="margin-right:8px;color:#34d399;"></i>Detection Analytics'
        '</div>',
        unsafe_allow_html=True
    )

    analytics_col1, analytics_col2 = st.columns(2)

    with analytics_col1:
        st.markdown("#### Species Distribution")
        species_counts = (
            df["species"]
            .value_counts()
            .rename_axis("Species")
            .to_frame("Detections")
        )
        st.bar_chart(species_counts, height=280)

    with analytics_col2:
        st.markdown("#### Risk Distribution")
        risk_counts = (
            pd.Series(history_records, name="Detections")
            .value_counts()
            .reindex(["HIGH", "MEDIUM", "LOW"], fill_value=0)
            .rename_axis("Risk")
            .to_frame()
        )
        st.bar_chart(risk_counts, height=280)

    st.markdown(
        '<div class="section-heading">'
        '<i class="fa-solid fa-table-list" style="margin-right:8px;color:#34d399;"></i>Recent Wildlife Incidents'
        '</div>',
        unsafe_allow_html=True
    )

    incident_rows = []

    for _, row in df.head(10).iterrows():
        try:
            incident_habitat = HabitatService.get_habitat_features(
                row["latitude"],
                row["longitude"]
            )

            incident_risk = calculate_prototype_risk(
                species=row["species"],
                confidence=row["confidence"],
                ndvi=incident_habitat["ndvi"],
                dist_water=incident_habitat["dist_water_m"],
                slope=incident_habitat["slope_deg"]
            )

            risk_value = incident_risk["risk"]

        except Exception:
            risk_value = "LOW"

        try:
            formatted_time = datetime.fromisoformat(
                str(row["timestamp"]).replace("Z", "+00:00")
            ).strftime("%d %b %Y • %H:%M")
        except Exception:
            formatted_time = str(row["timestamp"])

        incident_rows.append({
            "Time": formatted_time,
            "Species": row["species"],
            "Confidence": f"{row['confidence'] * 100:.0f}%",
            "Risk": risk_value,
            "Status": str(row.get("status", "ACTIVE")).upper(),
            "Node": row["node_id"]
        })

    incident_df = pd.DataFrame(incident_rows)

    filter_col1, filter_col2, filter_col3, filter_col4 = st.columns(4)

    with filter_col1:
        risk_filter = st.selectbox(
            "Risk level",
            ["All", "HIGH", "MEDIUM", "LOW"],
            key="incident_risk_filter"
        )

    with filter_col2:
        status_filter = st.selectbox(
            "Incident status",
            ["All"] + sorted(incident_df["Status"].unique().tolist()),
            key="incident_status_filter"
        )

    with filter_col3:
        species_filter = st.selectbox(
            "Species",
            ["All"] + sorted(incident_df["Species"].unique().tolist()),
            key="incident_species_filter"
        )

    with filter_col4:
        node_filter = st.selectbox(
            "Monitoring location",
            ["All"] + sorted(incident_df["Node"].unique().tolist()),
            key="incident_node_filter"
        )

    filtered_incidents = incident_df.copy()

    if risk_filter != "All":
        filtered_incidents = filtered_incidents[
            filtered_incidents["Risk"] == risk_filter
        ]

    if status_filter != "All":
        filtered_incidents = filtered_incidents[
            filtered_incidents["Status"] == status_filter
        ]

    if species_filter != "All":
        filtered_incidents = filtered_incidents[
            filtered_incidents["Species"] == species_filter
        ]

    if node_filter != "All":
        filtered_incidents = filtered_incidents[
            filtered_incidents["Node"] == node_filter
        ]

    st.dataframe(
        filtered_incidents,
        use_container_width=True,
        hide_index=True
    )

    st.download_button(
        "Download filtered incident report (CSV)",
        data=filtered_incidents.to_csv(index=False).encode("utf-8"),
        file_name="wildcare_incident_report.csv",
        mime="text/csv",
        use_container_width=False
    )


# ==========================================
# NO DATA STATE
# ==========================================

else:

    st.info(
        "No live detections recorded yet. "
        "Start `run_inference.py` to transmit "
        "detection telemetry."
    )


# ==========================================
# REFRESH
# ==========================================

if st.button("Refresh Telemetry"):

    st.rerun()
