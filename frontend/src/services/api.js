import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resourceAPI = {
  // Get all resources
  getResources: async (skip = 0, limit = 100) => {
    try {
      const response = await apiClient.get('/resources/', {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Create a new resource
  createResource: async (resourceData) => {
    try {
      const response = await apiClient.post('/resources/', resourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Get total cost and breakdown
  getCosts: async () => {
    try {
      const response = await apiClient.get('/cost/');
      return response.data;
    } catch (error) {
      console.error('Error fetching costs:', error);
      throw error;
    }
  },

  // Get insights
  getInsights: async () => {
    try {
      const response = await apiClient.get('/insights/');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  },

  // Delete a resource
  deleteResource: async (resourceId) => {
    try {
      const response = await apiClient.delete(`/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Update a resource
  updateResource: async (resourceId, resourceData) => {
    try {
      const response = await apiClient.put(`/resources/${resourceId}`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Export resources data
  exportResources: async () => {
    try {
      const response = await apiClient.get('/export/resources/');
      return response.data;
    } catch (error) {
      console.error('Error exporting resources:', error);
      throw error;
    }
  },
};

export default apiClient;
