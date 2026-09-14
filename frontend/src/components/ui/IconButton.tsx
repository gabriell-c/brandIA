import React from 'react';

interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  children,
  variant = 'ghost',
  size = 'md',
  tooltip,
}) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`
        inline-flex items-center justify-center rounded-lg
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-2' : 'p-2.5'}
        ${variant === 'primary' && 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20'}
        ${variant === 'secondary' && 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700'}
        ${variant === 'ghost' && 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700'}
        ${variant === 'destructive' && 'text-red-600 hover:bg-red-50 focus:ring-red-500 dark:text-red-400 dark:hover:bg-red-900/20'}
      `}
    >
      {children}
    </button>
  );
};