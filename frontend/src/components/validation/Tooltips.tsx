import React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  if (disabled) return <>{children}</>;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900'
  };

  return (
    <div 
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs',
            'animate-in fade-in zoom-in-95 duration-200',
            positionClasses[position]
          )}
        >
          {content}
          <div className={cn(
            'absolute w-0 h-0',
            arrowClasses[position]
          )} />
        </div>
      )}
    </div>
  );
};

interface FieldHelpProps {
  text: string;
  link?: { url: string; label: string };
  className?: string;
}

export const FieldHelp: React.FC<FieldHelpProps> = ({ text, link, className }) => {
  return (
    <div className={cn('flex items-start gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400', className)}>
      <svg 
        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 019 0z" 
        />
      </svg>
      <span>{text}</span>
      {link && (
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {link.label}
        </a>
      )}
    </div>
  );
};

interface InfoBannerProps {
  title: string;
  description: string;
  icon?: 'info' | 'help' | 'tip';
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  description,
  icon = 'info',
  className
}) => {
  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 019 0z" />
      </svg>
    ),
    help: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 019 0z" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  };

  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-lg border',
      icon === 'info' && 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
      icon === 'help' && 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200',
      icon === 'tip' && 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200',
      className
    )}>
      <div className={cn(
        'flex-shrink-0 w-5 h-5',
        icon === 'info' && 'text-blue-500',
        icon === 'help' && 'text-purple-500',
        icon === 'tip' && 'text-amber-500'
      )}>
        {icons[icon]}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
};

interface HelpTextProps {
  text: string;
  className?: string;
}

export const HelpText: React.FC<HelpTextProps> = ({ text, className }) => {
  return (
    <p className={cn('text-xs text-gray-500 dark:text-gray-400 italic', className)}>
      {text}
    </p>
  );
};

interface FormFieldWrapperProps {
  label: string;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  helpText,
  error,
  children,
  className
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {helpText && (
          <Tooltip content={helpText}>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Help"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 019 0z" />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {!error && helpText && (
        <FieldHelp text={helpText} />
      )}
    </div>
  );
};

export { Tooltip, FieldHelp, InfoBanner, HelpText };