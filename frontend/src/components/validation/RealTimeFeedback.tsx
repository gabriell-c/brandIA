import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RealTimeFeedbackProps {
  isValidating: boolean;
  validationStatus?: 'idle' | 'validating' | 'valid' | 'invalid';
  message?: string;
  className?: string;
}

export const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({
  isValidating,
  validationStatus = 'idle',
  message,
  className
}) => {
  if (!message && !isValidating && validationStatus === 'idle') return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {isValidating && (
        <>
          <svg 
            className="animate-spin h-4 w-4 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-600 dark:text-blue-400">Validating...</span>
        </>
      )}
      {!isValidating && validationStatus === 'valid' && (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600 dark:text-green-400">{message || 'Valid!'}</span>
        </>
      )}
      {!isValidating && validationStatus === 'invalid' && (
        <>
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-600 dark:text-red-400">{message || 'Invalid input'}</span>
        </>
      )}
    </div>
  );
};

interface LivePreviewProps {
  palette: Record<string, string>;
  typography: Record<string, string>;
  className?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  palette,
  typography,
  className
}) => {
  if (!palette || Object.keys(palette).length === 0) {
    return (
      <div className={cn('p-4 bg-gray-50 dark:bg-gray-800 rounded-lg', className)}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Preview will appear here as you configure your brand
        </p>
      </div>
    );
  }

  const primaryColor = palette.primary || '#3B82F6';
  const secondaryColor = palette.secondary || '#10B981';
  const accentColor = palette.accent || '#F59E0B';
  const bgColor = palette.light || '#F9FAFB';
  const textColor = palette.dark || '#111827';
  const headingFont = typography?.heading || 'Inter';
  const bodyFont = typography?.body || 'Inter';

  return (
    <div className={cn('p-6 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: `'${headingFont}', sans-serif` }}
        >
          Brand Preview
        </h1>
        <p 
          className="text-sm mb-4"
          style={{ fontFamily: `'${bodyFont}', sans-serif` }}
        >
          This is how your brand will look with the selected colors and typography.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="px-4 py-2 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: secondaryColor }}
          >
            Secondary
          </button>
          <button
            className="px-4 py-2 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Accent
          </button>
        </div>

        <div className="flex gap-3">
          <div 
            className="w-12 h-12 rounded-lg border"
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="w-12 h-12 rounded-lg border"
            style={{ backgroundColor: secondaryColor }}
          />
          <div 
            className="w-12 h-12 rounded-lg border"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  type?: 'card' | 'text' | 'button' | 'circle';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  className
}) => {
  const baseClasses = 'animate-pulse rounded bg-gray-200 dark:bg-gray-700';
  
  const variants = {
    card: 'h-32 w-full',
    text: 'h-4 w-full',
    button: 'h-10 w-24',
    circle: 'h-10 w-10 rounded-full'
  };

  return (
    <div 
      className={cn(baseClasses, variants[type], className)}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  type?: 'skeleton' | 'spinner';
  message?: string;
  children?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  type = 'skeleton',
  message = 'Loading...',
  children
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="space-y-4">
      {type === 'skeleton' ? (
        <>
          <Skeleton type="card" />
          <Skeleton type="text" />
          <Skeleton type="text" className="w-3/4" />
          <Skeleton type="button" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <svg 
            className="animate-spin h-8 w-8 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      )}
    </div>
  );
};