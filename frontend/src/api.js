import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPatients = async () => {
  const response = await api.get('/view');
  return response.data.data;
};

export const getPatient = async (id) => {
  const response = await api.get(`/patient/${id}`);
  return response.data;
};

export const createPatient = async (patient) => {
  const response = await api.post('/create', patient);
  return response.data;
};

export const updatePatient = async (id, patient) => {
  const response = await api.put(`/edit/${id}`, patient);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};

export const sortPatients = async (sortBy, order = 'asc') => {
  const response = await api.get('/sort', {
    params: { sort_by: sortBy, order },
  });
  return response.data.data;
};

export default api;
