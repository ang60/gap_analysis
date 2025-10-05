import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  organizationId?: number;
  domain?: string;
}

export interface Organization {
  id: number;
  name: string;
  domain: string;
  subdomain?: string;
  isActive: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  branchId?: number;
  organizationId?: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  organizationId: number;
  organization?: {
    id: number;
    name: string;
    domain: string;
    subdomain?: string;
  };
  branchId?: number;
  branch?: {
    id: number;
    name: string;
    region: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // Login user (standard login)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    // Get tokens from response data (backend now returns them)
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    // Store tokens in localStorage for client-side access
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return {
      user: response.data.user,
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };
  },

  // Login to specific organization
  async loginToOrganization(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login/organization', credentials);
    
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return {
      user: response.data.user,
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };
  },

  // Login by domain
  async loginByDomain(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login/domain', credentials);
    
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return {
      user: response.data.user,
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };
  },

  // Get available organizations
  async getOrganizations(): Promise<Organization[]> {
    const response = await api.get('/organizations');
    return response.data;
  },

  // Get organization by domain
  async getOrganizationByDomain(domain: string): Promise<Organization> {
    const response = await api.get(`/organizations/domain/${domain}`);
    return response.data;
  },

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    
    // Get tokens from response data (backend now returns them)
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    // Store tokens in localStorage for client-side access
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return {
      user: response.data.user,
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if it exists
      await api.post('/auth/logout');
    } catch (error: unknown) {
      // If logout endpoint doesn't exist (404) or any other error, 
      // just log it but don't throw - logout should always succeed client-side
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response &&
          error.response.status === 404) {
        console.log('Logout endpoint not available, proceeding with client-side logout');
      } else {
        console.error('Logout error:', error);
      }
    } finally {
      // Always clear tokens from localStorage regardless of backend response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    return { accessToken };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },
};
