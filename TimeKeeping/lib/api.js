import axios from 'axios';

const API_URL = 'http://localhost:3002/api';
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      console.log("tokenApi : ", token )
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      clearAuthData();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth token management
export const setAuthToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// User data management
export const setUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// API endpoints for users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch users');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/users');
    if (response.data.status === 200) {
      // Filter only admin users
      return response.data.data.filter(user => user.role === 'admin');
    }
    throw new Error(response.data.message || 'Failed to fetch admin users');
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const getAdminById = async (adminId) => {
  try {
    const response = await api.get(`/users/${adminId}`);
    
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch admin details');
  } catch (error) {
    console.error('Error fetching admin details:', error);
    throw error;
  }
};

export const getAllDevices = async () => {
  try {
    const response = await api.get('/devices');
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch devices');
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export const getDeviceById = async (deviceId) => {
  try {
    const response = await api.get(`/devices/${deviceId}`);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch device details');
  } catch (error) {
    console.error('Error fetching device details:', error);
    throw error;
  }
};

export const createDevice = async (deviceData) => {
  try {
    const response = await api.post('/devices', deviceData);
    console.log("response = ", response)
    console.log("response.data = ", response.data)

    if (response.data.status === 201) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create device');
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
};

export const updateDevice = async (deviceId, deviceData) => {
  try {
    const response = await api.put(`/devices/${deviceId}`, deviceData);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update device');
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};

export const deleteDevice = async (deviceId) => {
  try {
    const response = await api.delete(`/devices/${deviceId}`);
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to delete device');
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
      // If data is invalid, remove it from storage
      removeUserData();
      return null;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

export const removeUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Clear all auth data
export const clearAuthData = () => {
  removeAuthToken();
  removeUserData();
};

export const createAdmin = async (adminData) => {
  try {
    
    console.log("formDataAdmin = " , adminData)
    const response = await api.post('/users', adminData);
    
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create admin');
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const updateAdminPassword = async (adminId, password) => {
  try {
    const response = await api.put(`/users/${adminId}/password`, { password });
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update password');
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const removeAdminRole = async (adminId) => {
  try {
    const response = await api.put(`/users/${adminId}/role`, { role: 'user' });
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to remove admin role');
  } catch (error) {
    console.error('Error removing admin role:', error);
    throw error;
  }
};

export const assignDevicesToAdmin = async (adminId, deviceIds) => {
  try {
    const response = await api.put('/users/assign-devices', {
      adminId,
      deviceIds
    });
    if (response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to assign devices');
  } catch (error) {
    console.error('Error assigning devices:', error);
    throw error;
  }
};

export default api; 