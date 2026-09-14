import React from 'react';
import { DesignSystemViewer } from '@/components/viewer/DesignSystemViewer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface BrandData {
  brandName: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  explanation: string;
}

interface DesignSystemPageProps {
  brandData?: BrandData;
}

export default function DesignSystemPage({ brandData }: DesignSystemPageProps) {
  const brandName = brandData?.brandName || 'My Brand';
  const palette = brandData?.palette || {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    neutral: '#6B7280',
    light: '#F9FAFB',
    dark: '#111827'
  };
  const typography = brandData?.typography || {
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono'
  };

  const handleExport = (format: 'json' | 'css' | 'tailwind') => {
    console.log('Exporting as:', format);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeRoute="/design-system" />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <DesignSystemViewer
            brandName={brandName}
            palette={palette}
            typography={typography}
            onExport={handleExport}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}