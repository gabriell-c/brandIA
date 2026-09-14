/**
 * P3 - Frontend Core Implementation
 */

const P3_FILES = {
  // Components
  components: [
    'src/components/ui/Button.tsx',
    'src/components/ui/Input.tsx',
    'src/components/ui/Card.tsx',
    'src/components/ui/Modal.tsx',
    'src/components/ui/ProgressBar.tsx',
    'src/components/layout/Navbar.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/ThemeToggle.tsx',
    'src/components/forms/BrandingForm.tsx',
    'src/components/branding/ColorPalette.tsx',
    'src/components/branding/TypographyPreview.tsx',
    'src/components/branding/BrandResults.tsx',
  ],
  // Pages
  pages: [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/app/brand/page.tsx',
    'src/app/design-system/page.tsx',
    'src/app/export/page.tsx',
  ],
  // Lib
  lib: [
    'src/lib/utils.ts',
    'src/lib/api.ts',
    'src/lib/validation.ts',
    'src/lib/types.ts',
  ],
  // Config
  config: [
    'next.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'tsconfig.json',
  ]
};

module.exports = P3_FILES;