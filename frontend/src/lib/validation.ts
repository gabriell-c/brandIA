import { z } from 'zod';

// Project schemas
export const projectSchema = z.object({
  name: z.string()
    .min(1, '项目名称不能为空')
    .max(255, '项目名称不能超过255个字符')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, '项目名称只能包含字母、数字、空格、横线、下划线或点'),
  description: z.string().max(1000).optional(),
  business_name: z.string().max(255).optional(),
  business_segment: z.string().max(100).optional(),
});

export type ProjectCreate = z.infer<typeof projectSchema>;
export type ProjectUpdate = Partial<ProjectCreate>;

// Brand schemas
export const brandSchema = z.object({
  project_id: z.number().int().positive('项目ID必须为正整数'),
  business_name: z.string().max(255).optional(),
  segment: z.string().max(100).optional(),
  tone_of_voice: z.string().max(50).optional(),
  palette: z.record(z.string()).optional(),
  typography: z.record(z.string()).optional(),
  logo_svg: z.string().optional(),
});

export type BrandCreate = z.infer<typeof brandSchema>;

// AI Config schemas
export const aiConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'ollama', 'custom']).default('openai'),
  base_url: z.string().url('请输入有效的URL').default('https://api.openai.com/v1'),
  api_key: z.string().min(1, 'API密钥不能为空').max(500),
  model: z.string().min(1).max(100).default('gpt-4o'),
});

export type AIConfigCreate = z.infer<typeof aiConfigSchema>;

// Branding generation schemas
export const brandingGenerateSchema = z.object({
  project_id: z.number().int().positive('项目ID必须为正整数'),
  business_name: z.string().min(1, '企业名称不能为空').max(255),
  segment: z.string().max(100).optional(),
  tone_of_voice: z.string().max(50).optional(),
});

export type BrandingGenerate = z.infer<typeof brandingGenerateSchema>;

// Palette validation schemas
export const paletteValidateSchema = z.object({
  palette: z.record(z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色值必须是有效的十六进制格式，如 #FF5733'))
    .min(1, '至少需要一种颜色'),
});

export type PaletteValidate = z.infer<typeof paletteValidateSchema>;

// Form validation helpers
export const validateField = <T>(schema: z.ZodType<T>, data: Partial<T>, field: keyof T) => {
  try {
    schema.parse({ [field]: data[field] });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || '验证失败';
    }
    return '验证失败';
  }
};

// Common segments and tones
export const SEGMENTS = [
  'Technology', 'Healthcare', 'Finance', 'Education',
  'Food', 'Fashion', 'Travel', 'Entertainment',
  'Sports', 'Real Estate', 'Automotive', 'Other'
];

export const TONES = [
  'Professional', 'Friendly', 'Bold', 'Elegant',
  'Playful', 'Serious', 'Innovative', 'Traditional'
];