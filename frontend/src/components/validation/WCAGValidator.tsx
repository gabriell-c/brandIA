import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WCAGResult {
  color_name: string;
  color: string;
  against: string;
  ratio: number;
  level: 'pass_aa' | 'pass_aaa' | 'fail';
  pass_aa: boolean;
  pass_aaa: boolean;
  explanation: string;
}

interface WCAGValidatorProps {
  palette: Record<string, string>;
  text_color?: string;
  className?: string;
}

const WCAGValidator: React.FC<WCAGValidatorProps> = ({
  palette,
  text_color = '#000000',
  className
}) => {
  const [results, setResults] = useState<WCAGResult[]>([]);
  const [overallPass, setOverallPass] = useState<boolean>(true);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (!palette || Object.keys(palette).length === 0) return;

    // Calculate contrast ratios
    const calcResults: WCAGResult[] = [];
    let pass = true;
    const warn: string[] = [];

    for (const [name, color] of Object.entries(palette)) {
      const ratio = calculateContrast(color, text_color);
      const level = ratio >= 7 ? 'pass_aaa' : ratio >= 4.5 ? 'pass_aa' : 'fail';
      const passAA = level !== 'fail';
      
      calcResults.push({
        color_name: name,
        color,
        against: text_color,
        ratio,
        level,
        pass_aa: passAA,
        pass_aaa: level === 'pass_aaa',
        explanation: getExplanation(ratio)
      });

      if (!passAA) {
        pass = false;
        warn.push(`Color '${name}' (${color}) fails AA contrast against text`);
      }
    }

    setResults(calcResults);
    setOverallPass(pass);
    setWarnings(warn);
  }, [palette, text_color]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className={cn(
        'p-4 rounded-lg border',
        overallPass 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      )}>
        <div className="flex items-center gap-3">
          <span className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
            overallPass ? 'bg-green-500' : 'bg-red-500'
          )}>
            {overallPass ? '✓' : '✗'}
          </span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {overallPass ? 'WCAG AA Passed' : 'WCAG AA Failed'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {overallPass 
                ? 'All colors meet accessibility standards' 
                : `${warnings.length} color${warnings.length > 1 ? 's' : ''} need adjustment`
              }
            </p>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, idx) => (
            <div 
              key={idx}
              className={cn(
                'p-3 rounded-lg border flex items-center gap-3',
                result.level === 'pass_aaa' && 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
                result.level === 'pass_aa' && 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
                result.level === 'fail' && 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              )}
            >
              <div 
                className="w-10 h-10 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: result.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.color_name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {result.color}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    result.level === 'pass_aaa' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                    result.level === 'pass_aa' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                    result.level === 'fail' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  )}>
                    {result.level === 'pass_aaa' ? 'AAA' : result.level === 'pass_aa' ? 'AA' : 'Fail'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Ratio: {result.ratio.toFixed(2)}:1
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            Issues Found:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-400">
            {warnings.map((warn, idx) => (
              <li key={idx}>• {warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper functions
function calculateContrast(color1: string, color2: string): number {
  const l1 = getLuminance(hexToRgb(color1));
  const l2 = getLuminance(hexToRgb(color2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function getExplanation(ratio: number): string {
  if (ratio >= 7) return 'Excellent contrast - passes AAA';
  if (ratio >= 4.5) return 'Good contrast - passes AA';
  return 'Insufficient contrast - fails WCAG AA';
}

export { WCAGValidator };