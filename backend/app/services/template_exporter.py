"""
Template export service - Complete token export for templates
"""
import logging
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)


class TemplateExporter:
    """Service for exporting template tokens in various formats."""
    
    def __init__(self):
        self.formats = ['json', 'css', 'tailwind', 'styledictionary']
    
    def export(
        self,
        template: Dict[str, Any],
        format: str = 'json'
    ) -> Dict[str, Any]:
        """Export template in specified format."""
        exporters = {
            'json': self._export_json,
            'css': self._export_css,
            'tailwind': self._export_tailwind,
            'styledictionary': self._export_style_dictionary
        }
        
        exporter = exporters.get(format, exporters['json'])
        return exporter(template)
    
    def _export_json(self, template: Dict[str, Any]) -> Dict[str, Any]:
        """Export as JSON."""
        return {
            "name": template["name"],
            "segment": template["segment"],
            "version": "1.0.0",
            "palette": template["palette"],
            "typography": {
                "heading": template["typography"]["heading"],
                "body": template["typography"]["body"],
                "mono": template["typography"]["mono"]
            },
            "exported_at": datetime.utcnow().isoformat()
        }
    
    def _export_css(self, template: Dict[str, Any]) -> str:
        """Export as CSS variables."""
        palette = template["palette"]
        typography = template["typography"]
        
        css = f"""/* {template['name']} - Design Tokens */
:root {{
  /* Colors */
  --color-primary: {palette.get('primary', '#3B82F6')};
  --color-secondary: {palette.get('secondary', '#10B981')};
  --color-accent: {palette.get('accent', '#8B5CF6')};
  --color-neutral: {palette.get('neutral', '#6B7280')};
  --color-light: {palette.get('light', '#F3F4F6')};
  --color-dark: {palette.get('dark', '#111827')};

  /* Typography */
  --font-heading: '{typography.get('heading', 'Inter')}', sans-serif;
  --font-body: '{typography.get('body', 'Inter')}', sans-serif;
  --font-mono: '{typography.get('mono', 'JetBrains Mono')}', monospace;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}}
"""
        return css
    
    def _export_tailwind(self, template: Dict[str, Any]) -> str:
        """Export as Tailwind config."""
        palette = template["palette"]
        typography = template["typography"]
        
        config = f"""// tailwind.config.js
module.exports = {{
  theme: {{
    extend: {{
      colors: {{
        primary: '{palette.get('primary', '#3B82F6')}',
        secondary: '{palette.get('secondary', '#10B981')}',
        accent: '{palette.get('accent', '#8B5CF6')}',
        neutral: '{palette.get('neutral', '#6B7280')}',
        light: '{palette.get('light', '#F3F4F6')}',
        dark: '{palette.get('dark', '#111827')}',
      }},
      fontFamily: {{
        heading: ['{typography.get('heading', 'Inter')}', 'sans-serif'],
        body: ['{typography.get('body', 'Inter')}', 'sans-serif'],
        mono: ['{typography.get('mono', 'JetBrains Mono')}', 'monospace'],
      }},
      spacing: {{
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      }},
    }},
  }},
}}
"""
        return config
    
    def _export_style_dictionary(self, template: Dict[str, Any]) -> str:
        """Export as Style Dictionary format."""
        palette = template["palette"]
        typography = template["typography"]
        
        sd = f"""// design-tokens.json
{{
  "version": 2,
  "name": "{template['name']}",
  "platform": {{
    "outputFileDirectory": "./dist/{template['segment'].lower().replace(' ', '-')}"
  }},
  "tokens": {{
    "color": {{
      "primary": {{ "value": "{palette.get('primary', '#3B82F6')}" }},
      "secondary": {{ "value": "{palette.get('secondary', '#10B981')}" }},
      "accent": {{ "value": "{palette.get('accent', '#8B5CF6')}" }},
      "neutral": {{ "value": "{palette.get('neutral', '#6B7280')}" }},
      "light": {{ "value": "{palette.get('light', '#F3F4F6')}" }},
      "dark": {{ "value": "{palette.get('dark', '#111827')}" }}
    }},
    "font": {{
      "heading": {{ "value": "{typography.get('heading', 'Inter')}" }},
      "body": {{ "value": "{typography.get('body', 'Inter')}" }},
      "mono": {{ "value": "{typography.get('mono', 'JetBrains Mono')}" }}
    }}
  }}
}}
"""
        return sd
    
    def export_all_formats(self, template: Dict[str, Any]) -> Dict[str, str]:
        """Export template in all supported formats."""
        return {
            format: self.export(template, format)
            for format in self.formats
        }


# Singleton instance
_exporter = None

def get_template_exporter() -> TemplateExporter:
    """Get or create template exporter instance."""
    global _exporter
    if _exporter is None:
        _exporter = TemplateExporter()
    return _exporter