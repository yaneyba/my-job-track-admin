import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { Job, SearchFilters } from '@/types';
import { formatDate, formatCurrency, getStatusColor, getPriorityColor } from '@/lib/utils';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Badge } from '@/components/UI/Badge';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Job>();

export function Jobs() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');

  const queryClient = useQueryClient();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => apiClient.getJobs(filters),
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    },
  });

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status === 'all' ? undefined : status }));
  };

  const handleDelete = (job: Job) => {
    if (window.confirm(`Are you sure you want to delete job "${job.title}"?`)) {
      deleteJobMutation.mutate(job.id);
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Job Title',
      cell: (info) => (
        <div>
          <div className="font-medium text-gray-900">{info.getValue()}</div>
          <div className="text-sm text-gray-500">{info.row.original.customerName}</div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge className={getStatusColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => (
        <Badge className={getPriorityColor(info.getValue() || '')}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('scheduledDate', {
      header: 'Scheduled',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Amount',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('paymentStatus', {
      header: 'Payment',
      cell: (info) => (
        <Badge className={getStatusColor(info.getValue() || '')}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setModalMode('view');
              setShowModal(true);
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setModalMode('edit');
              setShowModal(true);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(info.row.original)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all jobs and their status
          </p>
        </div>
        <Button onClick={() => {
          setModalMode('create');
          setShowModal(true);
        }}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search jobs..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select
            className="input-field"
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="input-field"
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              paymentStatus: e.target.value === 'all' ? undefined : e.target.value 
            }))}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partially-paid">Partially Paid</option>
          </select>
          <div></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <DataTable
          data={jobsData?.data || []}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {modalMode === 'create' ? 'Add Job' : 
               modalMode === 'edit' ? 'Edit Job' : 'Job Details'}
            </h3>
            <div className="space-y-4">
              <p>Job modal content would go here</p>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                {modalMode !== 'view' && (
                  <Button>
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
