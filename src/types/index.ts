export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  customerId: string;
  customerName?: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  totalAmount?: number;
  paymentStatus: 'paid' | 'unpaid' | 'partially-paid';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalJobs: number;
  totalRevenue: number;
  unpaidAmount: number;
  jobsByStatus: {
    scheduled: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
  recentJobs: Job[];
  recentCustomers: Customer[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => JSX.Element;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  priority?: string;
  paymentStatus?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Analytics Types
export type TrackingProperties = Record<string, any>;

// Analytics Context Type
export interface AnalyticsContextType {
  sessionId: string;
  userType: 'demo' | 'waitlisted' | 'authenticated' | 'anonymous';
  demoMode: boolean;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string, referrer?: string) => void;
  trackFeatureInteraction: (feature: string, action: string, properties?: Record<string, any>) => void;
  trackConversion: (source: string, email?: string) => void;
  trackWaitlistCTA: (source: string, properties?: Record<string, any>) => void;
  initSession: (landingPage: string, referrer?: string) => void;
}
