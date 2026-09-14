import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyPreviewProps {
  heading: string;
  body: string;
  mono: string;
}

export const TypographyPreview: React.FC<TypographyPreviewProps> = ({ heading, body, mono }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Heading ({heading})</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: heading }}>
          The quick brown fox
        </h1>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Body ({body})</p>
        <p className="text-base text-gray-700 dark:text-gray-300" style={{ fontFamily: body }}>
          The quick brown fox jumps over the lazy dog. Font pairing creates harmony and hierarchy.
        </p>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Mono ({mono})</p>
        <code className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: mono }}>
          const code = "monospace font";
        </code>
      </div>
    </div>
  );
};