import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { apiClient } from '../lib/api';
import { Customer, SearchFilters } from '../types';
import { formatDate, debounce } from '../lib/utils';
import { DataTable } from '../components/UI/DataTable';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper<Customer>();

export function Customers() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');

  const queryClient = useQueryClient();

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => apiClient.getCustomers(filters),
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete customer');
    },
  });

  const handleSearch = debounce((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, 300);

  const handleView = (_customer: Customer) => {
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (_customer: Customer) => {
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      deleteCustomerMutation.mutate(customer.id);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setShowModal(true);
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div>
          <div className="font-medium text-gray-900">{info.getValue()}</div>
          {info.row.original.businessName && (
            <div className="text-sm text-gray-500">{info.row.original.businessName}</div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleView(info.row.original)}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(info.row.original)}
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search customers..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <DataTable
          data={customersData?.data || []}
          columns={columns}
          loading={isLoading}
        />
      </div>

      {/* Modal placeholder - would implement actual modal component */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {modalMode === 'create' ? 'Add Customer' : 
               modalMode === 'edit' ? 'Edit Customer' : 'Customer Details'}
            </h3>
            <div className="space-y-4">
              <p>Modal content would go here</p>
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
