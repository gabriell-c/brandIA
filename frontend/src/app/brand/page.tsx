import React from 'react';
import { BrandingForm } from '@/components/forms/BrandingForm';
import { BrandResults } from '@/components/branding/BrandResults';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function BrandPage() {
  const [brandResult, setBrandResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFormComplete = async (projectId: number, formData: any) => {
    setIsLoading(true);
    try {
      // Call API to generate branding
      const response = await fetch('http://localhost:5001/api/v1/ai-config/brand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          business_name: formData.businessName,
          segment: formData.segment,
          tone_of_voice: formData.toneOfVoice,
        }),
      });
      const data = await response.json();
      setBrandResult(data);
    } catch (error) {
      console.error('Failed to generate branding:', error);
      alert('生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'json' | 'css' | 'tailwind') => {
    if (!brandResult) return;
    
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (format) {
      case 'json':
        content = JSON.stringify(brandResult, null, 2);
        filename = `${brandResult.brand_name}-design-tokens.json`;
        mimeType = 'application/json';
        break;
      case 'css':
        content = ':root {\n';
        Object.entries(brandResult.palette).forEach(([name, color]) => {
          content += `  --${name}: ${color};\n`;
        });
        content += '}';
        filename = `${brandResult.brand_name}-css-variables.css`;
        mimeType = 'text/css';
        break;
      case 'tailwind':
        content = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
        Object.entries(brandResult.palette).forEach(([name, color]) => {
          content += `        '${name}': '${color}',\n`;
        });
        content += `      },\n    },\n  },\n}`;
        filename = `${brandResult.brand_name}-tailwind.config.js`;
        mimeType = 'text/javascript';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeRoute="/brand" />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            生成品牌
          </h1>

          {!brandResult ? (
            <BrandingForm onComplete={handleFormComplete} />
          ) : (
            <div className="space-y-6">
              <BrandResults data={brandResult} onExport={handleExport} />
              <div className="flex justify-center">
                <button
                  onClick={() => setBrandResult(null)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  重新生成
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}