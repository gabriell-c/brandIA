import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Storybook - Component Showcase',
  description: 'Interactive component documentation'
};

export default function StorybookPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Design System Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive component documentation and examples
          </p>
        </header>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Buttons</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sizes</h3>
                <div className="flex items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Inputs</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-4 max-w-md">
              <Input label="Text Input" placeholder="Enter text..." />
              <Input label="Email" type="email" placeholder="email@example.com" error="Invalid email address" />
              <Input label="Password" type="password" placeholder="Enter password..." />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Cards</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="info" title="Info Card">
                <p className="text-sm text-gray-600 dark:text-gray-400">Information card with blue accent</p>
              </Card>
              <Card variant="success" title="Success Card">
                <p className="text-sm text-gray-600 dark:text-gray-400">Success state card with green accent</p>
              </Card>
              <Card variant="warning" title="Warning Card">
                <p className="text-sm text-gray-600 dark:text-gray-400">Warning state card with yellow accent</p>
              </Card>
              <Card variant="error" title="Error Card">
                <p className="text-sm text-gray-600 dark:text-gray-400">Error state card with red accent</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Progress Bar</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <ProgressBar value={25} label="25% Complete" />
              <ProgressBar value={50} label="50% Complete" />
              <ProgressBar value={75} label="75% Complete" />
              <ProgressBar value={100} label="100% Complete" />
            </div>
          </div>
        </section>

        {/* Skeleton */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Skeleton</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <Skeleton type="rectangular" className="h-8 w-full" />
              <Skeleton type="rectangular" className="h-4 w-3/4" />
              <Skeleton type="rectangular" className="h-4 w-1/2" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}