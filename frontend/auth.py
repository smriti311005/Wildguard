"""
WildCare Frontend Auth Helper
Manages session state, API requests with tokens, and role-based permissions.
"""

import requests
import streamlit as st

API_BASE_URL = "http://localhost:8000"


def init_auth_session():
    """Initializes auth keys in Streamlit session state if not present."""
    if "auth_token" not in st.session_state:
        st.session_state["auth_token"] = None
    if "user" not in st.session_state:
        st.session_state["user"] = None


def is_authenticated() -> bool:
    """Returns True if the current Streamlit session has a valid token and user."""
    init_auth_session()
    return (
        st.session_state.get("auth_token") is not None
        and st.session_state.get("user") is not None
    )


def get_current_user() -> dict:
    """Returns the current user dictionary or None."""
    init_auth_session()
    return st.session_state.get("user")


def get_current_role() -> str:
    """Returns the current user role: 'CITIZEN', 'FOREST_OFFICER', 'ADMIN', or 'GUEST'."""
    user = get_current_user()
    if user and "role" in user:
        return user["role"].upper()
    return "GUEST"


def get_auth_headers() -> dict:
    """Returns Bearer authorization header if logged in."""
    token = st.session_state.get("auth_token")
    if token:
        return {"Authorization": f"Bearer {token}"}
    return {}


def login_user(email: str, password: str) -> dict:
    """Sends login request to FastAPI backend and sets session state."""
    init_auth_session()
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={"email": email, "password": password},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            st.session_state["auth_token"] = data["token"]
            st.session_state["user"] = data["user"]
            return {"success": True, "user": data["user"]}
        else:
            try:
                detail = response.json().get("detail", "Login failed")
            except Exception:
                detail = f"Login failed ({response.status_code})"
            return {"success": False, "error": detail}
    except Exception as e:
        return {"success": False, "error": f"Backend connection error: {str(e)}"}


def signup_user(payload: dict) -> dict:
    """Sends signup request to FastAPI backend."""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/signup",
            json=payload,
            timeout=5
        )
        if response.status_code == 200:
            return {"success": True, "data": response.json()}
        else:
            try:
                detail = response.json().get("detail", "Signup failed")
            except Exception:
                detail = f"Signup failed ({response.status_code})"
            return {"success": False, "error": detail}
    except Exception as e:
        return {"success": False, "error": f"Backend connection error: {str(e)}"}


def logout_user():
    """Logs out the current user and clears session state."""
    init_auth_session()
    token = st.session_state.get("auth_token")
    if token:
        try:
            requests.post(
                f"{API_BASE_URL}/auth/logout",
                headers=get_auth_headers(),
                timeout=3
            )
        except Exception:
            pass
    st.session_state["auth_token"] = None
    st.session_state["user"] = None
    st.rerun()


def render_user_header():
    """Renders a sleek top bar showing current logged-in user, role badge, and logout CTA."""
    init_auth_session()
    user = get_current_user()
    role = get_current_role()

    if not user:
        st.markdown(
            """
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(15,36,25,0.9);padding:10px 18px;border-radius:10px;margin-bottom:15px;color:#d1fae5;font-family:'Plus Jakarta Sans',sans-serif;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="background:rgba(255,255,255,0.1);padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:750;">GUEST USER</span>
                    <span style="font-size:0.85rem;color:#a7f3d0;">Sign in for role-based dashboard access</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
    else:
        role_color = "#34d399" if role == "CITIZEN" else "#f59e0b"
        role_icon = "fa-user" if role == "CITIZEN" else "fa-shield-halved"
        st.markdown(
            f"""
            <div style="display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg, #071910, #0c271a);padding:12px 20px;border-radius:12px;border:1px solid rgba(52,211,153,0.3);margin-bottom:18px;color:#e2f5e9;font-family:'Plus Jakarta Sans',sans-serif;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="background:rgba(52,211,153,0.15);color:{role_color};border:1px solid {role_color};padding:4px 12px;border-radius:16px;font-size:0.75rem;font-weight:800;letter-spacing:0.5px;">
                        <i class="fa-solid {role_icon}" style="margin-right:6px;"></i>{role}
                    </span>
                    <span style="font-weight:750;font-size:0.95rem;color:#ffffff;">{user.get('name')}</span>
                    <span style="font-size:0.80rem;color:#94a3b8;">({user.get('email')})</span>
                </div>
                <div style="font-size:0.80rem;color:#a7f3d0;">
                    District: <b style="color:#ffffff;">{user.get('district', 'N/A')}</b>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
        if st.sidebar.button("🚪 Sign Out", key="auth_logout_sidebar_btn"):
            logout_user()
