export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Legacy field for compatibility
  businessName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  id: string;
  user_id: string;
  customer_id: string;
  customerName?: string; // Computed field from join
  title: string;
  description?: string;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  estimated_cost?: number;
  actual_cost?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  paid: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  completedDate?: string;
  hourlyRate?: number;
  totalAmount?: number;
  paymentStatus?: 'paid' | 'unpaid' | 'partially-paid';
  location?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  business_name?: string;
  password_hash?: string; // Not typically returned to frontend
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  businessName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  // Core business metrics
  totalCustomers: number;
  totalJobs: number;
  totalRevenue: number;
  unpaidAmount: number;
  
  // Job status breakdown
  jobsByStatus: {
    pending: number;
    scheduled: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
  
  // Analytics metrics
  analytics?: {
    totalSessions: number;
    totalPageViews: number;
    totalEvents: number;
    waitlistSignups: number;
    conversionRate: number;
    averageSessionDuration: number;
    topPages: { page_path: string; views: number }[];
    topFeatures: { feature_name: string; usage_count: number }[];
    userTypeBreakdown: { user_type: string; count: number }[];
    dailyActiveUsers: { date: string; users: number }[];
  };
  
  // Recent data
  recentJobs: Job[];
  recentCustomers: Customer[];
  recentEvents?: {
    id: string;
    event_name: string;
    timestamp: string;
    user_type: string;
    demo_mode: boolean;
  }[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  error?: string;
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

// Analytics Events
export interface AnalyticsEvent {
  id: string;
  session_id: string;
  user_id?: string;
  event_name: string;
  event_category?: string;
  page_path?: string;
  timestamp: string;
  properties?: string; // JSON string
  demo_mode: boolean;
  user_type: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  session_duration?: number;
  page_views_in_session?: number;
  conversion_source?: string;
  converted: boolean;
}

// Analytics Sessions
export interface AnalyticsSession {
  session_id: string;
  user_id?: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  demo_mode: boolean;
  user_type: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  country?: string;
  page_views: number;
  events_count: number;
  features_used?: string; // JSON array
  converted: boolean;
  conversion_event?: string;
  conversion_source?: string;
  waitlist_email?: string;
  landing_page?: string;
  exit_page?: string;
  pages_visited?: string; // JSON array
}

// Waitlist Entry
export interface WaitlistEntry {
  id: string;
  email: string;
  businessType?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

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
