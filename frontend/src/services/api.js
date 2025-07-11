import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  }
};

// Client API
export const clientApi = {
  getAll: async () => {
    const response = await apiClient.get('/clients');
    return response.data;
  },
  create: async (clientData) => {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },
  update: async (id, clientData) => {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  }
};

// Project API
export const projectApi = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  create: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  update: async (id, projectData) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }
};

// Invoice API
export const invoiceApi = {
  getAll: async () => {
    const response = await apiClient.get('/invoices');
    return response.data;
  },
  create: async (invoiceData) => {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },
  update: async (id, invoiceData) => {
    const response = await apiClient.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  }
};

export default apiClient;