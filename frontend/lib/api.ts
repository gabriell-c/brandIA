/**
 * API Client - Backend communication
 */

const API_BASE = '/api/v1';

export interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  project_id: number;
  business_name: string | null;
  segment: string | null;
  tone_of_voice: string | null;
  palette: Record<string, string> | null;
  typography: Record<string, string> | null;
  logo_svg: string | null;
  created_at: string;
}

export interface AIConfig {
  provider: string;
  base_url: string;
  api_key: string;
  model: string;
}

export interface BrandGenerateRequest {
  project_id: number;
  business_name: string;
  segment?: string;
  tone_of_voice?: string;
}

export interface BrandGenerateResponse {
  brand_name: string;
  tagline: string | null;
  palette: Record<string, string>;
  typography: Record<string, string>;
  explanation: string;
}

export interface AIConfigResponse {
  provider: string;
  base_url: string;
  model: string;
  configured: boolean;
}

/**
 * Projects API
 */
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function createProject(name: string): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export async function getProject(id: number): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
}

export async function updateProject(id: number, name: string): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
}

export async function deleteProject(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete project');
}

/**
 * AI Config API
 */
export async function setAIConfig(config: AIConfig): Promise<void> {
  const response = await fetch(`${API_BASE}/ai-config/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to configure AI');
}

export async function getAIConfig(): Promise<AIConfigResponse> {
  const response = await fetch(`${API_BASE}/ai-config/config`);
  if (!response.ok) throw new Error('Failed to get AI config');
  return response.json();
}

/**
 * Brand API
 */
export async function generateBrand(request: BrandGenerateRequest): Promise<BrandGenerateResponse> {
  const response = await fetch(`${API_BASE}/brand/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate brand: ${error}`);
  }
  return response.json();
}

export async function getProjectBrand(projectId: number): Promise<Brand> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/brand`);
  if (!response.ok) throw new Error('Failed to fetch brand');
  return response.json();
}