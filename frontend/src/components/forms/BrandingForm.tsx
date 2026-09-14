'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { createProject, generateBranding } from '@/lib/api';

const brandSchema = z.object({
  businessName: z.string().min(2, 'Name must be at least 2 characters'),
  segment: z.string().min(1, 'Please select a segment'),
  toneOfVoice: z.string().min(1, 'Please select a tone of voice'),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandingFormProps {
  onComplete: (projectId: number, brandData: BrandFormData) => void;
}

export const BrandingForm: React.FC<BrandingFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      businessName: '',
      segment: '',
      toneOfVoice: '',
    },
  });

  const businessName = watch('businessName');
  const segment = watch('segment');
  const toneOfVoice = watch('toneOfVoice');

  const segments = ['Technology', 'Healthcare', 'Finance', 'Education', 'Food', 'Fashion', 'Travel', 'Entertainment'];
  const tones = ['Professional', 'Friendly', 'Bold', 'Elegant', 'Playful', 'Serious'];

  const onSubmit = async (data: BrandFormData) => {
    try {
      setIsGenerating(true);
      // Create project first
      const project = await createProject({
        name: data.businessName,
        business_name: data.businessName,
        business_segment: data.segment,
      });
      setProjectId(project.id);

      // Generate branding
      const brandResult = await generateBranding({
        project_id: project.id,
        business_name: data.businessName,
        segment: data.segment,
        tone_of_voice: data.toneOfVoice,
      });

      onComplete(project.id, data);
    } catch (error) {
      console.error('Failed to generate branding:', error);
      alert('Failed to generate branding. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(3, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar value={step} max={3} className="mb-8" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Step 1: Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Business Name"
                placeholder="Enter your business name"
                {...register('businessName')}
                error={errors.businessName?.message}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                onClick={nextStep}
                disabled={!businessName.trim()}
              >
                Next Step
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Step 2: Business Segment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Segment
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {segments.map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => setValue('segment', seg)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        segment === seg
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
                {errors.segment && (
                  <p className="mt-1 text-sm text-red-600">{errors.segment.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep} disabled={!segment}>
                Next Step
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Step 3: Tone of Voice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Tone of Voice
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setValue('toneOfVoice', tone)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        toneOfVoice === tone
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                {errors.toneOfVoice && (
                  <p className="mt-1 text-sm text-red-600">{errors.toneOfVoice.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit" isLoading={isGenerating}>
                Generate Branding
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};