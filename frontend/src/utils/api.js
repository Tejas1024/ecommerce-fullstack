// src/utils/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  get: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    return res.json();
  },
  post: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  },
  put: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers });
  }
};

export { API_BASE_URL };