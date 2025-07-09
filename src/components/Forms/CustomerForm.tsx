import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '@/types';
import { Input, Textarea } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { Modal, ModalFooter } from '@/components/UI/Modal';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  BuildingOfficeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Customer>) => Promise<void>;
  customer?: Customer | null;
  mode: 'create' | 'edit' | 'view';
  loading?: boolean;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  businessName: string;
  notes: string;
}

export function CustomerForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customer, 
  mode,
  loading = false 
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      businessName: '',
      notes: ''
    }
  });

  // Reset form when customer changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        businessName: customer?.businessName || customer?.business_name || '',
        notes: customer?.notes || ''
      });
    }
  }, [customer, isOpen, reset]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Customer';
      case 'edit': return 'Edit Customer';
      case 'view': return 'Customer Details';
      default: return 'Customer';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              leftIcon={<UserIcon className="h-5 w-5" />}
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors.name?.message}
              disabled={isReadOnly}
              placeholder="Enter customer's full name"
            />
            
            <Input
              label="Business Name"
              leftIcon={<BuildingOfficeIcon className="h-5 w-5" />}
              {...register('businessName')}
              error={errors.businessName?.message}
              disabled={isReadOnly}
              placeholder="Enter business name (optional)"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Contact Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              leftIcon={<EnvelopeIcon className="h-5 w-5" />}
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
              disabled={isReadOnly}
              placeholder="customer@example.com"
            />
            
            <Input
              label="Phone Number"
              type="tel"
              leftIcon={<PhoneIcon className="h-5 w-5" />}
              {...register('phone')}
              error={errors.phone?.message}
              disabled={isReadOnly}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <Input
            label="Address"
            leftIcon={<MapPinIcon className="h-5 w-5" />}
            {...register('address')}
            error={errors.address?.message}
            disabled={isReadOnly}
            placeholder="Street address, city, state, zip code"
          />
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
            placeholder="Any additional notes about this customer..."
            rows={4}
          />
        </div>

        {/* Customer Preview (for view mode) */}
        {mode === 'view' && customer && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Customer Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900">
                  {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
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
              {mode === 'create' ? 'Create Customer' : 'Save Changes'}
            </Button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
}