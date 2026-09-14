import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar activeRoute="/" />
      
      {/* Hero Section */}
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI驱动的<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">品牌设计系统</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            使用AI生成专业级品牌标识、调色板和字体方案。100%本地运行，支持自有API密钥。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/brand">
              <Button size="lg" className="px-8 py-4 text-lg">
                开始生成品牌
              </Button>
            </Link>
            <Link href="/design-system">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                查看设计系统
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            核心功能
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI品牌生成
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                基于您的 business 信息，AI自动生成配色方案、字体搭配和品牌理念说明。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">♿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                WCAG 无障碍验证
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                自动检测配色对比度，确保符合 WCAG AA/AAA 标准，让设计更包容。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                多格式导出
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                一键导出为 JSON、CSS Variables、Tailwind Config，无缝接入项目。
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">100%</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">本地运行</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">BYOK</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">自带API密钥</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">WCAG</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">无障碍验证</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">3+</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2">导出格式</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}