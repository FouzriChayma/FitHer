const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fither-token');
  }
  return null;
};

// Helper function to make authenticated requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Authentication API
export const authAPI = {
  signup: async (name: string, email: string, password: string, role: string = 'user', profilePicture?: string) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, profilePicture }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('fither-token', data.token);
    }
    return data;
  },

  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('fither-token');
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await apiRequest('/auth/me');
    if (response.status === 401) {
      localStorage.removeItem('fither-token');
      return null;
    }
    return response.json();
  },
};

// Sessions API
export const sessionsAPI = {
  getActive: async () => {
    const response = await apiRequest('/sessions/active');
    if (response.status === 401) {
      return [];
    }
    return response.json();
  },

  endSession: async (sessionId: string) => {
    const response = await apiRequest(`/sessions/end/${sessionId}`, {
      method: 'POST',
    });
    return response.json();
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await apiRequest('/users');
    if (response.status === 401) {
      return [];
    }
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await apiRequest(`/users/${userId}`);
    if (response.status === 401 || response.status === 404) {
      return null;
    }
    return response.json();
  },

  update: async (userId: string, name: string, email: string) => {
    const response = await apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  },

  updateStatus: async (userId: string, isActive: boolean) => {
    const response = await apiRequest(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
    return response.ok;
  },

  delete: async (userId: string) => {
    const response = await apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  },

  updateProfilePicture: async (userId: string, profilePicture: string | null) => {
    const response = await apiRequest(`/users/${userId}/profile-picture`, {
      method: 'PATCH',
      body: JSON.stringify({ profilePicture }),
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  },

  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await apiRequest(`/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
};

// Measurements API
export const measurementsAPI = {
  save: async (measurementData: any) => {
    const response = await apiRequest('/measurements', {
      method: 'POST',
      body: JSON.stringify(measurementData),
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  },

  getAll: async () => {
    const response = await apiRequest('/measurements');
    if (response.status === 401) {
      return [];
    }
    if (response.ok) {
      const data = await response.json();
      return data.measurements || [];
    }
    return [];
  },

  getStats: async () => {
    const response = await apiRequest('/measurements/stats');
    if (response.status === 401) {
      return null;
    }
    if (response.ok) {
      const data = await response.json();
      return data.stats || null;
    }
    return null;
  },

  delete: async (measurementId: string) => {
    const response = await apiRequest(`/measurements/${measurementId}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};

export default apiRequest;

