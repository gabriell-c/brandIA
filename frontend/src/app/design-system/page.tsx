import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeRoute="/design-system" />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            设计系统
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                颜色系统
              </h2>
              <div className="space-y-3">
                {['Primary', 'Secondary', 'Accent', 'Success', 'Warning', 'Error'].map((color) => (
                  <div key={color} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{color}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded bg-blue-500" />
                      <span className="text-sm text-gray-500 font-mono">#3B82F6</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                字体系统
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Heading</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Inter' }}>
                    Heading Text
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Body</p>
                  <p className="text-base text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter' }}>
                    Body text for content
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mono</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    const code = "monospace";
                  </code>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                间距系统
              </h2>
              <div className="space-y-2">
                {[4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
                  <div key={size} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{size}px</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-500" style={{ width: `${size / 4}px`, height: '16px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                圆角系统
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {[0, 4, 8, 12, 16, 24, 9999].map((radius) => (
                  <div key={radius} className="text-center">
                    <div
                      className="bg-blue-500 mx-auto mb-2"
                      style={{ width: '48px', height: '48px', borderRadius: radius }}
                    />
                    <span className="text-xs text-gray-500">{radius}px</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}