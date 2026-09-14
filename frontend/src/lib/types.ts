// TypeScript type definitions

export interface Project {
  id: number;
  name: string;
  description?: string;
  business_name?: string;
  business_segment?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  project_id: number;
  business_name?: string;
  segment?: string;
  tone_of_voice?: string;
  palette?: Record<string, string>;
  typography?: Record<string, string>;
  logo_svg?: string;
  created_at: string;
}

export interface DesignSystem {
  id: number;
  brand_id: number;
  tokens?: Record<string, any>;
  components?: Record<string, any>;
  created_at: string;
}

export interface AIConfig {
  provider: string;
  base_url: string;
  api_key: string;
  model: string;
  configured: boolean;
}

export interface BrandingResult {
  brand_name: string;
  tagline?: string;
  palette: Record<string, string>;
  typography: Record<string, string>;
  explanation: string;
}

export interface PaletteValidation {
  colors: string[];
  accessibility: {
    passes_wcag_aa: boolean;
    passes_wcag_aaa: boolean;
  };
}

export interface ExportTokens {
  json: Record<string, any>;
  css_variables: string;
  tailwind_config: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}