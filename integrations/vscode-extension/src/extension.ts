import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Design tokens stored in workspace
let workspaceTokens: Record<string, any> = {};

export function activate(context: vscode.ExtensionContext) {
  const importTokens = vscode.commands.registerCommand('omniDesignTokens.importTokens', async () => {
    const response = await vscode.window.showInputBox({
      prompt: 'Enter API URL (e.g., https://api.omnidesign.com)',
      placeHolder: 'https://api.omnidesign.com'
    });
    
    if (!response) return;
    
    try {
      const res = await fetch(`${response}/api/v1/brand/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: 'Workspace',
          industry: 'general'
        })
      });
      
      const data = await res.json();
      workspaceTokens = data.data;
      
      vscode.window.showInformationMessage(`Design tokens imported successfully`);
      vscode.commands.executeCommand('setContext', 'omniDesignTokens.loaded', true);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to import tokens: ${error}`);
    }
  });

  const exportTokens = vscode.commands.registerCommand('omniDesignTokens.exportTokens', async () => {
    if (Object.keys(workspaceTokens).length === 0) {
      vscode.window.showWarningMessage('No design tokens to export');
      return;
    }
    
    const formats = ['CSS Variables', 'SCSS', 'Tailwind Config', 'JSON'];
    const format = await vscode.window.showQuickPick(formats, { placeHolder: 'Select export format' });
    
    if (!format) return;
    
    let content = '';
    const filename = `design-tokens.${format.toLowerCase().replace(' ', '-')}`;
    
    switch (format) {
      case 'CSS Variables':
        content = generateCSSVariables(workspaceTokens);
        break;
      case 'SCSS':
        content = generateSCSS(workspaceTokens);
        break;
      case 'Tailwind Config':
        content = generateTailwind(workspaceTokens);
        break;
      case 'JSON':
        content = JSON.stringify(workspaceTokens, null, 2);
        break;
    }
    
    const uri = vscode.Uri.file(path.join(vscode.workspace.workspaceFolders?.[0]?.uri.path || '', filename));
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
    vscode.window.showInformationMessage(`Exported to ${filename}`);
  });

  const showColorPreview = vscode.commands.registerCommand('omniDesignTokens.showColorPreview', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const selection = editor.selection;
    const word = editor.document.getText(selection);
    
    if (/^#[0-9A-Fa-f]{6}$/.test(word)) {
      const color = new vscode.Color(
        hexToRed(word),
        hexToGreen(word),
        hexToBlue(word),
        1
      );
      
      await vscode.commands.executeCommand('workbench.action.colorsPicker.show', color, false);
    }
  });

  context.subscriptions.push(importTokens, exportTokens, showColorPreview);
}

function generateCSSVariables(tokens: Record<string, any>): string {
  let css = ':root {\n';
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      css += `  --color-${key}: ${value};\n`;
    }
  }
  css += '}\n';
  return css;
}

function generateSCSS(tokens: Record<string, any>): string {
  let scss = '$colors: (\n';
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      scss += `  '${key}': ${value},\n`;
    }
  }
  scss += ');\n';
  return scss;
}

function generateTailwind(tokens: Record<string, any>): string {
  let config = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n';
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      config += `        '${key}': '${value}',\n`;
    }
  }
  config += '      }\n    }\n  }\n}\n';
  return config;
}

function hexToRed(hex: string): number {
  return parseInt(hex.slice(1, 3), 16) / 255;
}

function hexToGreen(hex: string): number {
  return parseInt(hex.slice(3, 5), 16) / 255;
}

function hexToBlue(hex: string): number {
  return parseInt(hex.slice(5, 7), 16) / 255;
}

export function deactivate() {}