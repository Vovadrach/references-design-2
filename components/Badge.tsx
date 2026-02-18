
import React from 'react';
import { TripStatus } from '../types';

interface BadgeProps {
  status: TripStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case TripStatus.IN_TRANSIT:
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case TripStatus.COMPLETED:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case TripStatus.SCHEDULED:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-[10px] font-mono font-medium tracking-wide uppercase ${getStyles()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default Badge;
