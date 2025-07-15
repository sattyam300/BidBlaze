// API service for auction items
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Auction API
export const auctionAPI = {
  getAuctions: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/auctions?${queryParams}`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  getAuctionById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  createAuction: async (auctionData) => {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(auctionData)
    });
    return handleResponse(response);
  },

  updateAuction: async (id, auctionData) => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(auctionData)
    });
    return handleResponse(response);
  },

  deleteAuction: async (id) => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    return handleResponse(response);
  }
};