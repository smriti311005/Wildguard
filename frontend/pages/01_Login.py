"""
WildCare Platform — Login Page
Supports both Citizen and Forest Department logins.
"""

import sys
import os
import streamlit as st

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from auth import login_user, is_authenticated, get_current_user

st.set_page_config(
    page_title="Sign In | WildCare Forest Intelligence",
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

.login-card {
    background: linear-gradient(145deg, #0a1f14, #05140d);
    border: 1px solid rgba(74, 222, 128, 0.25);
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    max-width: 480px;
    margin: 0 auto;
}

.brand-header {
    text-align: center;
    margin-bottom: 28px;
}

.brand-icon {
    font-size: 2.8rem;
    color: #4ade80;
    margin-bottom: 10px;
}

.brand-title {
    font-size: 1.8rem;
    font-weight: 850;
    color: #ffffff;
    letter-spacing: -0.5px;
}

.brand-title span {
    color: #4ade80;
}

.brand-sub {
    font-size: 0.82rem;
    color: #8da496;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
}

.demo-credentials-box {
    background: rgba(74, 222, 128, 0.08);
    border: 1px dashed rgba(74, 222, 128, 0.3);
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 24px;
    font-size: 0.82rem;
    color: #bbf7d0;
}

.demo-credentials-box code {
    background: rgba(0,0,0,0.3);
    color: #4ade80;
    padding: 2px 6px;
    border-radius: 4px;
}
</style>
""", unsafe_allow_html=True)


if is_authenticated():
    user = get_current_user()
    st.success(f"Already signed in as {user.get('name')} ({user.get('role')}).")
    if st.button("Go to Command Dashboard"):
        st.switch_page("app.py")
    st.stop()


# Layout center column
col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown(
        """
        <div class="brand-header">
            <div class="brand-icon"><i class="fa-solid fa-shield-cat"></i></div>
            <div class="brand-title">Wild<span>Care</span></div>
            <div class="brand-sub">Forest & Wildlife Conflict Intelligence Platform</div>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <div class="demo-credentials-box">
            <div><i class="fa-solid fa-key" style="margin-right:6px;"></i><b>Quick Demo Logins:</b></div>
            <div style="margin-top:6px;">
                🛡️ <b>Forest Officer:</b> <code>officer@wildcare.demo</code> / <code>officer123</code><br>
                🌿 <b>Citizen User:</b> <code>citizen@wildcare.demo</code> / <code>citizen123</code>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown("### Sign In to Your Account")

    with st.form("login_form"):
        email = st.text_input(
            "Email or Mobile Number",
            placeholder="officer@wildcare.demo",
            key="login_email"
        )
        password = st.text_input(
            "Password",
            type="password",
            placeholder="••••••••",
            key="login_password"
        )
        remember_me = st.checkbox("Remember me on this device", value=True)

        submitted = st.form_submit_button(
            "SIGN IN TO PLATFORM",
            type="primary",
            use_container_width=True
        )

        if submitted:
            if not email or not password:
                st.error("Please enter both email and password.")
            else:
                with st.spinner("Authenticating with Forest Intelligence API..."):
                    result = login_user(email.strip(), password.strip())
                    if result["success"]:
                        user = result["user"]
                        st.success(f"Welcome back, {user['name']}!")
                        # Redirect based on role
                        if user["role"] == "CITIZEN":
                            st.switch_page("pages/03_Citizen_Dashboard.py")
                        else:
                            st.switch_page("app.py")
                    else:
                        st.error(result["error"])

    st.markdown("---")
    st.markdown(
        """
        <div style="text-align:center;font-size:0.9rem;color:#64748b;">
            Don't have an account yet? <br>
            <a href="/Signup" target="_self" style="color:#4ade80;font-weight:700;">Create Role-Based Account →</a>
        </div>
        """,
        unsafe_allow_html=True
    )
