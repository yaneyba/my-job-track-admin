import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import { Badge } from '../components/UI/Badge';
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
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
            </dl>
          </div>
        </div>
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
          Overview of your job tracking system
        </p>
      </div>

      {/* Stats */}
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

      {/* Job Status Summary */}
      {stats?.jobsByStatus && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Jobs by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.jobsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{status.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
