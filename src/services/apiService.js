import axios from 'axios';

// Base URL for the Fast Note Sync API.
// Default is empty so the SPA makes same-origin requests (/api/*), letting the
// container's nginx proxy them to the backend. Override at build time with
// REACT_APP_API_BASE_URL only if the API lives on a different origin.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

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

// The Fast Note Sync API returns HTTP 200 even for logical failures, signalling
// the outcome through the body: { code, status, message, details, data }.
// `status` is true on success. Unwrap to `data` and surface failures as errors
// (otherwise the SPA silently shows an empty list — e.g. "vault is a required field").
const unwrap = (response) => {
  const body = response.data || {};
  if (body.status === false) {
    const detail = Array.isArray(body.details) ? body.details.join('; ') : body.details;
    throw new Error(detail ? `${body.message} (${detail})` : body.message || 'Request failed');
  }
  return body.data;
};

// Items from the notes/files endpoints carry only a `path`; derive a display
// name (basename) and a type so the UI components have what they expect.
const decorate = (item) => ({
  ...item,
  name: item.path ? item.path.split('/').pop() : item.path,
  type: 'file',
});

/**
 * Get the list of notes (markdown documents) in a vault.
 * @param {string} token - Authentication token (also applied via interceptor)
 * @param {string} vault - Vault name (required by the API, matched by name not id)
 * @returns {Promise<Array>} List of note objects ({ path, name, ... })
 */
export const getFileList = async (token, vault) => {
  try {
    const response = await apiClient.get('/api/notes', {
      params: {
        vault,
        page: 1,
        page_size: 100,
      },
    });

    const data = unwrap(response);
    const list = (data && data.list) || [];
    return list.map(decorate);
  } catch (error) {
    throw new Error(`Failed to fetch file list: ${error.message}`);
  }
};

/**
 * Get the content of a specific note.
 * @param {string} token - Authentication token (also applied via interceptor)
 * @param {string} vault - Vault name
 * @param {string} path - Note path within the vault
 * @returns {Promise<string>} Note markdown content
 */
export const getFileContent = async (token, vault, path) => {
  try {
    const response = await apiClient.get('/api/note', {
      params: {
        vault,
        path,
      },
    });

    const data = unwrap(response);
    return (data && data.content) || '';
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
};

/**
 * Get metadata for a specific note.
 * @param {string} token - Authentication token (also applied via interceptor)
 * @param {string} vault - Vault name
 * @param {string} path - Note path within the vault
 * @returns {Promise<Object>} Note metadata
 */
export const getFileMetadata = async (token, vault, path) => {
  try {
    const response = await apiClient.get('/api/note', {
      params: {
        vault,
        path,
      },
    });

    return unwrap(response) || {};
  } catch (error) {
    throw new Error(`Failed to fetch file metadata: ${error.message}`);
  }
};
