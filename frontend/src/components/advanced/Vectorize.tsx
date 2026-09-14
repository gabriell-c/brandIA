import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VectorizeProps {
  onVectorize?: (svg: string) => void;
  className?: string;
}

const Vectorize: React.FC<VectorizeProps> = ({ onVectorize, className }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      
      // Simulate vectorization (in real app, call API)
      setTimeout(() => {
        const generatedSvg = generatePlaceholderSvg(file.name);
        setSvg(generatedSvg);
        onVectorize?.(generatedSvg);
        setIsProcessing(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const generatePlaceholderSvg = (filename: string) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" fill="#f0f0f0" stroke="#ccc"/>
  <text x="100" y="90" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">Vectorized</text>
  <text x="100" y="110" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#999">${filename}</text>
</svg>`;
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vectorized-logo.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload PNG/JPG
        </button>
        
        {svg && (
          <button
            onClick={downloadSvg}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download SVG
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {preview && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium mb-2">Original</p>
            <img src={preview} alt="Original" className="max-w-full h-auto" />
          </div>
        )}
        
        {svg && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium mb-2">Vectorized</p>
            <div 
              className="max-w-full h-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      )}
    </div>
  );
};

export { Vectorize };