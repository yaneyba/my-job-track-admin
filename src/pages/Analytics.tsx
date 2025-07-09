import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { AnalyticsFilters } from '@/types';

const defaultFilters: AnalyticsFilters = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  }
};

export function Analytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);

  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-dashboard', filters],
    queryFn: () => apiClient.getAnalyticsDashboard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Failed to load analytics data
        </div>
        <p className="text-gray-500 mb-4">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
        <div className="mt-4 text-sm text-gray-400">
          <p>If the problem persists, the analytics API may be temporarily unavailable.</p>
          <p>Current date range: {filters.dateRange.start} to {filters.dateRange.end}</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">
          No analytics data available
        </div>
        <p className="text-gray-500">
          Start tracking user interactions to see analytics data here.
        </p>
      </div>
    );
  }

  // Ensure we have all required data sections
  const overview = analyticsData.overview || {
    totalSessions: 0,
    totalEvents: 0,
    conversionRate: 0,
    averageSessionDuration: 0,
    userTypeBreakdown: []
  };

  const sessions = analyticsData.sessions || {
    dailySessions: [],
    sessionDuration: [],
    geographicData: []
  };

  const events = analyticsData.events || {
    topEvents: []
  };

  const features = analyticsData.features || {
    topFeatures: []
  };

  const funnels = analyticsData.funnels || {
    conversionFunnel: []
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          User behavior insights and engagement metrics
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalSessions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalEvents.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overview.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(overview.averageSessionDuration / 60)}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Sessions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessions.dailySessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Session Duration Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessions.sessionDuration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overview.userTypeBreakdown}
                dataKey="count"
                nameKey="userType"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ userType, percentage }) => `${userType}: ${percentage}%`}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            {sessions.geographicData?.slice(0, 5).map((geo: any) => (
              <div key={geo.country} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{geo.country}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${geo.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{geo.sessions}</span>
                </div>
              </div>
            )) || null}
          </div>
        </div>
      </div>

      {/* Event Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Events</h3>
          <div className="space-y-3">
            {events.topEvents?.slice(0, 8).map((event: any) => (
              <div key={event.eventName} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{event.eventName}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{event.count}</span>
                  <span className="text-xs text-gray-400">({event.uniqueSessions} sessions)</span>
                </div>
              </div>
            )) || null}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage</h3>
          <div className="space-y-3">
            {features.topFeatures.slice(0, 8).map((feature) => (
              <div key={feature.featureName} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{feature.featureName}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{feature.usage}</span>
                  <span className="text-xs text-gray-400">{feature.adoptionRate.toFixed(1)}% adoption</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {funnels.conversionFunnel.map((step, index) => (
            <div key={step.step} className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-blue-900">{step.users}</div>
                <div className="text-sm text-blue-700">{step.conversionRate.toFixed(1)}%</div>
              </div>
              <div className="text-sm text-gray-600">{step.step}</div>
              {index < funnels.conversionFunnel.length - 1 && (
                <div className="text-xs text-red-500 mt-1">
                  -{step.dropOffRate.toFixed(1)}% drop-off
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
