import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { client } from '@/lib/api-client';

interface Tier {
  name: string;
  monthly_limit: number;
  requests_per_minute: number;
  price?: number;
  features: string[];
}

interface PricingTier {
  [key: string]: Tier;
}

interface PricingProps {
  className?: string;
}

const Pricing: React.FC<PricingProps> = ({ className }) => {
  const [tiers, setTiers] = useState<PricingTier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const data = await client.get('/api-keys/tiers');
      setTiers(data.tiers);
    } catch (error) {
      console.error('Failed to fetch pricing tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const tierOrder = ['free', 'basic', 'premium', 'enterprise'];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing Plans
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the plan that fits your needs
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : tiers && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tierOrder.map((tierKey) => {
            const tier = tiers[tierKey];
            const isPopular = tierKey === 'basic';
            
            return (
              <div
                key={tierKey}
                className={cn(
                  'relative p-6 border rounded-xl bg-white dark:bg-gray-800 transition-all hover:shadow-lg',
                  isPopular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700'
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                  {tier.price ? (
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${tier.price}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                      Free
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Limit</span>
                    <span className="font-medium">{tier.monthly_limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Requests/min</span>
                    <span className="font-medium">{tier.requests_per_minute}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={cn(
                    'w-full py-2 rounded-lg font-medium transition-colors',
                    isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {tier.price ? 'Get Started' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Need a Custom Plan?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Contact us for enterprise solutions with custom pricing, dedicated support, and SLA guarantees.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export { Pricing };