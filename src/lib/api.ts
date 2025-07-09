import { Customer, Job, User, DashboardStats, ApiResponse, PaginatedResponse, SearchFilters, AnalyticsFilters, AnalyticsDashboardData, AnalyticsOverview, AnalyticsSessionMetrics, AnalyticsEventMetrics, FeatureUsageMetrics, FunnelAnalytics, ABTestResults } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Try to load token from localStorage
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private buildUrl(endpoint: string): string {
    // If API_BASE_URL is a full URL (starts with http), use it directly
    if (API_BASE_URL.startsWith('http')) {
      return `${API_BASE_URL}${endpoint}`;
    }
    // If it's a relative path (like /api), use it as a prefix
    return `${API_BASE_URL}${endpoint}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle Cloudflare-specific errors
        if (response.status === 523) {
          throw new Error('Service temporarily unavailable. Please try again in a moment.');
        }
        if (response.status === 524) {
          throw new Error('Request timeout. The operation took too long to complete.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please contact support if this persists.');
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      
      // Handle network errors (likely Cloudflare Worker offline)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check if the Job Track API is running.');
      }
      
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const response = await this.request<{ success: boolean; token?: string; user?: any; error?: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.token) {
        this.setToken(response.token);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>('/api/dashboard/stats');
    return response;
  }

  // Customer APIs
  async getCustomers(filters?: SearchFilters): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end);
    
    const query = params.toString();
    const response = await this.request<PaginatedResponse<Customer>>(
      `/api/customers${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.request<Customer>(`/api/customers/${id}`);
    return response;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await this.request<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
    return response;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await this.request<Customer>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
    return response;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.request(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Job APIs
  async getJobs(filters?: SearchFilters): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end);
    
    const query = params.toString();
    const response = await this.request<PaginatedResponse<Job>>(
      `/api/jobs${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getJob(id: string): Promise<Job> {
    const response = await this.request<Job>(`/api/jobs/${id}`);
    return response;
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const response = await this.request<Job>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    return response;
  }

  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    const response = await this.request<Job>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
    return response;
  }

  async deleteJob(id: string): Promise<void> {
    await this.request(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // User APIs
  async getUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/api/users');
    return response;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/api/users/${id}`);
    return response;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics APIs
  async getAnalyticsDashboard(filters?: AnalyticsFilters): Promise<AnalyticsDashboardData> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }
    if (filters?.userType) {
      params.append('userType', filters.userType.join(','));
    }
    if (filters?.demoMode !== undefined) {
      params.append('demoMode', filters.demoMode.toString());
    }
    if (filters?.country) {
      params.append('country', filters.country.join(','));
    }
    if (filters?.eventCategory) {
      params.append('eventCategory', filters.eventCategory.join(','));
    }

    const query = params.toString();
    const response = await this.request<AnalyticsDashboardData>(
      `/api/analytics/dashboard${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getAnalyticsOverview(filters?: AnalyticsFilters): Promise<AnalyticsOverview> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<AnalyticsOverview>(
      `/api/analytics/overview${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getSessionMetrics(filters?: AnalyticsFilters): Promise<AnalyticsSessionMetrics> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<AnalyticsSessionMetrics>(
      `/api/analytics/sessions${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getEventMetrics(filters?: AnalyticsFilters): Promise<AnalyticsEventMetrics> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<AnalyticsEventMetrics>(
      `/api/analytics/events${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getFeatureUsage(filters?: AnalyticsFilters): Promise<FeatureUsageMetrics> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<FeatureUsageMetrics>(
      `/api/analytics/features${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getFunnelAnalytics(filters?: AnalyticsFilters): Promise<FunnelAnalytics> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<FunnelAnalytics>(
      `/api/analytics/funnels${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getABTestResults(filters?: AnalyticsFilters): Promise<ABTestResults[]> {
    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    const query = params.toString();
    const response = await this.request<ABTestResults[]>(
      `/api/analytics/ab-tests${query ? `?${query}` : ''}`
    );
    return response;
  }
}

export const apiClient = new ApiClient();
