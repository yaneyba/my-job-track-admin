import { Bar, Line, Pie } from 'recharts';
import {
  BarChart,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data - in real app, this would come from API
const monthlyRevenue = [
  { month: 'Jan', revenue: 12000, jobs: 45 },
  { month: 'Feb', revenue: 19000, jobs: 52 },
  { month: 'Mar', revenue: 15000, jobs: 48 },
  { month: 'Apr', revenue: 22000, jobs: 61 },
  { month: 'May', revenue: 18000, jobs: 55 },
  { month: 'Jun', revenue: 25000, jobs: 68 },
];

const jobStatusData = [
  { name: 'Completed', value: 124, color: '#10B981' },
  { name: 'In Progress', value: 32, color: '#F59E0B' },
  { name: 'Scheduled', value: 18, color: '#3B82F6' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
];

const customerGrowth = [
  { month: 'Jan', customers: 120 },
  { month: 'Feb', customers: 135 },
  { month: 'Mar', customers: 148 },
  { month: 'Apr', customers: 162 },
  { month: 'May', customers: 171 },
  { month: 'Jun', customers: 185 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Business insights and performance metrics
        </p>
      </div>

      {/* Revenue and Jobs Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue & Jobs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="jobs" fill="#10B981" name="Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Growth */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={customerGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Total Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">$125,000</div>
          <div className="text-sm text-gray-500">Total Revenue (YTD)</div>
          <div className="text-sm text-green-600">+12.5% from last year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">289</div>
          <div className="text-sm text-gray-500">Total Jobs Completed</div>
          <div className="text-sm text-green-600">+8.3% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">185</div>
          <div className="text-sm text-gray-500">Active Customers</div>
          <div className="text-sm text-green-600">+15.2% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">$432</div>
          <div className="text-sm text-gray-500">Average Job Value</div>
          <div className="text-sm text-red-600">-3.1% from last month</div>
        </div>
      </div>
    </div>
  );
}
