# Analytics Dashboard Usage Guide

## Step-by-Step Guide: Using Analytics Data in the Dashboard

This guide explains how to access, understand, and utilize the analytics data in your admin dashboard.

## Prerequisites

1. **Authentication**: You need valid admin credentials
   - Email: `analytics@test.com`
   - Password: `analytics123`

2. **Data Requirements**: Analytics data comes from tracking tables (`trk_*`)
   - `trk_sessions` - User session data
   - `trk_events` - User interaction events
   - `trk_feature_usage` - Feature usage tracking
   - `trk_funnels` - Conversion funnel data
   - `trk_ab_tests` - A/B testing data

## Step 1: Accessing the Analytics Dashboard

### 1.1 Login to Admin Panel
```bash
# Start the admin development server
cd my-job-track-admin
npm run dev
```

1. Open browser to `http://localhost:3001`
2. Login with admin credentials
3. Navigate to "Analytics" tab

### 1.2 Verify API Connection
The dashboard automatically fetches data from:
```
Remote API: https://myjobtrack-api.yeb404974.workers.dev/api/analytics/
```

## Step 2: Understanding Analytics Data Structure

### 2.1 Overview Metrics
**Location**: Top of analytics page
**Data Source**: `getAnalyticsOverview()`

```typescript
interface AnalyticsOverview {
  totalSessions: number;        // Total user sessions
  totalEvents: number;          // Total tracked events
  averageSessionDuration: number; // Average time spent (seconds)
  conversionRate: number;       // Percentage of converting users
  demoModeUsage: number;        // Percentage using demo mode
  topLandingPages: PageMetric[]; // Most visited entry pages
  topExitPages: PageMetric[];    // Most common exit pages
  userTypeBreakdown: UserTypeMetric[]; // New vs returning users
}
```

**Usage Examples**:
- Monitor overall platform engagement
- Track conversion effectiveness
- Identify popular entry/exit points

### 2.2 Session Analytics
**Location**: Sessions section
**Data Source**: `getSessionMetrics()`

```typescript
interface AnalyticsSessionMetrics {
  dailySessions: DailyMetric[];      // Sessions over time
  sessionDuration: SessionDurationMetric[]; // Duration distribution
  bounceRate: number;                // Single-page session rate
  geographicData: GeographicMetric[]; // User locations
  deviceData: DeviceMetric[];        // Device types (mobile/desktop)
}
```

**Usage Examples**:
- Track daily active users
- Understand user engagement patterns
- Optimize for primary device types
- Target specific geographic regions

### 2.3 Event Tracking
**Location**: Events section
**Data Source**: `getEventMetrics()`

```typescript
interface AnalyticsEventMetrics {
  topEvents: EventMetric[];          // Most frequent events
  eventCategories: CategoryMetric[]; // Event type breakdown
  conversionEvents: ConversionMetric[]; // Events leading to conversion
  dailyEvents: DailyMetric[];        // Event trends over time
}
```

**Usage Examples**:
- Identify most popular features
- Track user interaction patterns
- Optimize conversion funnels
- Monitor feature adoption

### 2.4 Feature Usage Analytics
**Location**: Features section
**Data Source**: `getFeatureUsage()`

```typescript
interface FeatureUsageMetrics {
  topFeatures: FeatureMetric[];           // Most used features
  featureAdoption: FeatureAdoptionMetric[]; // Feature growth over time
  demoModeFeatures: FeatureMetric[];      // Demo-specific usage
}
```

**Usage Examples**:
- Prioritize feature development
- Identify underused features
- Optimize demo experience
- Track feature ROI

## Step 3: Implementing Custom Analytics

### 3.1 Adding Date Range Filters

```typescript
// In your component
const [filters, setFilters] = useState<AnalyticsFilters>({
  dateRange: {
    start: '2025-01-01',
    end: '2025-01-31'
  }
});

// Fetch filtered data
const { data } = useQuery({
  queryKey: ['analytics-dashboard', filters],
  queryFn: () => apiClient.getAnalyticsDashboard(filters)
});
```

### 3.2 Adding Custom Filters

```typescript
// Available filter options
interface AnalyticsFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  userType?: string[];      // ['new', 'returning']
  demoMode?: boolean;       // true/false
  country?: string[];       // ['US', 'CA', 'UK']
  eventCategory?: string[]; // ['interaction', 'conversion']
}
```

### 3.3 Creating Custom Charts

```typescript
// Example: Custom conversion rate chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ConversionChart({ data }: { data: DailyMetric[] }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
    </LineChart>
  );
}
```

## Step 4: Using Individual Analytics Endpoints

### 4.1 Overview Data Only
```typescript
// Get just overview metrics
const overviewData = await apiClient.getAnalyticsOverview(filters);
console.log(`Conversion Rate: ${overviewData.conversionRate}%`);
```

### 4.2 Session Metrics Only
```typescript
// Get session-specific data
const sessionData = await apiClient.getSessionMetrics(filters);
console.log(`Bounce Rate: ${sessionData.bounceRate}%`);
```

