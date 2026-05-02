// API Configuration and Service Layer
// ====================================

// Determine API base URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://healthxpress.onrender.com/api';

// Check if backend is running
async function checkBackendConnection() {
  try {
    const baseUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://healthxpress.onrender.com';
    const response = await fetch(`${baseUrl}/health`);
    return response.ok;
  } catch (err) {
    console.warn('Backend not reachable');
    return false;
  }
}

// Get current user ID from localStorage
function getCurrentUserId() {
  return localStorage.getItem('userId');
}

// Set current user in localStorage
function setCurrentUser(user) {
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userEmail', user.email);
}

// Clear current user
function clearCurrentUser() {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}

// ==================== USER API ====================

async function registerUser(name, email, password, phone) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    return await response.json();
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return await response.json();
  } catch (err) {
    console.error('Get user error:', err);
    throw err;
  }
}

// ==================== AMBULANCE API ====================

async function requestAmbulance(userId, location, latitude = null, longitude = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/ambulance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, location, latitude, longitude })
    });
    return await response.json();
  } catch (err) {
    console.error('Ambulance request error:', err);
    throw err;
  }
}

async function getAmbulanceRequests(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/ambulance/${userId}`);
    return await response.json();
  } catch (err) {
    console.error('Get ambulance requests error:', err);
    throw err;
  }
}

async function updateAmbulanceStatus(requestId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/ambulance/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (err) {
    console.error('Update ambulance status error:', err);
    throw err;
  }
}

// ==================== SCHEMES API ====================

async function getSchemes() {
  try {
    const response = await fetch(`${API_BASE_URL}/schemes`);
    return await response.json();
  } catch (err) {
    console.error('Get schemes error:', err);
    throw err;
  }
}

async function getScheme(schemeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/schemes/${schemeId}`);
    return await response.json();
  } catch (err) {
    console.error('Get scheme error:', err);
    throw err;
  }
}

// ==================== DISEASES API ====================

async function getDiseases() {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases`);
    return await response.json();
  } catch (err) {
    console.error('Get diseases error:', err);
    throw err;
  }
}

async function getDisease(diseaseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/${diseaseId}`);
    return await response.json();
  } catch (err) {
    console.error('Get disease error:', err);
    throw err;
  }
}

// ==================== CAMPS API ====================

async function getCamps() {
  try {
    const response = await fetch(`${API_BASE_URL}/camps`);
    return await response.json();
  } catch (err) {
    console.error('Get camps error:', err);
    throw err;
  }
}

async function getCamp(campId) {
  try {
    const response = await fetch(`${API_BASE_URL}/camps/${campId}`);
    return await response.json();
  } catch (err) {
    console.error('Get camp error:', err);
    throw err;
  }
}

// ==================== CONSULTATIONS API ====================

async function createConsultation(userId, type) {
  try {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, type })
    });
    return await response.json();
  } catch (err) {
    console.error('Create consultation error:', err);
    throw err;
  }
}

async function getConsultations(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/consultations/${userId}`);
    return await response.json();
  } catch (err) {
    console.error('Get consultations error:', err);
    throw err;
  }
}

// ==================== AI DOCTOR API ====================

async function getAIDoctorConsultation(disease, symptoms, medicalHistory = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-doctor/consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disease, symptoms, medicalHistory })
    });
    return await response.json();
  } catch (err) {
    console.error('AI Doctor consultation error:', err);
    throw err;
  }
}