// Example: Custom Analytics Components
// File: src/components/Analytics/CustomAnalyticsExamples.tsx

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { apiClient } from '@/lib/api';
import { AnalyticsFilters, AnalyticsDashboardData } from '@/types';

// STEP 1: Basic Analytics Fetching
export function BasicAnalyticsExample() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: '2025-01-01',
      end: '2025-01-31'
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-example', filters],
    queryFn: () => apiClient.getAnalyticsDashboard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Basic Analytics</h2>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Total Sessions"
          value={data.overview.totalSessions}
          format="number"
        />
        <StatCard 
          title="Conversion Rate"
          value={data.overview.conversionRate}
          format="percentage"
        />
        <StatCard 
          title="Avg Session Duration"
          value={data.overview.averageSessionDuration}
          format="duration"
        />
        <StatCard 
          title="Demo Mode Usage"
          value={data.overview.demoModeUsage}
          format="percentage"
        />
      </div>
    </div>
  );
}

// STEP 2: Custom Chart Components
export function ConversionTrendChart() {
  const { data } = useQuery({
    queryKey: ['conversion-trend'],
    queryFn: () => apiClient.getAnalyticsOverview(),
  });

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data?.topLandingPages) return [];
    
    return data.topLandingPages.map(page => ({
      page: page.page.replace('/', ''),
      views: page.views,
      percentage: page.percentage
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Landing Page Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="page" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// STEP 3: Real-time Dashboard with Filters
export function RealTimeDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  const { data, refetch } = useQuery({
    queryKey: ['realtime-analytics', filters],
    queryFn: () => apiClient.getAnalyticsDashboard(filters),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleFilterChange = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <DateRangeFilter 
            value={filters.dateRange}
            onChange={(dateRange) => handleFilterChange({ dateRange })}
          />
          <UserTypeFilter 
            value={filters.userType}
            onChange={(userType) => handleFilterChange({ userType })}
          />
          <DemoModeFilter 
            value={filters.demoMode}
            onChange={(demoMode) => handleFilterChange({ demoMode })}
          />
        </div>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      {/* Real-time Metrics */}
      {data && <RealTimeMetrics data={data} />}
    </div>
  );
}

// STEP 4: Geographic Analytics
export function GeographicAnalytics() {
  const { data } = useQuery({
    queryKey: ['geographic-analytics'],
    queryFn: () => apiClient.getSessionMetrics(),
  });

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data?.geographicData || []}
              dataKey="sessions"
              nameKey="country"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data?.geographicData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Country List */}
        <div className="space-y-2">
          {data?.geographicData?.map((country, index) => (
            <div key={country.country} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-medium">{country.country}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{country.sessions}</div>
                <div className="text-sm text-gray-500">{country.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// STEP 5: Feature Usage Tracking
export function FeatureUsageTracker() {
  const { data } = useQuery({
    queryKey: ['feature-usage'],
    queryFn: () => apiClient.getFeatureUsage(),
  });

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const featureAdoptionData = useMemo(() => {
    if (!selectedFeature || !data?.featureAdoption) return [];
    
    const feature = data.featureAdoption.find(f => f.feature === selectedFeature);
    return feature?.weeklyUsage || [];
  }, [selectedFeature, data]);

  return (
    <div className="space-y-6">
      {/* Feature Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Feature Usage Analytics</h3>
        
        {/* Top Features List */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {data?.topFeatures?.slice(0, 6).map((feature) => (
            <div 
              key={feature.featureName}
              onClick={() => setSelectedFeature(feature.featureName)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedFeature === feature.featureName 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium">{feature.featureName}</h4>
              <div className="text-sm text-gray-600">
                <div>Usage: {feature.usage}</div>
                <div>Users: {feature.uniqueUsers}</div>
                <div>Adoption: {feature.adoptionRate}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Trend Chart */}
        {selectedFeature && (
          <div>
            <h4 className="text-md font-semibold mb-4">
              {selectedFeature} - Usage Trend
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={featureAdoptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Demo vs Production Usage */}
      <div className="grid grid-cols-2 gap-6">
        <FeatureComparisonChart 
          title="Production Features"
          features={data?.topFeatures || []}
        />
        <FeatureComparisonChart 
          title="Demo Mode Features"
          features={data?.demoModeFeatures || []}
        />
      </div>
    </div>
  );
}

// STEP 6: Event Analytics
export function EventAnalytics() {
  const { data } = useQuery({
    queryKey: ['event-analytics'],
    queryFn: () => apiClient.getEventMetrics(),
  });

  return (
    <div className="space-y-6">
      {/* Event Categories */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data?.eventCategories || []}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ category, percentage }) => `${category}: ${percentage}%`}
            >
              {data?.eventCategories?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Events Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daily Events Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.dailyEvents || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Events Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Event Name</th>
                <th className="px-4 py-2 text-right">Count</th>
                <th className="px-4 py-2 text-right">Unique Sessions</th>
                <th className="px-4 py-2 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {data?.topEvents?.map((event) => (
                <tr key={event.eventName} className="border-t">
                  <td className="px-4 py-2 font-medium">{event.eventName}</td>
                  <td className="px-4 py-2 text-right">{event.count}</td>
                  <td className="px-4 py-2 text-right">{event.uniqueSessions}</td>
                  <td className="px-4 py-2 text-right">
                    {event.conversionRate ? `${event.conversionRate.toFixed(1)}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, format }: { 
  title: string; 
  value: number; 
  format: 'number' | 'percentage' | 'duration';
}) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        return `${Math.round(val / 60)}m`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">
        {formatValue(value, format)}
      </p>
    </div>
  );
}

function DateRangeFilter({ value, onChange }: {
  value?: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date Range
      </label>
      <div className="space-y-2">
        <input
          type="date"
          value={value?.start || ''}
          onChange={(e) => onChange({ ...value!, start: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={value?.end || ''}
          onChange={(e) => onChange({ ...value!, end: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}

function UserTypeFilter({ value, onChange }: {
  value?: string[];
  onChange: (value: string[]) => void;
}) {
  const userTypes = ['new', 'returning'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        User Type
      </label>
      <div className="space-y-2">
        {userTypes.map(type => (
          <label key={type} className="flex items-center">
            <input
              type="checkbox"
              checked={value?.includes(type) || false}
              onChange={(e) => {
                const newValue = e.target.checked 
                  ? [...(value || []), type]
                  : (value || []).filter(v => v !== type);
                onChange(newValue);
              }}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
}

function DemoModeFilter({ value, onChange }: {
  value?: boolean;
  onChange: (value: boolean | undefined) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Demo Mode
      </label>
      <select
        value={value === undefined ? 'all' : value.toString()}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === 'all' ? undefined : val === 'true');
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="all">All</option>
        <option value="true">Demo Only</option>
        <option value="false">Production Only</option>
      </select>
    </div>
  );
}

function RealTimeMetrics({ data }: { data: AnalyticsDashboardData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Live Sessions</p>
            <p className="text-xl font-bold">{data.overview.totalSessions}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Conversion Rate</p>
        <p className="text-xl font-bold">{data.overview.conversionRate.toFixed(1)}%</p>
        <p className="text-xs text-green-600">↑ Live tracking</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Active Events</p>
        <p className="text-xl font-bold">{data.overview.totalEvents}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Demo Usage</p>
        <p className="text-xl font-bold">{data.overview.demoModeUsage.toFixed(1)}%</p>
      </div>
    </div>
  );
}

function FeatureComparisonChart({ title, features }: {
  title: string;
  features: any[];
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={features.slice(0, 5)} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="featureName" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="usage" fill="#8884D8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default {
  BasicAnalyticsExample,
  ConversionTrendChart,
  RealTimeDashboard,
  GeographicAnalytics,
  FeatureUsageTracker,
  EventAnalytics
};
