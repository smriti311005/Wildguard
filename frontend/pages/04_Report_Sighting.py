"""
WildCare Platform — Community Sighting Report Form
Allows citizens to report wildlife sightings with GPS pin, photo, and details.
"""

import sys
import os
import requests
import streamlit as st
import folium
from streamlit_folium import st_folium

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from auth import render_user_header, get_auth_headers, is_authenticated

st.set_page_config(
    page_title="Report Sighting | WildCare",
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

.report-card {
    background: linear-gradient(145deg, #0d2017, #06140d);
    border: 1px solid rgba(74, 222, 128, 0.3);
    border-radius: 20px;
    padding: 32px;
    max-width: 800px;
    margin: 0 auto;
}
</style>
""", unsafe_allow_html=True)


render_user_header()

if not is_authenticated():
    st.warning("Please sign in to submit a verified community report.")
    if st.button("Go to Login"):
        st.switch_page("pages/01_Login.py")
    st.stop()


col1, col2, col3 = st.columns([1, 4, 1])

with col2:
    st.markdown(
        """
        <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:2.5rem;color:#4ade80;"><i class="fa-solid fa-bullhorn"></i></div>
            <h2 style="color:#ffffff;font-weight:850;margin-top:6px;">Report Wildlife Sighting</h2>
            <p style="color:#94a3b8;font-size:0.9rem;">
                Your report helps local forest officers track movement and protect surrounding agricultural communities.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

    with st.form("community_report_form"):
        st.markdown("#### 1. Wildlife Details")
        c1, c2 = st.columns(2)
        with c1:
            species = st.selectbox(
                "Observed Species *",
                options=["Elephant", "Leopard", "Tiger", "Bear", "Wild Boar", "Hyena", "Deer", "Wolf / Fox", "Other Species"]
            )
        with c2:
            severity = st.select_slider(
                "Threat / Urgency Level *",
                options=["Normal (Observation)", "Concerning (Near Crop/Road)", "Dangerous (Perimeter Threat)"],
                value="Concerning (Near Crop/Road)"
            )

        st.markdown("#### 2. Location Coordinates")
        st.caption("Enter location coordinates or select a pre-set monitoring zone.")
        c3, c4 = st.columns(2)
        with c3:
            latitude = st.number_input("Latitude (° N) *", value=19.2312, format="%.4f")
        with c4:
            longitude = st.number_input("Longitude (° E) *", value=72.8258, format="%.4f")

        st.markdown("#### 3. Observation Notes & Photo")
        description = st.text_area(
            "Describe the sighting *",
            placeholder="e.g. Single adult elephant spotted crossing the main agricultural road near the water stream.",
            height=100
        )

        photo = st.file_uploader(
            "Upload Photo / Evidence (Optional)",
            type=["jpg", "jpeg", "png"],
            help="Uploading a photo assists forest officers in verifying species and herd size."
        )

        st.markdown("<br>", unsafe_allow_html=True)
        submitted = st.form_submit_button(
            "📢 SUBMIT VERIFIED REPORT",
            type="primary",
            use_container_width=True
        )

        if submitted:
            if not description:
                st.error("Please provide a short description of what you observed.")
            else:
                sev_clean = severity.split(" ")[0]
                payload = {
                    "species": species,
                    "latitude": float(latitude),
                    "longitude": float(longitude),
                    "description": description.strip(),
                    "severity": sev_clean
                }
                with st.spinner("Submitting report to Forest Intelligence API..."):
                    try:
                        res = requests.post(
                            "http://localhost:8000/community/reports",
                            json=payload,
                            headers=get_auth_headers(),
                            timeout=5
                        )
                        if res.status_code == 200:
                            data = res.json()
                            st.success(f"✅ {data['message']}")
                            st.info(f"Report ID: **{data['report_id']}**")
                            st.balloons()
                        else:
                            st.error(f"Error submitting report: {res.text}")
                    except Exception as err:
                        st.error(f"Connection error: {err}")

    st.markdown("---")
    st.markdown("#### Location Visualizer")
    m = folium.Map(location=[latitude, longitude], zoom_start=14)
    folium.Marker(
        location=[latitude, longitude],
        popup=f"Report Pin: {species}",
        tooltip=f"Selected Sighting Location: {latitude:.4f}° N, {longitude:.4f}° E",
        icon=folium.Icon(color="orange", icon="info-sign")
    ).add_to(m)
    st_folium(m, width=700, height=300)
