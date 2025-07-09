import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { LoadingSpinner, Skeleton } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Area,
  AreaChart,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

function StatCard({ title, value, icon: Icon, color, subtitle, trend }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  trend?: { value: number; label: string };
}) {
  return (
    <Card hover className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs ${
                trend.value >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowTrendingUpIcon className={`h-3 w-3 mr-1 ${
                  trend.value < 0 ? 'rotate-180' : ''
                }`} />
                <span>{Math.abs(trend.value)}% {trend.label}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative background */}
        <div className={`absolute top-0 right-0 w-20 h-20 ${color.replace('text-', 'bg-').replace('-600', '-50')} rounded-full -mr-10 -mt-10 opacity-20`} />
      </CardContent>
    </Card>
  );
}

function AnalyticsChart({ title, children, loading = false }: { 
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
        <div className="h-64">
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

function RecentActivityCard({ title, items, emptyMessage, onViewAll }: {
  title: string;
  items: any[];
  emptyMessage: string;
  onViewAll?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onViewAll && (
            <button 
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No recent activity"
              description={emptyMessage}
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.slice(0, 5).map((item, index) => (
              <div key={item.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title || item.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {item.customerName || item.email || 'No details'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-4">
                    {item.status && (
                      <StatusBadge status={item.status} />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(item.scheduledDate || item.createdAt || item.created_at, 'MMM d')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
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
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64" />
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
          icon={<ExclamationTriangleIcon className="h-12 w-12" />}
          title="Error loading dashboard"
          description={error instanceof Error ? error.message : 'An error occurred'}
          action={{
            label: 'Retry',
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your job tracking system and analytics
        </p>
      </div>

      {/* Core Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={UsersIcon}
          color="text-blue-600"
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          icon={BriefcaseIcon}
          color="text-green-600"
          trend={{ value: 8, label: 'from last month' }}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={CurrencyDollarIcon}
          color="text-yellow-600"
          trend={{ value: 15, label: 'from last month' }}
        />
        <StatCard
          title="Unpaid Amount"
          value={formatCurrency(stats?.unpaidAmount || 0)}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
          subtitle="Requires attention"
        />
      </div>

      {/* Analytics Overview (if available) */}
      {stats?.analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sessions"
            value={stats.analytics.totalSessions.toLocaleString()}
            icon={EyeIcon}
            color="text-purple-600"
            subtitle="Website visits"
          />
          <StatCard
            title="Page Views"
            value={stats.analytics.totalPageViews.toLocaleString()}
            icon={ChartBarIcon}
            color="text-indigo-600"
            subtitle="Total page views"
          />
          <StatCard
            title="Waitlist Signups"
            value={stats.analytics.waitlistSignups.toLocaleString()}
            icon={UserGroupIcon}
            color="text-teal-600"
            subtitle="New signups"
          />
          <StatCard
            title="Conversion Rate"
            value={`${(stats.analytics.conversionRate * 100).toFixed(1)}%`}
            icon={ArrowTrendingUpIcon}
            color="text-emerald-600"
            subtitle="Visitor to signup"
          />
        </div>
      )}

      {/* Job Status Summary */}
      {stats?.jobsByStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.jobsByStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <StatusBadge status={status} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Charts */}
      {stats?.analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Active Users Chart */}
          {stats.analytics.dailyActiveUsers?.length > 0 && (
            <AnalyticsChart title="Daily Active Users">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.analytics.dailyActiveUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [value, 'Users']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </AnalyticsChart>
          )}

          {/* User Type Breakdown */}
          {stats.analytics.userTypeBreakdown?.length > 0 && (
            <AnalyticsChart title="User Type Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.analytics.userTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ user_type, percent }) => `${user_type}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.analytics.userTypeBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Users']} />
                </PieChart>
              </ResponsiveContainer>
            </AnalyticsChart>
          )}

          {/* Top Pages */}
          {stats.analytics.topPages?.length > 0 && (
            <AnalyticsChart title="Top Pages">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.analytics.topPages.slice(0, 8)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="page_path" 
                    tick={{ fontSize: 10 }}
                    width={100}
                  />
                  <Tooltip formatter={(value: number) => [value, 'Views']} />
                  <Bar dataKey="views" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsChart>
          )}

          {/* Top Features */}
          {stats.analytics.topFeatures?.length > 0 && (
            <AnalyticsChart title="Feature Usage">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.analytics.topFeatures.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="feature_name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [value, 'Uses']} />
                  <Bar dataKey="usage_count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsChart>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard
          title="Recent Jobs"
          items={stats?.recentJobs || []}
          emptyMessage="No recent jobs found. Create your first job to get started."
        />
        
        <RecentActivityCard
          title="Recent Customers"
          items={stats?.recentCustomers || []}
          emptyMessage="No recent customers found. Add your first customer to get started."
        />
      </div>

      {/* Recent Events (if available) */}
      {stats?.recentEvents && stats.recentEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-purple-500" />
              <span>Recent Activity Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {stats.recentEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${event.demo_mode ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.event_name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {event.user_type} {event.demo_mode && '(Demo)'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(event.timestamp, 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}