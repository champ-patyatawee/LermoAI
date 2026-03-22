import type { Space, SpaceData, Topic, ContentOverview, ContentType } from '@/types/space'

const API_BASE = 'http://localhost:8000'

async function fetchApi<T>(url: string, options?: RequestInit & { params?: Record<string, string | number> }): Promise<T> {
  let fullUrl = url
  
  if (options?.params) {
    const searchParams = new URLSearchParams()
    Object.entries(options.params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    fullUrl = `${url}?${searchParams.toString()}`
  }
  
  const response = await fetch(`${API_BASE}${fullUrl}`, {
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
  
  if (response.status === 204) {
    return undefined as T
  }
  
  return response.json()
}

export interface TopicInput {
  title: string
  contentOverview?: ContentOverview
  contentType?: ContentType
}

export interface PaginatedSpaces {
  spaces: Space[]
  total: number
  limit: number
  offset: number
}

export const api = {
  // Spaces
  listSpaces: (limit = 12, offset = 0) => fetchApi<PaginatedSpaces>('/api/spaces', { params: { limit, offset } }),
  
  getSpace: (slug: string) => fetchApi<SpaceData>(`/api/spaces/${slug}`),
  
  createSpace: (title: string, description: string = '') => 
    fetchApi<Space>('/api/spaces', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    }),
  
  createSpaceWithTopics: (title: string, topics: TopicInput[]) =>
    fetchApi<SpaceData>('/api/spaces/with-topics', {
      method: 'POST',
      body: JSON.stringify({ title, topics }),
    }),
  
  updateSpace: (slug: string, data: { title?: string; description?: string }) =>
    fetchApi<SpaceData>(`/api/spaces/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteSpace: (slug: string) => 
    fetchApi<void>(`/api/spaces/${slug}`, { method: 'DELETE' }),
  
  // Topics
  createTopic: (slug: string, title: string, contentType?: ContentType) =>
    fetchApi<Topic>(`/api/spaces/${slug}/topics`, {
      method: 'POST',
      body: JSON.stringify({ title, content_type: contentType }),
    }),
}
