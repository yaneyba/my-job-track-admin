
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot';
  className?: string;
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[-_\s]/g, '');
    
    switch (normalizedStatus) {
      case 'completed':
      case 'paid':
      case 'active':
      case 'success':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-400'
        };
      case 'pending':
      case 'scheduled':
      case 'inprogress':
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-400'
        };
      case 'cancelled':
      case 'failed':
      case 'error':
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-400'
        };
      case 'unpaid':
      case 'overdue':
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-400'
        };
      case 'partiallypaid':
      case 'partial':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          dotColor: 'bg-orange-400'
        };
      case 'draft':
      case 'inactive':
      case 'disabled':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-400'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(status);
  const displayText = status.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        <span className="text-sm font-medium text-gray-900">{displayText}</span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.color,
        className
      )}
    >
      {displayText}
    </span>
  );
}