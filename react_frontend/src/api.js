/**
 * WildCare Frontend API Client
 * In production, VITE_API_URL is set to the Render backend URL.
 * In development, falls back to http://localhost:8000
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');


// Token Storage Helper
export const getAuthToken = () => {
  return localStorage.getItem('wildcare_auth_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('wildcare_auth_token', token);
  } else {
    localStorage.removeItem('wildcare_auth_token');
  }
};

export const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('wildcare_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setSavedUser = (user) => {
  if (user) {
    localStorage.setItem('wildcare_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('wildcare_user');
  }
};

// Generic Fetch Wrapper with Auth Header
async function apiRequest(endpoint, options = {}) {
  const headers = { ...options.headers };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if not sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorDetail = `Request failed (${response.status})`;
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || errorDetail;
      } catch (e) {
        // use default errorDetail
      }
      throw new Error(errorDetail);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// ──────────────────────────────────────────
// AUTH API
// ──────────────────────────────────────────

export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.token) {
    setAuthToken(data.token);
    setSavedUser(data.user);
  }
  return data;
}

export async function signupUser(payload) {
  return await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function logoutUser() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (e) {
    // Ignore network error on logout
  }
  setAuthToken(null);
  setSavedUser(null);
}

export async function getMe() {
  return await apiRequest('/auth/me');
}

export async function getUsers() {
  return await apiRequest('/auth/users');
}

export async function approveUser(userId) {
  return await apiRequest(`/auth/users/${userId}/approve`, {
    method: 'PATCH'
  });
}

// ──────────────────────────────────────────
// ALERTS & DETECTIONS API
// ──────────────────────────────────────────

export async function getAlerts(limit = 50) {
  return await apiRequest(`/api/alerts?limit=${limit}`);
}

export async function createAlert(payload) {
  return await apiRequest('/api/alerts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateAlertStatus(alertId, status) {
  return await apiRequest(`/api/alerts/${alertId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function deleteAlert(alertId) {
  return await apiRequest(`/api/alerts/${alertId}`, {
    method: 'DELETE'
  });
}

// ──────────────────────────────────────────
// AI INFERENCE & PRESETS API
// ──────────────────────────────────────────

export async function getPresets() {
  return await apiRequest('/api/presets');
}

export async function detectWildlife(formData) {
  return await apiRequest('/api/detect', {
    method: 'POST',
    body: formData
  });
}

// ──────────────────────────────────────────
// TELEMETRY & MAP DATA API
// ──────────────────────────────────────────

export async function getStatsOverview() {
  return await apiRequest('/api/stats/overview');
}

export async function getCorridors() {
  return await apiRequest('/api/corridors');
}

export async function getHabitatTelemetry(lat = 19.231, lon = 72.825) {
  return await apiRequest(`/api/habitat/telemetry?lat=${lat}&lon=${lon}`);
}

export async function predictMovement(payload) {
  return await apiRequest('/api/movement/predict', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function recalculateRisk(payload) {
  return await apiRequest('/risk/recalculate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// ──────────────────────────────────────────
// COMMUNITY REPORTS API
// ──────────────────────────────────────────

export async function getCommunityReports() {
  return await apiRequest('/community/reports');
}

export async function submitCommunityReport(payload) {
  return await apiRequest('/community/reports', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function verifyCommunityReport(reportId, status, officerNotes = '') {
  return await apiRequest(`/community/reports/${reportId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status, officer_notes: officerNotes })
  });
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
}
