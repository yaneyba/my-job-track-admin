import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Job } from '@/types';
import { Input, Textarea, Select } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { Modal, ModalFooter } from '@/components/UI/Modal';
import { apiClient } from '@/lib/api';
import { 
  BriefcaseIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Job>) => Promise<void>;
  job?: Job | null;
  mode: 'create' | 'edit' | 'view';
  loading?: boolean;
}

interface JobFormData {
  customerId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  scheduledDate: string;
  estimatedHours: number;
  hourlyRate: number;
  location: string;
  notes: string;
  paymentStatus: string;
}

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const paymentStatusOptions = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partially-paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' }
];

export function JobForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  job, 
  mode
}: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<JobFormData>({
    defaultValues: {
      customerId: '',
      title: '',
      description: '',
      status: 'scheduled',
      priority: 'medium',
      scheduledDate: '',
      estimatedHours: 0,
      hourlyRate: 0,
      location: '',
      notes: '',
      paymentStatus: 'unpaid'
    }
  });

  // Fetch customers for dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => apiClient.getCustomers(),
    enabled: isOpen && mode !== 'view'
  });

  const customers = customersData?.data || [];
  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: customer.businessName || customer.business_name || customer.name
  }));

  // Watch form values for calculations
  const estimatedHours = watch('estimatedHours');
  const hourlyRate = watch('hourlyRate');
  const estimatedTotal = (estimatedHours || 0) * (hourlyRate || 0);

  // Reset form when job changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        customerId: job?.customer_id || '',
        title: job?.title || '',
        description: job?.description || '',
        status: job?.status || 'scheduled',
        priority: job?.priority || 'medium',
        scheduledDate: job?.scheduledDate || job?.due_date?.split('T')[0] || '',
        estimatedHours: job?.estimated_hours || 0,
        hourlyRate: job?.hourlyRate || 0,
        location: job?.location || '',
        notes: job?.notes || '',
        paymentStatus: job?.paymentStatus || 'unpaid'
      });
    }
  }, [job, isOpen, reset]);

  const handleFormSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        totalAmount: estimatedTotal,
        estimatedHours: Number(data.estimatedHours),
        hourlyRate: Number(data.hourlyRate),
        status: data.status as 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        paymentStatus: data.paymentStatus as 'paid' | 'unpaid' | 'partially-paid'
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Job';
      case 'edit': return 'Edit Job';
      case 'view': return 'Job Details';
      default: return 'Job';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {mode === 'view' && job?.customerName ? (
                <Input
                  label="Customer"
                  value={job.customerName}
                  disabled
                  leftIcon={<UserIcon className="h-5 w-5" />}
                />
              ) : (
                <Select
                  label="Customer *"
                  options={[
                    { value: '', label: 'Select a customer...' },
                    ...customerOptions
                  ]}
                  {...register('customerId', { required: 'Customer is required' })}
                  error={errors.customerId?.message}
                  disabled={isReadOnly}
                />
              )}
            </div>
            
            <Input
              label="Job Title *"
              leftIcon={<BriefcaseIcon className="h-5 w-5" />}
              {...register('title', { 
                required: 'Job title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              })}
              error={errors.title?.message}
              disabled={isReadOnly}
              placeholder="Enter job title"
            />
          </div>
          
          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            disabled={isReadOnly}
            placeholder="Describe the job requirements and scope..."
            rows={3}
          />
        </div>

        {/* Status and Priority */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Status & Priority
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              {...register('status')}
              disabled={isReadOnly}
            />
            
            <Select
              label="Priority"
              options={priorityOptions}
              {...register('priority')}
              disabled={isReadOnly}
            />
            
            <Select
              label="Payment Status"
              options={paymentStatusOptions}
              {...register('paymentStatus')}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Scheduling and Location */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Scheduling & Location
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Scheduled Date"
              type="date"
              leftIcon={<CalendarIcon className="h-5 w-5" />}
              {...register('scheduledDate')}
              error={errors.scheduledDate?.message}
              disabled={isReadOnly}
            />
            
            <Input
              label="Location"
              leftIcon={<MapPinIcon className="h-5 w-5" />}
              {...register('location')}
              error={errors.location?.message}
              disabled={isReadOnly}
              placeholder="Job location or address"
            />
          </div>
        </div>

        {/* Pricing and Time */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Pricing & Time Estimates
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Estimated Hours"
              type="number"
              step="0.5"
              min="0"
              leftIcon={<ClockIcon className="h-5 w-5" />}
              {...register('estimatedHours', {
                min: { value: 0, message: 'Hours must be positive' }
              })}
              error={errors.estimatedHours?.message}
              disabled={isReadOnly}
              placeholder="0.0"
            />
            
            <Input
              label="Hourly Rate ($)"
              type="number"
              step="0.01"
              min="0"
              leftIcon={<CurrencyDollarIcon className="h-5 w-5" />}
              {...register('hourlyRate', {
                min: { value: 0, message: 'Rate must be positive' }
              })}
              error={errors.hourlyRate?.message}
              disabled={isReadOnly}
              placeholder="0.00"
            />
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Total
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 font-medium">
                ${estimatedTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Additional Information
          </h4>
          
          <Textarea
            label="Notes"
            {...register('notes')}
            error={errors.notes?.message}
            disabled={isReadOnly}
            placeholder="Any additional notes or special requirements..."
            rows={3}
          />
        </div>

        {/* Job Summary (for view mode) */}
        {mode === 'view' && job && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Job Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <div className="text-gray-900 font-medium">
                  {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <div className="text-gray-900 font-medium">
                  {job.updated_at ? new Date(job.updated_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Actual Hours:</span>
                <div className="text-gray-900 font-medium">
                  {job.actual_hours || 0} hrs
                </div>
              </div>
              <div>
                <span className="text-gray-500">Actual Cost:</span>
                <div className="text-gray-900 font-medium">
                  ${job.actual_cost || job.totalAmount || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        <ModalFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          
          {mode !== 'view' && (
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty && mode === 'edit'}
            >
              {mode === 'create' ? 'Create Job' : 'Save Changes'}
            </Button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
}