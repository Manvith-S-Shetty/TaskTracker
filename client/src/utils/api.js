// Retrieve backend URL prefix from client env configurations (defaults to '/api')
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to process the response and parse JSON.
 * Throws a formatted error if response is not successful.
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    // Occurs when response is not JSON (e.g. proxy error HTML page, server offline, or ETIMEDOUT)
    throw new Error(`Server connection error (HTTP ${response.status}). Please verify that your backend server is running and database is connected.`);
  }
  
  if (!response.ok) {
    // Extract the custom error message returned by our server's errorHandler middleware
    const errorMsg = data.error || 'Something went wrong';
    throw new Error(errorMsg);
  }
  
  return data;
};

/**
 * API client exposing async methods for our Task Tracker backend endpoints.
 */
export const api = {
  /**
   * Fetch all tasks with optional search, filtering, and sorting parameters.
   */
  async getTasks(params = {}) {
    const { search, status, sort } = params;
    
    // Construct query parameters using URLSearchParams
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status && status !== 'all') query.append('status', status);
    if (sort) query.append('sort', sort);
    
    const queryString = query.toString();
    const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetch a single task by ID.
   */
  async getTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new task.
   */
  async createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing task.
   */
  async updateTask(id, taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  /**
   * Delete a task.
   */
  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
