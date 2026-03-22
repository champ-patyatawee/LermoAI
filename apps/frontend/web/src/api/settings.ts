export interface ProviderSettings {
  enabled: boolean
  apiKey: string
  model: string
}

export interface CustomProviderSettings {
  enabled: boolean
  url: string
  apiKey: string
  model: string
}

export interface Settings {
  openrouter?: ProviderSettings
  custom?: CustomProviderSettings
}

const API_BASE = 'http://localhost:8000'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || 'API error')
  }
  
  return response.json()
}

export const settingsApi = {
  getSettings: () => fetchApi<Settings>('/api/settings'),
  
  updateProvider: (provider: 'openrouter' | 'custom', data: ProviderSettings | CustomProviderSettings) =>
    fetchApi<Settings>(`/api/settings/providers/${provider}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}
