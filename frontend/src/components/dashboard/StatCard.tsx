import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string | number;
    increase: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-derive-grey">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-derive-purple">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span className={change.increase ? 'text-green-500' : 'text-derive-bright-red'}>
                {change.increase ? '↑' : '↓'} {change.value}
              </span>
              <span className="ml-1 text-xs text-derive-grey">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-derive-purple/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
} 