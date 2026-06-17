import axios from 'axios';

// Base URL for the Fast Note Sync API
// In a real application, this would be configurable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or environment variable
    const token = localStorage.getItem('obsidianToken') || process.env.REACT_APP_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('obsidianToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Get list of files from the vault
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of files
 */
export const getFileList = async (token) => {
  try {
    const response = await apiClient.get('/api/files', {
      params: {
        token,
        // Add any other required parameters here
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch file list: ${error.message}`);
  }
};

/**
 * Get content of a specific file
 * @param {string} token - Authentication token
 * @param {string} path - File path
 * @returns {Promise<string>} File content
 */
export const getFileContent = async (token, path) => {
  try {
    // For binary files, we need to handle the response differently
    const response = await apiClient.get(`/api/file`, {
      params: {
        token,
        path,
        // Add other parameters as needed
      },
      responseType: 'text',
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
};

/**
 * Get metadata for a specific file
 * @param {string} token - Authentication token
 * @param {string} path - File path
 * @returns {Promise<Object>} File metadata
 */
export const getFileMetadata = async (token, path) => {
  try {
    const response = await apiClient.get(`/api/file/info`, {
      params: {
        token,
        path,
        // Add other parameters as needed
      },
    });
    
    return response.data.data || {};
  } catch (error) {
    throw new Error(`Failed to fetch file metadata: ${error.message}`);
  }
};