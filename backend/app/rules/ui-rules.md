# UI Rules for Design Systems

## Component Design Principles

### Consistency
- Use the same component patterns throughout the application
- Maintain consistent spacing, colors, and typography
- Follow established design tokens

### Accessibility (WCAG 2.1)
- All interactive elements must have visible focus states
- Minimum 44x44px touch targets
- Semantic HTML elements
- ARIA labels where needed
- Color is not the only indicator

### Responsiveness
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Fluid typography using clamp()
- Flexible layouts with CSS Grid/Flexbox

## Button Components

### Variants
1. **Primary** - Main actions (submit, confirm)
2. **Secondary** - Alternative actions
3. **Ghost** - Subtle actions, navigation
4. **Destructive** - Delete, remove actions

### States
- Default
- Hover
- Active/Pressed
- Focus (visible ring)
- Disabled
- Loading

### Sizing
- Small: 32px height, 0.75rem text
- Medium: 40px height, 0.875rem text
- Large: 48px height, 1rem text

## Input Components

### Structure
```
Label (required) → Input → Error/Helper text
```

### States
- Default
- Hover
- Focus (ring + border)
- Error (red border + error text)
- Disabled
- Read-only

### Validation
- Real-time validation on blur
- Submit validation
- Clear error messages
- ARIA attributes for screen readers

## Card Components

### Variants
1. **Default** - Standard content container
2. **Elevated** - Shadow for emphasis
3. **Outlined** - Border for separation
4. **Interactive** - Hover effects for clickable cards

### Structure
- Header (optional): Title + Action
- Content: Main content
- Footer (optional): Actions + Meta

## Modal/Dialog Components

### Types
1. **Modal** - Blocks background, requires action
2. **Dialog** - Non-blocking, can be dismissed
3. **Drawer** - Side panel for complex forms
4. **Popover** - Small contextual overlay

### Behavior
- Focus trap when open
- ESC to close (if not destructive)
- Click overlay to close (if not critical)
- Restore focus on close
- Scroll lock on body

## Navigation Components

### Navbar
- Logo/Brand on left
- Primary navigation center/right
- User menu on far right
- Mobile: hamburger menu
- Sticky on scroll

### Breadcrumbs
- Show hierarchy
- Current page non-clickable
- Separator: /
- Max 3 levels visible

### Tabs
- Keyboard navigable (arrow keys)
- ARIA attributes
- Content panels
- Lazy loading option

## Form Components

### Layout
- Single column on mobile
- Two columns on desktop (max)
- Related fields grouped
- Consistent label alignment

### Field Types
- Text/Email/Password/Number
- Select/Dropdown
- Checkbox/Radio group
- Toggle/Switch
- Date picker
- File upload

### Validation Patterns
- Required: Immediate on blur
- Format: On blur + submit
- Async: Debounced (300ms)
- Cross-field: On submit

## Feedback Components

### Toast/Notification
- Types: Success, Error, Warning, Info
- Auto-dismiss (5s default)
- Action button (optional)
- Stack multiple

### Progress Indicators
- Linear progress bar
- Circular spinner
- Skeleton loaders
- Step indicator

### Empty States
- Illustration + Message + Action
- Context-aware
- Helpful next steps

## Layout Components

### Container
- Max-width: 1280px
- Padding: 1rem mobile, 2rem desktop
- Centered

### Grid
- 12-column system
- Gap: 1rem (16px)
- Responsive columns

### Stack/Spacing
- Space-y: vertical spacing
- Space-x: horizontal spacing
- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

## Animation & Transitions

### Timing
- Fast: 150ms (micro-interactions)
- Normal: 250ms (standard transitions)
- Slow: 350ms (modals, drawers)

### Easing
- ease-out: Entering elements
- ease-in: Exiting elements
- ease-in-out: Continuous

### Reduced Motion
- Respect `prefers-reduced-motion`
- Disable non-essential animations
- Instant transitions for accessibility

## Color Usage in UI

### Semantic Colors
- Primary actions: --color-primary
- Destructive: --color-error (red)
- Success: --color-success (green)
- Warning: --color-warning (amber)
- Info: --color-info (blue)
- Neutral: --color-neutral (gray)

### State Colors
- Focus ring: --color-primary with opacity
- Error border: --color-error
- Success border: --color-success
- Warning border: --color-warning

### Background Hierarchy
- Primary: --bg-primary (main content)
- Secondary: --bg-secondary (cards, panels)
- Tertiary: --bg-tertiary (subtle separation)

## Typography in UI

### Headings
- H1: Page title only (once per page)
- H2: Section headers
- H3: Subsection headers
- H4-H6: Card titles, minor sections

### Body Text
- Large: Lead paragraphs, intro text
- Base: Standard body text
- Small: Captions, metadata, helper text

### Code
- Inline: --font-mono, --text-sm
- Block: --font-mono, --text-sm, padding

## Icon Usage

### Sizing
- XS: 12px (inline with xs text)
- SM: 16px (inline with sm/base text)
- MD: 20px (inline with lg text)
- LG: 24px (standalone, buttons)
- XL: 32px (feature illustrations)

### Guidelines
- Always pair with text (except icon buttons)
- Use consistent icon set
- SVG preferred for scaling
- Meaningful alt text

## Loading States

### Skeleton
- Match final content structure
- Subtle animation (pulse/shimmer)
- Same spacing as loaded content

### Spinner
- Centered in container
- Appropriate size for context
- Accessible label

### Progressive Disclosure
- Show critical content first
- Load secondary async
- Maintain layout stability

## Error Handling UI

### Form Errors
- Inline below field
- Icon + message
- Link to field on submit error
- Clear recovery steps

### Page Errors
- 404: Friendly illustration + search
- 500: Apology + retry + contact
- Offline: Clear indicator + cache notice

### Network Errors
- Toast notification
- Retry button
- Offline queue indicator

## Dark Mode

### Principles
- Not just color inversion
- Maintain hierarchy
- Preserve brand colors
- Test all components

### Implementation
- CSS custom properties
- Class-based (.dark on html)
- System preference detection
- Manual toggle persistence

## Performance UI

### Image Optimization
- WebP/AVIF with fallbacks
- Responsive images (srcset)
- Lazy loading
- Blur placeholders

### Font Loading
- Preload critical fonts
- font-display: swap
- Subset fonts
- Variable fonts

### Code Splitting
- Route-level chunks
- Component lazy loading
- Dynamic imports

## Internationalization

### Text Direction
- LTR default
- RTL support for Arabic/Hebrew
- Logical properties (margin-inline)

### Date/Number Format
- Locale-aware formatting
- ICU message format
- Timezone handling

### Translation
- Key-based system
- Context for translators
- Pluralization rules
- Gender handling