# Color Rules for Design Systems

## WCAG Accessibility Requirements

### Contrast Ratios
- **AA Normal Text**: Minimum 4.5:1 contrast ratio
- **AA Large Text** (18pt+ or 14pt bold): Minimum 3:1 contrast ratio
- **AAA Normal Text**: Minimum 7:1 contrast ratio
- **AAA Large Text**: Minimum 4.5:1 contrast ratio

### Color Pair Testing
Always test these combinations:
- Primary on Light background
- Primary on Dark background
- Secondary on Light background
- Secondary on Dark background
- Accent on Light background
- Accent on Dark background
- Text on Primary
- Text on Secondary
- Text on Accent

## Color Harmony Principles

### Complementary
Colors opposite on the color wheel. High contrast, vibrant.
- Use one as dominant, other as accent
- Examples: Blue/Orange, Purple/Yellow, Red/Green

### Analogous
Colors adjacent on the color wheel. Harmonious, serene.
- Choose 3-5 colors within 90 degrees
- Vary saturation/lightness for hierarchy
- Examples: Blue/Blue-Green/Green

### Triadic
Three colors evenly spaced. Balanced, vibrant.
- One dominant, two accents
- Examples: Red/Yellow/Blue

### Split-Complementary
Base color + two adjacent to its complement.
- Less tension than complementary
- Good for UI with primary/secondary/accent

## Color Psychology by Industry

### Technology
- **Primary**: Blue (trust, intelligence, stability)
- **Secondary**: Purple (innovation, creativity)
- **Accent**: Cyan/Teal (modern, digital)

### Healthcare
- **Primary**: Blue/Green (health, trust, calm)
- **Secondary**: Teal (healing, balance)
- **Accent**: White/Light blue (cleanliness)

### Finance
- **Primary**: Blue (trust, security, stability)
- **Secondary**: Green (growth, wealth)
- **Accent**: Gold (premium, value)

### Food & Beverage
- **Primary**: Red/Orange (appetite, energy, warmth)
- **Secondary**: Yellow (happiness, optimism)
- **Accent**: Green (fresh, natural)

### Fashion & Luxury
- **Primary**: Black/Dark navy (sophistication, elegance)
- **Secondary**: Gold/Silver (premium, value)
- **Accent**: White/Cream (purity, simplicity)

### Education
- **Primary**: Blue (knowledge, trust)
- **Secondary**: Green (growth, learning)
- **Accent**: Orange (enthusiasm, creativity)

### Travel & Hospitality
- **Primary**: Teal/Turquoise (escape, relaxation)
- **Secondary**: Coral/Sunset orange (adventure, warmth)
- **Accent**: Sand/Beige (comfort, nature)

## Color Naming Conventions

Use semantic names, not descriptive:
- ✅ primary, secondary, accent, neutral, light, dark
- ❌ blue, dark-blue, light-blue, red, green

## Semantic Color Mapping

### Light Theme
```css
:root {
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-primary-light: #DBEAFE;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  --color-neutral: #6B7280;
  --color-light: #F9FAFB;
  --color-dark: #111827;
  
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-muted: #9CA3AF;
  --text-inverse: #FFFFFF;
  
  --bg-primary: #FFFFFF;
  --bg-secondary: #F3F4F6;
  --bg-tertiary: #E5E7EB;
  --border-color: #D1D5DB;
}
```

### Dark Theme
```css
.dark {
  --color-primary: #60A5FA;
  --color-primary-hover: #93C5FD;
  --color-primary-light: #1E3A8A;
  --color-secondary: #34D399;
  --color-accent: #FBBF24;
  --color-neutral: #9CA3AF;
  --color-light: #F9FAFB;
  --color-dark: #0A0A0A;
  
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --text-muted: #9CA3AF;
  --text-inverse: #111827;
  
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --bg-tertiary: #374151;
  --border-color: #374151;
}
```

## Usage Guidelines

### Primary Color
- Main brand identity
- Primary buttons
- Key interactive elements
- Logo/icon

### Secondary Color
- Supporting actions
- Secondary buttons
- Illustrations
- Subtle accents

### Accent Color
- Call-to-action buttons (sparingly)
- Notifications/badges
- Highlight important info
- Hover states

### Neutral
- Body text
- Borders
- Disabled states
- Secondary information

### Light/Dark
- Backgrounds
- Card surfaces
- Input backgrounds
- Dividers

## Anti-Patterns to Avoid

1. **Pure black (#000) for text** - Use --color-dark or --text-primary
2. **Pure white (#FFF) for backgrounds** - Use --color-light or --bg-primary
3. **Too many colors** - Max 6 semantic colors + neutrals
4. **Insufficient contrast** - Always test with tools
5. **Color-only information** - Always pair with icons/text
6. **Vibrating colors** - Avoid saturated complementary pairs at same lightness