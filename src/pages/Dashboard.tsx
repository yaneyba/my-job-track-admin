import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/UI/Badge';
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
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

function StatCard({ title, value, icon: Icon, color, subtitle }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
              {subtitle && (
                <dd className="text-xs text-gray-400 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsChart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-64 rounded-lg"></div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
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
        />
        <StatCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          icon={BriefcaseIcon}
          color="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={CurrencyDollarIcon}
          color="text-yellow-600"
        />
        <StatCard
          title="Unpaid Amount"
          value={formatCurrency(stats?.unpaidAmount || 0)}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
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
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Jobs by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.jobsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{status.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
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
        {/* Recent Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recentJobs?.slice(0, 5).map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.customerName}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={job.status === 'completed' ? 'success' : 'info'}>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(job.scheduledDate, 'MMM d')}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="p-6 text-center text-gray-500">
                No recent jobs
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recentCustomers?.slice(0, 5).map((customer) => (
              <div key={customer.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(customer.createdAt, 'MMM d')}
                  </div>
                </div>
              </div>
            )) || (
              <div className="p-6 text-center text-gray-500">
                No recent customers
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events (if available) */}
      {stats?.recentEvents && stats.recentEvents.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
              Recent Activity Events
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentEvents.slice(0, 10).map((event) => (
              <div key={event.id} className="p-4">
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
        </div>
      )}
    </div>
  );
}
