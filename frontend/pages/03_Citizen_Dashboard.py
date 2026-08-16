"""
WildCare Platform — Citizen Safety Dashboard
Dedicated view for farmers, villagers, and community members.
"""

import sys
import os
import requests
import pandas as pd
import streamlit as st
import folium
from streamlit_folium import st_folium

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from auth import render_user_header, get_current_user, get_auth_headers, is_authenticated

st.set_page_config(
    page_title="Citizen Safety | WildCare",
    page_icon=":shield:",
    layout="wide"
)

st.markdown("""
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.citizen-hero {
    background: linear-gradient(135deg, #071c12 0%, #0d2e1f 100%);
    border: 1px solid rgba(52, 211, 153, 0.25);
    border-radius: 18px;
    padding: 26px 30px;
    margin-bottom: 24px;
}

.alert-banner-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(127, 29, 29, 0.25));
    border: 1px solid #f87171;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 20px;
}

.mock-sms-box {
    background: #0f172a;
    border: 2px dashed #38bdf8;
    border-radius: 14px;
    padding: 18px;
    font-family: monospace;
    color: #e2e8f0;
    margin: 15px 0;
}

.report-status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 800;
}

.badge-pending { background: rgba(234,179,8,0.2); color: #eab308; border: 1px solid #eab308; }
.badge-verified { background: rgba(34,197,94,0.2); color: #22c55e; border: 1px solid #22c55e; }
.badge-rejected { background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; }
</style>
""", unsafe_allow_html=True)


render_user_header()
user = get_current_user() or {}
user_name = user.get("name", "Citizen")
user_village = user.get("village", "Hassan Rural")

