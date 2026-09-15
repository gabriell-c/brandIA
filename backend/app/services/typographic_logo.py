"""
Typographic logo service - Generate text-based logos
"""
import logging

logger = logging.getLogger(__name__)


class TypographicLogoService:
    """Service for generating typographic logos."""

    def __init__(self):
        self.fonts = {
            'serif': ['Georgia', 'Times New Roman', 'Merriweather', 'Playfair Display'],
            'sans-serif': ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins'],
            'monospace': ['JetBrains Mono', 'Fira Code', 'Source Code Pro'],
            'display': ['Clarendon', 'Bebas Neue', 'Oswald', 'Anton']
        }

    def generate_svg(
        self,
        text: str,
        font_family: str = 'Inter',
        font_weight: int = 700,
        font_size: int = 48,
        color: str = '#111827',
        background: str = 'transparent',
        letter_spacing: float = 0,
        word_spacing: float = 0,
        width: int = 400,
        height: int = 150
    ) -> str:
        """Generate SVG for typographic logo."""

        # Calculate text dimensions roughly
        char_width = font_size * 0.6
        text_width = len(text) * char_width

        # Center the text
        x = (width - text_width) / 2
        y = height / 2 + font_size / 3

        # Generate SVG
        background_rect = ''
        if background != 'transparent':
            background_rect = f'<rect width="{width}" height="{height}" fill="{background}"/>'

        svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  {background_rect}
  <text 
    x="{width/2}" 
    y="{y}" 
    text-anchor="middle"
    font-family="{font_family}, sans-serif"
    font-weight="{font_weight}"
    font-size="{font_size}"
    fill="{color}"
    letter-spacing="{letter_spacing}px"
    word-spacing="{word_spacing}px"
    dominant-baseline="middle"
  >
    {self._escape_xml(text)}
  </text>
</svg>'''

        return svg

    def generate_variations(
        self,
        text: str,
        font_family: str = 'Inter',
        color: str = '#111827'
    ) -> dict[str, str]:
        """Generate multiple variations of a typographic logo."""

        variations = {}

        # Standard
        variations['standard'] = self.generate_svg(
            text, font_family, color=color
        )

        # Bold
        variations['bold'] = self.generate_svg(
            text, font_family, font_weight=800, color=color
        )

        # Light
        variations['light'] = self.generate_svg(
            text, font_family, font_weight=300, color=color
        )

        # Inverted (for dark backgrounds)
        variations['inverted'] = self.generate_svg(
            text, font_family, font_weight=700, color='#FFFFFF',
            background='#111827'
        )

        # Accent color version
        accent_color = self._generate_accent_color(color)
        variations['accent'] = self.generate_svg(
            text, font_family, font_weight=700, color=accent_color
        )

        # Wide tracking
        variations['wide'] = self.generate_svg(
            text, font_family, font_weight=700, color=color,
            letter_spacing=4
        )

        return variations

    def _generate_accent_color(self, base_color: str) -> str:
        """Generate an accent color from base color."""
        # Simple complement - shift hue by 180 degrees
        # This is a simplified version
        if base_color.startswith('#'):
            hex_color = base_color[1:]
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)

            # Simple complement
            r2 = 255 - r
            g2 = 255 - g
            b2 = 255 - b

            return f'#{r2:02X}{g2:02X}{b2:02X}'

        return '#F59E0B'  # Default accent

    def _escape_xml(self, text: str) -> str:
        """Escape XML special characters."""
        return (text
            .replace('&', '&')
            .replace('<', '<')
            .replace('>', '>')
            .replace('"', '"')
            .replace("'", '&apos;'))

    def get_font_suggestions(self, style: str = 'modern') -> list[str]:
        """Get font suggestions based on style."""
        style_fonts = {
            'modern': ['Inter', 'Roboto', 'Montserrat', 'Poppins'],
            'classic': ['Georgia', 'Merriweather', 'Playfair Display'],
            'minimal': ['Open Sans', 'Source Sans Pro', 'Lato'],
            'tech': ['JetBrains Mono', 'Fira Code', 'Space Mono'],
            'creative': ['Montserrat', 'Poppins', 'Nunito']
        }
        return style_fonts.get(style, style_fonts['modern'])


# Singleton instance
_typographic_service = None

def get_typographic_service() -> TypographicLogoService:
    """Get or create typographic logo service instance."""
    global _typographic_service
    if _typographic_service is None:
        _typographic_service = TypographicLogoService()
    return _typographic_service
