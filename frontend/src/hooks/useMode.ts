import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Mode = 'simple' | 'advanced';
const MODE_KEY = 'design_system_mode';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onChange,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    const newMode = mode === 'simple' ? 'advanced' : 'simple';
    onChange(newMode);
    localStorage.setItem(MODE_KEY, newMode);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className={cn(
        'text-sm font-medium transition-colors',
        mode === 'simple' 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400'
      )}>
        Simple
      </span>
      
      <button
        onClick={handleToggle}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          mode === 'advanced' 
            ? 'bg-blue-600 dark:bg-blue-500' 
            : 'bg-gray-300 dark:bg-gray-600'
        )}
        role="switch"
        aria-checked={mode === 'advanced'}
        aria-label={`Switch to ${mode === 'simple' ? 'advanced' : 'simple'} mode`}
      >
        <span 
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300',
            mode === 'advanced' && 'translate-x-6'
          )}
        />
      </button>
      
      <span className={cn(
        'text-sm font-medium transition-colors',
        mode === 'advanced' 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400'
      )}>
        Advanced
      </span>

      {isAnimating && (
        <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          {mode === 'simple' ? 'Switching to Advanced...' : 'Switching to Simple...'}
        </span>
      )}
    </div>
  );
};

export const useMode = () => {
  const [mode, setMode] = useState<Mode>('simple');

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY) as Mode;
    if (saved) {
      setMode(saved);
    }
  }, []);

  return { mode, setMode };
};