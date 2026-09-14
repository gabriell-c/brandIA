import React from 'react';
import { cn } from '@/lib/utils';

interface Indicator {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  message?: string;
}

interface LighthouseIndicatorProps {
  indicators: Indicator[];
  compact?: boolean;
  className?: string;
}

const LighthouseIndicator: React.FC<LighthouseIndicatorProps> = ({
  indicators,
  compact = false,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {indicators.map((ind) => (
        <Tooltip key={ind.id} label={ind.message || ind.label}>
          <div className={cn(
            'relative flex items-center justify-center',
            compact ? 'w-3 h-3' : 'w-6 h-6'
          )}>
            <div className={cn(
              'rounded-full',
              compact ? 'w-2.5 h-2.5' : 'w-5 h-5',
              ind.status === 'pass' && 'bg-green-500',
              ind.status === 'warning' && 'bg-yellow-500',
              ind.status === 'fail' && 'bg-red-500'
            )} />
            <div className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-75',
              ind.status === 'fail' && 'bg-red-400',
              ind.status === 'warning' && 'bg-yellow-400'
            )} style={{ animationDuration: '2s' }} />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
          {label}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: 'pass' | 'warning' | 'fail';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colors = {
    pass: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    fail: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium border rounded-full',
      sizes[size],
      colors[status]
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'pass' && 'bg-green-500',
        status === 'warning' && 'bg-yellow-500',
        status === 'fail' && 'bg-red-500'
      )} />
      {label}
    </span>
  );
};

interface ValidationStatusProps {
  indicators: Indicator[];
  showLabels?: boolean;
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  indicators,
  showLabels = true,
  className
}) => {
  const passCount = indicators.filter(i => i.status === 'pass').length;
  const warningCount = indicators.filter(i => i.status === 'warning').length;
  const failCount = indicators.filter(i => i.status === 'fail').length;
  const total = indicators.length;

  return (
    <div className={cn('space-y-3', className)}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Validation Status
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {passCount}/{total} passed
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <LighthouseIndicator 
          indicators={indicators} 
          compact 
          className="flex-1" 
        />
        
        {showLabels && (
          <div className="flex gap-2 text-xs">
            {passCount > 0 && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {passCount}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                {warningCount}
              </span>
            )}
            {failCount > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {failCount}
              </span>
            )}
          </div>
        )}
      </div>

      {indicators.some(i => i.status === 'fail' || i.status === 'warning') && showLabels && (
        <div className="space-y-1">
          {indicators.filter(i => i.status !== 'pass').map((ind) => (
            <div key={ind.id} className="flex items-center gap-2 text-xs">
              <span className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                ind.status === 'fail' && 'bg-red-500',
                ind.status === 'warning' && 'bg-yellow-500'
              )} />
              <span className="text-gray-700 dark:text-gray-300">
                {ind.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { LighthouseIndicator, Tooltip };