import { Customer, Job, User, DashboardStats, ApiResponse, PaginatedResponse, SearchFilters } from '../types';

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
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

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  }

  // Customer APIs
  async getCustomers(filters?: SearchFilters): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end);
    
    const query = params.toString();
    const response = await this.request<PaginatedResponse<Customer>>(
      `/customers${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.request<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await this.request<ApiResponse<Customer>>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await this.request<ApiResponse<Customer>>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.request(`/customers/${id}`, {
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
      `/jobs${query ? `?${query}` : ''}`
    );
    return response;
  }

  async getJob(id: string): Promise<Job> {
    const response = await this.request<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const response = await this.request<ApiResponse<Job>>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    return response.data;
  }

  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    const response = await this.request<ApiResponse<Job>>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
    return response.data;
  }

  async deleteJob(id: string): Promise<void> {
    await this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // User APIs
  async getUsers(): Promise<User[]> {
    const response = await this.request<ApiResponse<User[]>>('/users');
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.data;
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
}

export const apiClient = new ApiClient();
