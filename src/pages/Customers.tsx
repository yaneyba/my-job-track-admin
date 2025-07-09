import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { Customer, SearchFilters } from '@/types';
import { formatDate } from '@/lib/utils';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/UI/Button';
import { CustomerForm } from '@/components/Forms/CustomerForm';
import { ConfirmModal } from '@/components/UI/Modal';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Customer>();

export function Customers() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const queryClient = useQueryClient();

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => apiClient.getCustomers(filters),
  });

  const createCustomerMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => apiClient.createCustomer(data as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create customer');
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => 
      apiClient.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update customer');
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete customer');
    },
  });

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleFormSubmit = async (data: Partial<Customer>) => {
    if (modalMode === 'create') {
      await createCustomerMutation.mutateAsync(data);
    } else if (modalMode === 'edit' && selectedCustomer) {
      await updateCustomerMutation.mutateAsync({ id: selectedCustomer.id, data });
    }
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id);
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Customer',
      cell: (info) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlusIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
            {info.row.original.businessName && (
              <div className="text-sm text-gray-500 flex items-center">
                <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                {info.row.original.businessName}
              </div>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Contact',
      cell: (info) => (
        <div className="space-y-1">
          {info.getValue() && (
            <div className="text-sm text-gray-900 flex items-center">
              <EnvelopeIcon className="h-3 w-3 mr-2 text-gray-400" />
              {info.getValue()}
            </div>
          )}
          {info.row.original.phone && (
            <div className="text-sm text-gray-500 flex items-center">
              <PhoneIcon className="h-3 w-3 mr-2 text-gray-400" />
              {info.row.original.phone}
            </div>
          )}
          {!info.getValue() && !info.row.original.phone && (
            <span className="text-sm text-gray-400">No contact info</span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: (info) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {info.getValue() || <span className="text-gray-400">No address</span>}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatDate(info.getValue() || info.row.original.createdAt)}
        </div>
      ),
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

  const customers = customersData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-blue-600" />
            Customers
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your customer database and contact information
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          icon={<PlusIcon className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Customers</div>
                <div className="text-2xl font-bold text-gray-900">
                  {customers.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Business Customers</div>
                <div className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.businessName || c.business_name).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">With Email</div>
                <div className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.email).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        data={customers}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Search customers by name, email, or business..."
        emptyTitle="No customers found"
        emptyDescription="Get started by adding your first customer to the system."
        onRowClick={handleView}
      />

      {/* Customer Form Modal */}
      <CustomerForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
        mode={modalMode}
        loading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteCustomerMutation.isPending}
      />
    </div>
  );
}