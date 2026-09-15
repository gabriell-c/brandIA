// Figma Plugin - Import/Export Design Tokens
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

interface DesignTokens {
  palette: Record<string, string>;
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

interface FigmaStyles {
  paintStyles: PaintStyle[];
  textStyles: TextStyle[];
  effectStyles: EffectStyle[];
}

async function getAllStyles(): Promise<FigmaStyles> {
  const paintStyles = await figma.getLocalPaintStylesAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  
  return { paintStyles, textStyles, effectStyles };
}

function extractTokensFromStyles(styles: FigmaStyles): DesignTokens {
  const tokens: DesignTokens = {
    palette: {},
    typography: { heading: '', body: '', mono: '' },
    spacing: {},
    borderRadius: {},
    shadows: {}
  };

  // Extract colors
  for (const style of styles.paintStyles) {
    if (style.paints.length > 0 && style.paints[0].type === 'SOLID') {
      const paint = style.paints[0] as SolidPaint;
      const hex = rgbToHex(paint.color);
      tokens.palette[style.name] = hex;
    }
  }

  // Extract typography
  for (const style of styles.textStyles) {
    if (style.name.toLowerCase().includes('heading') || style.name.toLowerCase().includes('title')) {
      tokens.typography.heading = style.fontName.family;
    } else if (style.name.toLowerCase().includes('body') || style.name.toLowerCase().includes('text')) {
      tokens.typography.body = style.fontName.family;
    } else if (style.name.toLowerCase().includes('mono') || style.name.toLowerCase().includes('code')) {
      tokens.typography.mono = style.fontName.family;
    }
  }

  return tokens;
}

function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

async function importTokens(tokens: DesignTokens): Promise<void> {
  // Create paint styles
  for (const [name, hex] of Object.entries(tokens.palette)) {
    const paintStyle = figma.createPaintStyle();
    paintStyle.name = name;
    paintStyle.paints = [{ type: 'SOLID', color: hexToRgb(hex) }];
  }

  // Create text styles
  if (tokens.typography.heading) {
    const headingStyle = figma.createTextStyle();
    headingStyle.name = 'Heading';
    headingStyle.fontName = { family: tokens.typography.heading, style: 'Bold' };
    headingStyle.fontSize = 32;
  }

  if (tokens.typography.body) {
    const bodyStyle = figma.createTextStyle();
    bodyStyle.name = 'Body';
    bodyStyle.fontName = { family: tokens.typography.body, style: 'Regular' };
    bodyStyle.fontSize = 16;
  }

  if (tokens.typography.mono) {
    const monoStyle = figma.createTextStyle();
    monoStyle.name = 'Mono';
    monoStyle.fontName = { family: tokens.typography.mono, style: 'Regular' };
    monoStyle.fontSize = 14;
  }
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

// Message handlers
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    try {
      const styles = await getAllStyles();
      const tokens = extractTokensFromStyles(styles);
      figma.ui.postMessage({ type: 'tokens-extracted', tokens });
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: error.message });
    }
  } else if (msg.type === 'export-tokens') {
    try {
      await importTokens(msg.tokens);
      figma.ui.postMessage({ type: 'tokens-imported', success: true });
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: error.message });
    }
  } else if (msg.type === 'sync-tokens') {
    try {
      const styles = await getAllStyles();
      const tokens = extractTokensFromStyles(styles);
      // Push to remote API
      const response = await fetch('https://api.omnidesign.com/api/v1/integrations/figma/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens })
      });
      if (response.ok) {
        figma.ui.postMessage({ type: 'sync-complete', success: true });
      }
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: error.message });
    }
  }
};