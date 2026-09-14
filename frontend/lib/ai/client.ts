/**
 * AI Client - OpenAI compatible API
 */

export interface AIConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface AIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  response_format?: { type: 'json_object' };
  temperature?: number;
}

export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call AI API with configurable provider
 */
export async function callAI(config: AIConfig, request: AIRequest): Promise<any> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      ...request,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const data: AIResponse = await response.json();
  const content = data.choices[0]?.message?.content || '';
  
  // Parse JSON response if needed
  try {
    return JSON.parse(content);
  } catch {
    return { text: content };
  }
}