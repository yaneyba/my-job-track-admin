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
  Cell,
} from 'recharts';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import { LoadingSpinner, Skeleton } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { AnalyticsFilters } from '@/types';
import { 
  ChartBarIcon, 
  ArrowPathIcon,
  CalendarIcon,
  UsersIcon,
  EyeIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const defaultFilters: AnalyticsFilters = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }
};

function MetricCard({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children, loading = false }: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChartBarIcon className="h-5 w-5 text-gray-600" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function Analytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);

  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-dashboard', filters],
    queryFn: () => apiClient.getAnalyticsDashboard(filters),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton rows={3} className="h-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <EmptyState
          icon={<ChartBarIcon className="h-12 w-12" />}
          title="Failed to load analytics data"
          description={error instanceof Error ? error.message : 'Unknown error occurred'}
          action={{
            label: 'Retry',
            onClick: () => refetch(),
            icon: <ArrowPathIcon className="h-4 w-4" />
          }}
        />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <EmptyState
          icon={<ChartBarIcon className="h-12 w-12" />}
          title="No analytics data available"
          description="Start tracking user interactions to see analytics data here."
        />
      </div>
    );
  }

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          User behavior insights and engagement metrics
        </p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full sm:w-auto"
              />
              <span className="text-gray-500 self-center">to</span>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full sm:w-auto"
              />
            </div>
            
            <Button
              onClick={() => refetch()}
              variant="outline"
              icon={<ArrowPathIcon className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sessions"
          value={overview.totalSessions.toLocaleString()}
          icon={UsersIcon}
          color="text-blue-600"
          subtitle="Unique user visits"
        />
        <MetricCard
          title="Total Events"
          value={overview.totalEvents.toLocaleString()}
          icon={CursorArrowRaysIcon}
          color="text-green-600"
          subtitle="User interactions"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${overview.conversionRate.toFixed(1)}%`}
          icon={ChartBarIcon}
          color="text-purple-600"
          subtitle="Users who converted"
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.round(overview.averageSessionDuration / 60)}m`}
          icon={EyeIcon}
          color="text-orange-600"
          subtitle="Time spent on site"
        />
      </div>

      {/* Session Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Sessions">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessions.dailySessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [value, 'Sessions']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Session Duration Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessions.sessionDuration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, 'Sessions']} />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* User Type & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Type Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overview.userTypeBreakdown}
                dataKey="count"
                nameKey="userType"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ userType, percentage }) => `${userType}: ${percentage}%`}
              >
                {overview.userTypeBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Users']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.geographicData?.slice(0, 8).map((geo: any, index) => (
                <div key={geo.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{geo.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${geo.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">
                      {geo.sessions}
                    </span>
                  </div>
                </div>
              )) || (
                <EmptyState
                  title="No geographic data"
                  description="Geographic data will appear here once users start visiting."
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Analytics & Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.topEvents?.slice(0, 8).map((event: any) => (
                <div key={event.eventName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{event.eventName}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="font-medium">{event.count}</span>
                    <span className="text-xs">({event.uniqueSessions} sessions)</span>
                  </div>
                </div>
              )) || (
                <EmptyState
                  title="No events tracked"
                  description="Event data will appear here once user interactions are tracked."
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {features.topFeatures.slice(0, 8).map((feature) => (
                <div key={feature.featureName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{feature.featureName}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="font-medium">{feature.usage}</span>
                    <span className="text-xs">{feature.adoptionRate.toFixed(1)}% adoption</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      {funnels.conversionFunnel.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {funnels.conversionFunnel.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-3 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-900 mb-1">{step.users}</div>
                    <div className="text-sm font-medium text-blue-700">{step.conversionRate.toFixed(1)}%</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{step.step}</div>
                  {index < funnels.conversionFunnel.length - 1 && (
                    <div className="text-xs text-red-500">
                      -{step.dropOffRate.toFixed(1)}% drop-off
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}