st.markdown(
    f"""
    <div class="citizen-hero">
        <div style="font-size:0.80rem;color:#4ade80;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
            🌿 CITIZEN COMMUNITY DASHBOARD
        </div>
        <h2 style="color:#ffffff;font-weight:850;margin-top:4px;">Good day, {user_name}</h2>
        <p style="color:#a7f3d0;font-size:0.95rem;margin:0;">
            Stay informed on wildlife movement near <b>{user_village}</b>. Report sightings directly to local forest officers.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

# 1. SUMMARY CARDS
m1, m2, m3, m4 = st.columns(4)

with m1:
    st.markdown(
        """
        <div style="background:#0e2017;border:1px solid #1e4530;border-radius:14px;padding:18px;text-align:center;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;">NEARBY RISK</div>
            <div style="font-size:1.6rem;font-weight:900;color:#ef4444;margin-top:4px;">HIGH</div>
            <div style="font-size:0.72rem;color:#fca5a5;">Elephant corridor active</div>
        </div>
        """,
        unsafe_allow_html=True
    )

with m2:
    st.markdown(
        """
        <div style="background:#0e2017;border:1px solid #1e4530;border-radius:14px;padding:18px;text-align:center;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;">ACTIVE ALERTS</div>
            <div style="font-size:1.6rem;font-weight:900;color:#fbbf24;margin-top:4px;">03</div>
            <div style="font-size:0.72rem;color:#fde68a;">Within 5km radius</div>
        </div>
        """,
        unsafe_allow_html=True
    )

with m3:
    st.markdown(
        """
        <div style="background:#0e2017;border:1px solid #1e4530;border-radius:14px;padding:18px;text-align:center;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;">RECENT SIGHTINGS</div>
            <div style="font-size:1.6rem;font-weight:900;color:#38bdf8;margin-top:4px;">12</div>
            <div style="font-size:0.72rem;color:#bae6fd;">Last 24 hours</div>
        </div>
        """,
        unsafe_allow_html=True
    )

with m4:
    st.markdown(
        """
        <div style="background:#0e2017;border:1px solid #1e4530;border-radius:14px;padding:18px;text-align:center;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;">YOUR REPORTS</div>
            <div style="font-size:1.6rem;font-weight:900;color:#4ade80;margin-top:4px;">02</div>
            <div style="font-size:0.72rem;color:#bbf7d0;">Submitted & Verified</div>
        </div>
        """,
        unsafe_allow_html=True
    )

st.markdown("<br>", unsafe_allow_html=True)


# 2. MAIN LAYOUT: ALERTS & REPORT CTA
col_left, col_right = st.columns([3, 2])

with col_left:
    st.markdown("### <i class='fa-solid fa-bell' style='color:#f87171;'></i> Live Safety Alerts Near You", unsafe_allow_html=True)

    st.markdown(
        """
        <div class="alert-banner-danger">
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="background:#ef4444;color:#ffffff;font-size:0.72rem;font-weight:850;padding:3px 10px;border-radius:10px;">⚠ CRITICAL ELEPHANT ALERT</span>
                <span style="font-size:0.80rem;color:#fca5a5;">2.4 km from {village} • 15 mins ago</span>
            </div>
            <div style="font-size:1.15rem;font-weight:800;color:#ffffff;margin-top:10px;">
                Elephant herd detected moving towards East Agriculture Buffer
            </div>
            <div style="font-size:0.85rem;color:#fee2e2;margin-top:8px;line-height:1.5;">
                <b>Recommended Safety Advice:</b><br>
                • Avoid forest-edge roads and farm plots after dusk.<br>
                • Keep cattle secured inside covered shelters.<br>
                • Do not approach or attempt to photograph wildlife.
            </div>
        </div>
        """.format(village=user_village),
        unsafe_allow_html=True
    )

    # MOCK SMS PREVIEW PANEL
    st.markdown("#### <i class='fa-solid fa-mobile-screen-button' style='color:#38bdf8;'></i> Live Notification Gateway (SMS Preview)", unsafe_allow_html=True)
    st.markdown(
        """
        <div class="mock-sms-box">
            <div style="color:#38bdf8;font-weight:bold;margin-bottom:6px;">📱 MOCK SMS BROADCAST — [DEMO MODE ACTIVE]</div>
            <div>------------------------------------------------</div>
            <div>[FOREST SAFETY ALERT - KFD]</div>
            <div>⚠ Elephant herd movement detected near Belur Village.</div>
            <div>Distance: 2.4 km. Avoid forest roads. Stay indoors after 6:30 PM.</div>
            <div>Emergency Helpline: 1800-425-XXXX</div>
            <div>------------------------------------------------</div>
            <div style="color:#4ade80;font-size:0.75rem;margin-top:6px;">✔ Dispatched to 1,240 registered village mobile numbers</div>
        </div>
        """,
        unsafe_allow_html=True
    )

with col_right:
    st.markdown("### <i class='fa-solid fa-bullhorn' style='color:#4ade80;'></i> Community Action", unsafe_allow_html=True)

    st.markdown(
        """
        <div style="background:linear-gradient(145deg, #132a1e, #0a1710);border:1.5px solid #4ade80;border-radius:16px;padding:24px;text-align:center;">
            <div style="font-size:2.2rem;color:#4ade80;"><i class="fa-solid fa-camera-retro"></i></div>
            <h3 style="color:#ffffff;margin-top:8px;font-weight:800;">Spotted Wildlife Nearby?</h3>
            <p style="color:#a7f3d0;font-size:0.88rem;margin-bottom:18px;">
                Help forest officers protect your community by submitting a quick sighting report.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

    if st.button("📢 REPORT A WILDLIFE SIGHTING", type="primary", use_container_width=True):
        st.switch_page("pages/04_Report_Sighting.py")

    st.markdown("---")

    # MY REPORTS STATUS TIMELINE
    st.markdown("#### <i class='fa-solid fa-list-check' style='color:#34d399;'></i> Your Submitted Reports", unsafe_allow_html=True)

    try:
        res = requests.get("http://localhost:8000/community/reports", headers=get_auth_headers(), timeout=3)
        if res.status_code == 200:
            reports_data = res.json()
            if reports_data:
                for rep in reports_data[:3]:
                    badge_cls = "badge-verified" if rep["status"] == "VERIFIED" else ("badge-pending" if rep["status"] == "PENDING" else "badge-rejected")
                    st.markdown(
                        f"""
                        <div style="background:#091a11;border:1px solid #1a3827;border-radius:12px;padding:12px;margin-bottom:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <b style="color:#ffffff;">{rep['species']}</b>
                                <span class="report-status-badge {badge_cls}">{rep['status']}</span>
                            </div>
                            <div style="font-size:0.75rem;color:#8da496;margin-top:4px;">
                                ID: {rep['report_id']} • {rep['description'][:40]}...
                            </div>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
            else:
                st.caption("You have not submitted any reports yet.")
    except Exception:
        st.caption("Unable to fetch report status right now.")

st.markdown("---")

# 3. NEARBY RISK MAP FOR CITIZENS
st.markdown("### <i class='fa-solid fa-map-location-dot' style='color:#34d399;'></i> Interactive Village Risk Map", unsafe_allow_html=True)

m = folium.Map(location=[19.231, 72.825], zoom_start=13, tiles="CartoDB positron")

folium.Marker(
    location=[19.231, 72.825],
    popup="<b>Village A Perimeter</b><br>Your Approximate Location",
    tooltip="Your Location",
    icon=folium.Icon(color="green", icon="home")
).add_to(m)

folium.Circle(
    location=[19.238, 72.832],
    radius=400,
    color="red",
    fill=True,
    fill_color="red",
    fill_opacity=0.2,
    tooltip="High Elephant Conflict Risk Zone (400m Buffer)"
).add_to(m)

st_folium(m, width=1200, height=400)
