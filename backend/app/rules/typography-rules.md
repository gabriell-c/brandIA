# Typography Rules for Design Systems

## Font Selection Principles

### Font Categories
1. **Sans-serif**: Clean, modern, versatile
   - Use for: Body text, UI elements, digital-first brands
   - Examples: Inter, Roboto, Open Sans, SF Pro

2. **Serif**: Traditional, elegant, authoritative
   - Use for: Headings, luxury brands, editorial
   - Examples: Playfair Display, Merriweather, Lora

3. **Monospace**: Technical, code, precision
   - Use for: Code blocks, technical data, accents
   - Examples: JetBrains Mono, Fira Code, SF Mono

4. **Display**: Decorative, headline-focused
   - Use for: Logo, hero text, special cases only
   - Examples: Clarendon, Bebas Neue

## Font Pairing Strategies

### Strategy 1: Contrast (Recommended)
Combine fonts with different characteristics:
- **Sans-serif heading + Serif body** - Modern meets traditional
- **Serif heading + Sans-serif body** - Classic meets clean
- **Display + Sans-serif** - Creative meets readable

### Strategy 2: Harmony
Use fonts with similar characteristics:
- **Sans-serif + Sans-serif** - Cohesive, safe
- Choose different weights/widths for variety

### Strategy 3: System Stack
Use web-safe font stacks:
```css
font-family: 'System Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## Type Scale (Modular Scale 1.25)

### Base Size: 16px (1rem)
```
xs:   0.75rem  (12px)   - Captions, footnotes
sm:   0.875rem (14px)   - Small text, labels
base: 1rem     (16px)    - Body text, primary
lg:   1.125rem (18px)   - Lead text, subhead
xl:   1.25rem  (20px)   - H4
2xl:  1.5rem   (24px)   - H3
3xl:  1.875rem (30px)   - H2
4xl:  2.25rem  (36px)   - H1
5xl:  3rem     (48px)   - Display
6xl:  3.75rem  (60px)   - Hero
```

### Web-Optimized Scale
```css
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
}
```

## Font Loading Best Practices

### Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
```

### Next.js Font Optimization
```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
```

### CSS Custom Properties
```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

html {
  font-family: var(--font-sans);
}
```

## Line Height Guidelines

### Body Text
- Regular: 1.5-1.625 (150-162.5%)
- Compact: 1.375 (137.5%)
- Relaxed: 1.75 (175%)

### Headings
- Display: 1.1-1.2
- Large: 1.2-1.3
- Standard: 1.25-1.375

### Code
- Monospace: 1.5

## Font Weight Scale

```
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

### Usage Guidelines
- Light: Decorative headings only
- Regular: Body text, paragraphs
- Medium: UI labels, secondary text
- Semibold: Section headings, emphasis
- Bold: H1-H3, important text
- Black: Display text, logo treatment

## Letter Spacing

```
--tracking-tight: -0.025em;
--tracking-normal: 0em;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Guidelines
- Small caps: +0.1em
- All caps headings: +0.025em to +0.05em
- Body text: Normal or tight
- Button text: Wide for all-caps

## Readability Rules

### Line Length
- Optimal: 45-75 characters (60-75 ideal)
- Max: 80 characters
- Min: 25 characters

### Font Size Minima
- Body text: 16px (1rem)
- Small text: 14px (0.875rem)
- UI elements: 12px (0.75rem)
- Never below: 11px

### Accessibility
- Never use less than 14px for body
- Never use less than 16px for important content
- Maintain 4.5:1 contrast for text
- Allow text scaling up to 200%

## Color-Typography Combinations

### High Contrast (Recommended)
- Dark text on light background: --text-primary on --bg-primary
- Light text on dark background: --text-inverse on --color-primary

### Low Contrast (Use Sparingly)
- Muted text: --text-muted for secondary info
- Subtle backgrounds: --bg-secondary for cards

## Font Stack Recommendations

### Modern Sans-Serif Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Classic Serif Stack
```css
font-family: 'Playfair Display', 'Merriweather', Georgia, 'Times New Roman', serif;
```

### Monospace Stack
```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace;
```

## Common Mistakes to Avoid

1. **Too many fonts** - Max 2-3 per project
2. **Overly decorative fonts** - Don't use display fonts for body text
3. **Poor hierarchy** - Use scale consistently
4. **Low contrast text** - Test readability
5. **Hard to read fonts** - Consider accessibility
6. **Inconsistent weights** - Use the scale