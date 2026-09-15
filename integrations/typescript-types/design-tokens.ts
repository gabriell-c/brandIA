export type DesignToken = {
  name: string;
  value: string | number;
  type: 'color' | 'spacing' | 'typography' | 'border-radius' | 'shadow';
};

export type DesignTokens = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
};

export type FontFamily = {
  family: string;
  style: string;
  weight?: number;
};

export type ColorToken = {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  contrast?: {
    white: number;
    black: number;
    wcagAA: boolean;
    wcagAAA: boolean;
  };
};

export type SpacingToken = {
  name: string;
  value: string;
  rem: number;
  px: number;
};

export type TypographyToken = {
  name: string;
  family: string;
  size: string;
  weight: number;
  lineHeight: string;
  letterSpacing: string;
};

export const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    neutral: '#6B7280',
    light: '#F3F4F6',
    dark: '#111827',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  typography: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};