### 4.3 Event Tracking Only
```typescript
// Get event data
const eventData = await apiClient.getEventMetrics(filters);
console.log(`Top Event: ${eventData.topEvents[0].eventName}`);
```

### 4.4 Feature Usage Only
```typescript
// Get feature usage data
const featureData = await apiClient.getFeatureUsage(filters);
console.log(`Most Used Feature: ${featureData.topFeatures[0].featureName}`);
```

## Step 5: Advanced Analytics Usage

### 5.1 Real-time Data Updates

```typescript
// Auto-refresh analytics every 5 minutes
const { data } = useQuery({
  queryKey: ['analytics-dashboard', filters],
  queryFn: () => apiClient.getAnalyticsDashboard(filters),
  refetchInterval: 5 * 60 * 1000, // 5 minutes
  staleTime: 2 * 60 * 1000,       // 2 minutes
});
```

### 5.2 Comparative Analytics

```typescript
// Compare current vs previous period
const currentPeriod = {
  start: '2025-01-01',
  end: '2025-01-31'
};

const previousPeriod = {
  start: '2024-12-01',
  end: '2024-12-31'
};

const [currentData, previousData] = await Promise.all([
  apiClient.getAnalyticsOverview({ dateRange: currentPeriod }),
  apiClient.getAnalyticsOverview({ dateRange: previousPeriod })
]);

const conversionGrowth = 
  ((currentData.conversionRate - previousData.conversionRate) / 
   previousData.conversionRate) * 100;
```

### 5.3 Export Analytics Data

```typescript
// Export data for external analysis
const exportAnalytics = async (filters: AnalyticsFilters) => {
  const data = await apiClient.getAnalyticsDashboard(filters);
  
  const csvData = data.sessions.dailySessions.map(session => ({
    date: session.date,
    sessions: session.count,
    conversionRate: data.overview.conversionRate
  }));
  
  // Convert to CSV and download
  const csv = convertToCSV(csvData);
  downloadFile(csv, 'analytics-export.csv');
};
```

## Step 6: Monitoring and Alerts

### 6.1 Conversion Rate Monitoring

```typescript
// Set up alerts for low conversion rates
const monitorConversionRate = (data: AnalyticsOverview) => {
  const threshold = 5.0; // 5% minimum conversion rate
  
  if (data.conversionRate < threshold) {
    // Send alert notification
    console.warn(`Low conversion rate: ${data.conversionRate}%`);
    // Implement your notification system here
  }
};
```

### 6.2 Traffic Anomaly Detection

```typescript
// Detect unusual traffic patterns
const detectAnomalies = (sessions: DailyMetric[]) => {
  const average = sessions.reduce((sum, s) => sum + s.count, 0) / sessions.length;
  const threshold = average * 0.5; // 50% below average
  
  const anomalies = sessions.filter(session => session.count < threshold);
  
  if (anomalies.length > 0) {
    console.warn('Traffic anomalies detected:', anomalies);
  }
};
```

## Step 7: Best Practices

### 7.1 Data Refresh Strategy
- Use appropriate `staleTime` and `refetchInterval`
- Implement loading states for better UX
- Cache frequently accessed data
- Handle API errors gracefully

### 7.2 Performance Optimization
```typescript
// Memoize expensive calculations
const conversionTrend = useMemo(() => {
  return calculateTrend(analyticsData?.overview.dailyConversions || []);
}, [analyticsData?.overview.dailyConversions]);

// Lazy load heavy components
const AdvancedCharts = lazy(() => import('./AdvancedCharts'));
```

### 7.3 Error Handling
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['analytics-dashboard', filters],
  queryFn: () => apiClient.getAnalyticsDashboard(filters),
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (error) {
  return <ErrorBoundary error={error} />;
}
```

## Step 8: Sample Data for Testing

The system includes sample data with:
- **8 sessions** across 4 days (Jan 5-8, 2025)
- **12 events** including conversions and interactions
- **11 feature usage** records
- **Geographic diversity**: US, CA, UK, AU, DE, FR
- **Device mix**: 87.5% desktop, 12.5% mobile
- **58.3% conversion rate**

## Troubleshooting

### Common Issues:

1. **No Data Showing**
   - Check API connectivity
   - Verify authentication token
   - Ensure tracking tables have data

2. **Performance Issues**
   - Reduce date range for large datasets
   - Implement pagination for large result sets
   - Use appropriate caching strategies

3. **Incorrect Metrics**
   - Verify date range filters
   - Check timezone configurations
   - Validate tracking implementation

### API Endpoints Reference:

```
GET /api/analytics/dashboard    - Complete analytics data
GET /api/analytics/overview     - Overview metrics only
GET /api/analytics/sessions     - Session analytics
GET /api/analytics/events       - Event tracking data
GET /api/analytics/features     - Feature usage metrics
GET /api/analytics/funnels      - Conversion funnel data
GET /api/analytics/ab-tests     - A/B testing results
```

All endpoints require Bearer token authentication and support optional query parameters for filtering.
