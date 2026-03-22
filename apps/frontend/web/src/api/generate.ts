export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface GenerateTopicsRequest {
  topic: string
  goal: string
  messages?: Message[]
}

export interface ContentOverview {
  learningObjectives: string[]
  keyConcepts: string[]
}

export type ContentType = 'article' | 'slide' | 'quiz' | 'flashcard'

export interface TopicInput {
  title: string
  contentOverview?: ContentOverview
  contentType?: ContentType
}

export interface GenerateTopicsResponse {
  title: string
  topics: TopicInput[]
}

export interface ChatMessageRequest {
  message: string
  phase: string
  topic?: string
  goal?: string
  topics?: TopicInput[]
  messages?: Message[]
}

export interface ChatMessageResponse {
  intent: string
  response: string
  data?: {
    title?: string
    topics?: TopicInput[]
  }
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

export const generateApi = {
  generateTopics: (topic: string, goal: string, messages?: Message[]) =>
    fetchApi<GenerateTopicsResponse>('/api/generate-topics', {
      method: 'POST',
      body: JSON.stringify({ topic, goal, messages }),
    }),

  chatMessage: (request: ChatMessageRequest) =>
    fetchApi<ChatMessageResponse>('/api/chat-message', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  generateTopicsFromChat: (messages: Message[], contentType: ContentType) =>
    fetchApi<GenerateTopicsResponse>('/api/generate-topics-from-chat', {
      method: 'POST',
      body: JSON.stringify({ messages, content_type: contentType }),
    }),
}
