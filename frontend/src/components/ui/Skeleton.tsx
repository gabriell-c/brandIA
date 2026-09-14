import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text', 
  width, 
  height,
  ...props 
}) => {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  
  const sizeStyles = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? '1rem' : undefined),
  };
  
  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={sizeStyles}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const CardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton variant="rectangular" height="200px" width="100%" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="80%" />
  </div>
);

export const BrandingFormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton variant="text" width="30%" />
    <div className="grid grid-cols-4 gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height="40px" />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height="40px" />
      ))}
    </div>
    <Skeleton variant="rectangular" width="120px" height="44px" />
  </div>
);

export const BrandResultsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="40%" height="32px" />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width="120px" height="40px" />
        <Skeleton variant="rectangular" width="120px" height="40px" />
      </div>
    </div>
    <div className="grid grid-cols-6 gap-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height="80px" />
      ))}
    </div>
    <Skeleton variant="text" width="80%" />
  </div>
);

export const NavbarSkeleton: React.FC = () => (
  <div className="h-16 flex items-center justify-between">
    <Skeleton variant="circular" width="32px" height="32px" />
    <div className="flex items-center space-x-4">
      <Skeleton variant="text" width="80px" />
      <Skeleton variant="text" width="80px" />
      <Skeleton variant="text" width="100px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
  </div>
);

export const FeatureCardsSkeleton: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton variant="circular" width="56px" height="56px" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    ))}
  </div>
);

export const ExportTabsSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex space-x-1 w-fit">
      <Skeleton variant="rectangular" width="80px" height="36px" />
      <Skeleton variant="rectangular" width="120px" height="36px" />
      <Skeleton variant="rectangular" width="140px" height="36px" />
    </div>
    <Skeleton variant="rectangular" height="200px" />
  </div>
);