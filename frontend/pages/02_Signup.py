"""
WildCare Platform — Role-Based Signup Page
Allows users to register as a Citizen or Forest Department Officer.
"""

import sys
import os
import streamlit as st

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from auth import signup_user, is_authenticated

st.set_page_config(
    page_title="Join Platform | WildCare Forest Intelligence",
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

.signup-header {
    text-align: center;
    margin-bottom: 24px;
}

.role-card-box {
    border: 2px solid #1e3a2b;
    background: linear-gradient(145deg, #0e2017, #071710);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.role-card-box.selected {
    border-color: #4ade80;
    box-shadow: 0 0 16px rgba(74, 222, 128, 0.25);
}

.role-title {
    font-weight: 800;
    font-size: 1.1rem;
    color: #ffffff;
}

.role-desc {
    font-size: 0.80rem;
    color: #94a3b8;
    margin-top: 4px;
}
</style>
""", unsafe_allow_html=True)


if is_authenticated():
    st.info("You are already signed in.")
    if st.button("Go to Dashboard"):
        st.switch_page("app.py")
    st.stop()


col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown(
        """
        <div class="signup-header">
            <div style="font-size:2.5rem;color:#4ade80;"><i class="fa-solid fa-shield-cat"></i></div>
            <h2 style="color:#ffffff;font-weight:850;margin-top:8px;">Join Forest Intelligence Platform</h2>
            <p style="color:#94a3b8;font-size:0.9rem;">Select your role to access customized dashboards and workflows.</p>
        </div>
        """,
        unsafe_allow_html=True
    )

    role_choice = st.radio(
        "Who are you?",
        options=["🌿 Citizen / Farmer / Local Community", "🛡️ Forest Department / Officer"],
        index=0,
        horizontal=True,
        help="Forest Officers require official verification before gaining command access."
    )

    is_officer = "Forest Department" in role_choice
    selected_role = "FOREST_OFFICER" if is_officer else "CITIZEN"

    if is_officer:
        st.warning(
            "🛡️ **Forest Officer Accounts** require verification by department administrators. "
            "You can log in once your officer ID is approved."
        )

    st.markdown("---")

    with st.form("signup_form"):
        st.markdown(f"#### Account Information ({'Forest Officer' if is_officer else 'Citizen'})")

        col_a, col_b = st.columns(2)
        with col_a:
            name = st.text_input("Full Name *", placeholder="e.g. Ramesh Kumar")
            email = st.text_input("Official / Personal Email *", placeholder="e.g. ramesh@karnataka.gov.in")
            phone = st.text_input("Mobile Number *", placeholder="e.g. +91 9876543210")

        with col_b:
            password = st.text_input("Password *", type="password", placeholder="••••••••")
            confirm_password = st.text_input("Confirm Password *", type="password", placeholder="••••••••")
            district = st.selectbox(
                "District *",
                options=["Hassan", "Kodagu", "Chikmagalur", "Mysuru", "Chamarajanagar", "Other"]
            )

        if not is_officer:
            village = st.text_input("Village / Panchayat Name", placeholder="e.g. Belur Village")
            department = ""
            designation = ""
            employee_id = ""
        else:
            village = ""
            col_c, col_d = st.columns(2)
            with col_c:
                department = st.text_input("Department Name *", placeholder="e.g. Karnataka Forest Department")
                employee_id = st.text_input("Employee / Officer ID *", placeholder="e.g. KFD-2026-4412")
            with col_d:
                designation = st.selectbox(
                    "Designation *",
                    options=["Range Forest Officer (RFO)", "Deputy RFO", "Forest Watcher", "GIS Analyst", "Department Admin"]
                )

        terms = st.checkbox("I agree to the platform safety terms and accurate reporting guidelines.")

        submitted = st.form_submit_button(
            "CREATE ACCOUNT",
            type="primary",
            use_container_width=True
        )

        if submitted:
            if not name or not email or not password or not phone:
                st.error("Please fill in all required fields marked with *.")
            elif password != confirm_password:
                st.error("Passwords do not match.")
            elif not terms:
                st.error("Please accept the platform safety terms to continue.")
            else:
                payload = {
                    "name": name.strip(),
                    "email": email.strip(),
                    "phone": phone.strip(),
                    "password": password,
                    "role": selected_role,
                    "district": district,
                    "village": village.strip(),
                    "department": department.strip(),
                    "designation": designation,
                    "employee_id": employee_id.strip()
                }
                with st.spinner("Registering user with backend API..."):
                    result = signup_user(payload)
                    if result["success"]:
                        data = result["data"]
                        st.success(f"✅ {data['message']}")
                        if selected_role == "FOREST_OFFICER":
                            st.info("Your account is pending admin verification. You can log in once approved.")
                        else:
                            st.info("Account created! Please sign in using your credentials.")
                        st.balloons()
                    else:
                        st.error(result["error"])

    st.markdown("---")
    st.markdown(
        """
        <div style="text-align:center;font-size:0.9rem;color:#64748b;">
            Already registered? <a href="/Login" target="_self" style="color:#4ade80;font-weight:700;">Sign In Here →</a>
        </div>
        """,
        unsafe_allow_html=True
    )
