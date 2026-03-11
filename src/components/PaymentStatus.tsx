import type { FC } from 'react';

export type PaymentStatusType = 'pending' | 'confirmed' | 'rejected' | 'unknown';

interface PaymentStatusProps {
  status: PaymentStatusType;
  className?: string;
  showText?: boolean;
}

const PaymentStatus: FC<PaymentStatusProps> = ({ 
  status, 
  className = '', 
  showText = true 
}) => {
  const getStatusConfig = (status: PaymentStatusType) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '⏳',
          text: 'Pending',
          description: 'Payment submitted, awaiting admin confirmation'
        };
      case 'confirmed':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '✅',
          text: 'Confirmed',
          description: 'Payment verified and approved by admin'
        };
      case 'rejected':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '❌',
          text: 'Rejected',
          description: 'Payment rejected by admin'
        };
      case 'unknown':
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '❓',
          text: 'Unknown',
          description: 'Status unclear, requires support contact'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
      {showText && (
        <span className={`font-medium ${config.textColor}`}>
          {config.icon} {config.text}
        </span>
      )}
    </div>
  );
};

export const PaymentStatusBadge: FC<PaymentStatusProps & { description?: boolean }> = ({ 
  status, 
  className = '', 
  description = false 
}) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⏳',
      text: 'Pending',
      description: 'Payment submitted, awaiting admin confirmation'
    },
    confirmed: {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅',
      text: 'Confirmed',
      description: 'Payment verified and approved by admin'
    },
    rejected: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '❌',
      text: 'Rejected',
      description: 'Payment rejected by admin'
    },
    unknown: {
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: '❓',
      text: 'Unknown',
      description: 'Status unclear, requires support contact'
    }
  };

  const config2 = statusConfig[status] || statusConfig.unknown;

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config2.bgColor} ${config2.borderColor}`}>
        <div className={`w-2 h-2 rounded-full ${config2.color}`}></div>
        <span className={`text-sm font-medium ${config2.textColor}`}>
          {config2.icon} {config2.text}
        </span>
      </div>
      {description && (
        <p className={`text-xs ${config2.textColor} opacity-75 ml-1`}>
          {config2.description}
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
