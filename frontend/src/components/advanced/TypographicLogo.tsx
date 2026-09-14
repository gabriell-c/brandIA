import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TypographicLogoProps {
  onGenerate?: (variations: Record<string, string>) => void;
  className?: string;
}

const TypographicLogo: React.FC<TypographicLogoProps> = ({ onGenerate, className }) => {
  const [text, setText] = useState('Brand');
  const [font, setFont] = useState('Inter');
  const [color, setColor] = useState('#3B82F6');
  const [variations, setVariations] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins',
    'Playfair Display', 'Merriweather', 'Georgia',
    'Space Grotesk', 'IBM Plex Sans', 'Nunito',
    'Oswald', 'JetBrains Mono', 'Fira Code'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      const generated = generateVariations(text, font, color);
      setVariations(generated);
      onGenerate?.(generated);
      setIsGenerating(false);
    }, 1000);
  };

  const generateVariations = (text: string, font: string, color: string) => {
    const variations: Record<string, string> = {};
    
    // Standard
    variations.standard = generateSvg(text, font, 700, color);
    // Bold
    variations.bold = generateSvg(text, font, 800, color);
    // Light
    variations.light = generateSvg(text, font, 300, color);
    // Inverted
    variations.inverted = generateSvg(text, font, 700, '#FFFFFF', '#111827');
    
    return variations;
  };

  const generateSvg = (
    text: string,
    font: string,
    weight: number,
    color: string,
    bg: string = 'transparent'
  ) => {
    const width = 400;
    const height = 120;
    const fontSize = 48;
    const x = width / 2;
    const y = height / 2 + fontSize / 3;
    
    const bgRect = bg !== 'transparent' 
      ? `<rect width="${width}" height="${height}" fill="${bg}"/>`
      : '';
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${bgRect}
  <text 
    x="${x}" 
    y="${y}" 
    text-anchor="middle"
    font-family="${font}, sans-serif"
    font-weight="${weight}"
    font-size="${fontSize}"
    fill="${color}"
    dominant-baseline="middle"
  >
    ${text}
  </text>
</svg>`;
  };

  const downloadVariation = (key: string) => {
    const svg = variations[key];
    if (!svg) return;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-${text.toLowerCase()}-${key}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Enter text"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium">Font</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            {fonts.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border rounded-md cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !text.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Logo'}
      </button>

      {Object.keys(variations).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(variations).map(([key, svg]) => (
              <div key={key} className="space-y-2">
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <button
                    onClick={() => downloadVariation(key)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { TypographicLogo };