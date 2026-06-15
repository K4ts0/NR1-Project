import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

export const getQuestionnaire = async () => (await api.get('/questionnaire')).data;

export const submitResponse = async (sector, answers, observations) =>
  (await api.post('/responses', { sector, answers, observations })).data;

export const getResponses = async () => (await api.get('/responses')).data;

export const getStats = async () => (await api.get('/reports/stats')).data;

export const getShareLink = async () => (await api.get('/share-link')).data;

export const downloadPdf = async (sector) => {
  const response = await api.get(`/reports/pdf?sector=${sector}`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `relatorio_${sector}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteSector = async (sector) => {
  const response = await api.delete(`/responses/sector/${sector}`);
  return response.data;
};