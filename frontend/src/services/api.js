import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// Intercept requests to attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medipulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: (role) => api.post(`/auth/demo/${role}`),
  getMe: () => api.get('/auth/me')
};

export const healthApi = {
  getLiveTelemetry: () => api.get('/health-sync/live-telemetry'),
  forceRefresh: () => api.post('/health-sync/force-sync'),
  calculateRoute: (data) => api.post('/health-sync/ambulance-route', data),
  getRegionalRisks: () => api.get('/health-sync/regional-risks')
};

export const hospitalApi = {
  getAll: (params) => api.get('/hospitals', { params }),
  getById: (id) => api.get(`/hospitals/${id}`),
  updateBeds: (id, data) => api.put(`/hospitals/${id}/beds`, data),
  toggleSurge: (id, data) => api.put(`/hospitals/${id}/surge-mode`, data)
};

export const bloodApi = {
  searchDonors: (params) => api.get('/blood/donors', { params }),
  registerDonor: (data) => api.post('/blood/register-donor', data),
  triggerSos: (data) => api.post('/blood/urgent-sos', data),
  getActiveSos: () => api.get('/blood/urgent-sos'),
  checkEligibility: (data) => api.post('/blood/check-eligibility', data)
};

export const medicineApi = {
  search: (params) => api.get('/medicines/search', { params }),
  getBanned: () => api.get('/medicines/banned-recalled'),
  calculateSavings: (data) => api.post('/medicines/calculate-savings', data)
};

export const incidentApi = {
  submit: (data) => api.post('/incidents', data),
  getAll: (params) => api.get('/incidents', { params }),
  updateStatus: (id, data) => api.put(`/incidents/${id}/status`, data)
};

export const operationsApi = {
  getAlerts: (params) => api.get('/operations/alerts', { params }),
  publishAlert: (data) => api.post('/operations/alerts', data),
  getAuditLogs: () => api.get('/operations/audit-logs'),
  getSpeedDial: () => api.get('/operations/speed-dial'),
  getVaccines: () => api.get('/operations/vaccines')
};

export default api;
