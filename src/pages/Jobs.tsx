import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { Job, SearchFilters } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/UI/Button';
import { JobForm } from '@/components/Forms/JobForm';
import { ConfirmModal } from '@/components/UI/Modal';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { Card, CardContent } from '@/components/UI/Card';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Job>();

export function Jobs() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const queryClient = useQueryClient();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => apiClient.getJobs(filters),
  });

  const createJobMutation = useMutation({
    mutationFn: (data: Partial<Job>) => apiClient.createJob(data as Omit<Job, 'id' | 'createdAt' | 'updatedAt'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create job');
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) => 
      apiClient.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
      setShowDeleteModal(false);
      setJobToDelete(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    },
  });

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    setSelectedJob(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleFormSubmit = async (data: Partial<Job>) => {
    if (modalMode === 'create') {
      await createJobMutation.mutateAsync(data);
    } else if (modalMode === 'edit' && selectedJob) {
      await updateJobMutation.mutateAsync({ id: selectedJob.id, data });
    }
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete.id);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Job Details',
      cell: (info) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <BriefcaseIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {info.getValue()}
              {getPriorityIcon(info.row.original.priority || '')}
            </div>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <UserIcon className="h-3 w-3 mr-1" />
              {info.row.original.customerName || 'Unknown Customer'}
            </div>
            {info.row.original.location && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                📍 {info.row.original.location}
              </div>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => (
        <StatusBadge 
          status={info.getValue() || 'medium'} 
          variant="dot"
        />
      ),
    }),
    columnHelper.accessor('scheduledDate', {
      header: 'Schedule',
      cell: (info) => {
        const date = info.getValue() || info.row.original.due_date;
        return (
          <div className="text-sm">
            {date ? (
              <div className="flex items-center text-gray-900">
                <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                {formatDate(date, 'MMM d, yyyy')}
              </div>
            ) : (
              <span className="text-gray-400">Not scheduled</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('estimatedHours', {
      header: 'Time',
      cell: (info) => {
        const estimated = info.getValue() || info.row.original.estimated_hours || 0;
        const actual = info.row.original.actualHours || info.row.original.actual_hours || 0;
        return (
          <div className="text-sm space-y-1">
            <div className="flex items-center text-gray-900">
              <ClockIcon className="h-3 w-3 mr-1 text-gray-400" />
              {estimated}h est.
            </div>
            {actual > 0 && (
              <div className="text-xs text-gray-500">
                {actual}h actual
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Amount',
      cell: (info) => {
        const amount = info.getValue() || info.row.original.estimated_cost || 0;
        const paymentStatus = info.row.original.paymentStatus;
        return (
          <div className="text-sm space-y-1">
            <div className="flex items-center text-gray-900 font-medium">
              <CurrencyDollarIcon className="h-3 w-3 mr-1 text-gray-400" />
              {formatCurrency(amount)}
            </div>
            {paymentStatus && (
              <StatusBadge status={paymentStatus} />
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleView(info.row.original);
            }}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(info.row.original);
            }}
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(info.row.original);
            }}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const jobs = jobsData?.data || [];
  
  // Calculate stats
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const totalRevenue = jobs
    .filter(job => job.status === 'completed')
    .reduce((sum, job) => sum + (job.totalAmount || job.actual_cost || 0), 0);
  const unpaidAmount = jobs
    .filter(job => job.paymentStatus === 'unpaid')
    .reduce((sum, job) => sum + (job.totalAmount || job.estimated_cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BriefcaseIcon className="h-8 w-8 mr-3 text-blue-600" />
            Jobs
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all jobs, track progress, and monitor payments
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          icon={<PlusIcon className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Create Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Jobs</div>
                <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Completed</div>
                <div className="text-2xl font-bold text-gray-900">{completedJobs}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Unpaid</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(unpaidAmount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        data={jobs}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Search jobs by title, customer, or location..."
        emptyTitle="No jobs found"
        emptyDescription="Create your first job to start tracking work and payments."
        onRowClick={handleView}
      />

      {/* Job Form Modal */}
      <JobForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        job={selectedJob}
        mode={modalMode}
        loading={createJobMutation.isPending || updateJobMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteJobMutation.isPending}
      />
    </div>
  );
}