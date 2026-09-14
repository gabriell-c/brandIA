/**
 * API Client with retry and error handling
 */

const API_BASE = 'http://localhost:5001/api/v1';
const TIMEOUT = 30000;
const MAX_RETRIES = 3;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  retries?: number;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      retries = MAX_RETRIES
    } = options;

    const url = `${API_BASE}${endpoint}`;
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT),
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new ApiError(error.detail || 'Request failed', response.status);
      }

      return await response.json();
    } catch (error) {
      if (retries > 0 && this.isRetryable(error)) {
        await this.delay(1000 * (MAX_RETRIES - retries + 1));
        return this.request<T>(endpoint, { ...options, retries: retries - 1 });
      }
      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    return error instanceof ApiError && (error.status === 429 || error.status === 500 || error.status === 503);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Projects
  getProjects = (skip = 0, limit = 100) => 
    this.request<any[]>(`/projects/?skip=${skip}&limit=${limit}`);

  createProject = (data: { name: string; description?: string; business_name?: string; business_segment?: string }) =>
    this.request<any>('/projects/', { method: 'POST', body: data });

  getProject = (id: number) =>
    this.request<any>(`/projects/${id}`);

  updateProject = (id: number, data: any) =>
    this.request<any>(`/projects/${id}`, { method: 'PUT', body: data });

  deleteProject = (id: number) =>
    this.request<any>(`/projects/${id}`, { method: 'DELETE' });

  // Brand
  getBrands = (projectId?: number) => 
    this.request<any[]>('/brand/?' + (projectId ? `project_id=${projectId}` : ''));

  createBrand = (data: any) =>
    this.request<any>('/brand/', { method: 'POST', body: data });

  getBrand = (id: number) =>
    this.request<any>(`/brand/${id}`);

  updateBrand = (id: number, data: any) =>
    this.request<any>(`/brand/${id}`, { method: 'PUT', body: data });

  deleteBrand = (id: number) =>
    this.request<any>(`/brand/${id}`, { method: 'DELETE' });

  // AI Config
  getAIConfig = () =>
    this.request<any>('/ai-config/config');

  setAIConfig = (data: any) =>
    this.request<any>('/ai-config/config', { method: 'POST', body: data });

  deleteAIConfig = () =>
    this.request<any>('/ai-config/config', { method: 'DELETE' });

  // Branding Generation
  generateBranding = (data: {
    project_id: number;
    business_name: string;
    segment?: string;
    tone_of_voice?: string;
  }) =>
    this.request<any>('/ai-config/brand/generate', { method: 'POST', body: data });

  validatePalette = (palette: Record<string, string>) =>
    this.request<any>('/ai-config/brand/validate', { method: 'POST', body: { palette } });
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = new ApiClient();
export { ApiError };