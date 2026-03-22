const API_BASE = 'http://localhost:8000'

export interface QuizChoice {
  id: string
  text: string
}

export interface QuizQuestion {
  id: number
  question: string
  choices: QuizChoice[]
  correctAnswer: string
}

export interface QuizResponse {
  questions: QuizQuestion[]
}

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

export async function generateQuiz(spaceSlug: string, topicSlug: string): Promise<QuizResponse> {
  return fetchApi<QuizResponse>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/quiz`, {
    method: 'POST',
  })
}

export async function getQuiz(spaceSlug: string, topicSlug: string): Promise<QuizResponse> {
  return fetchApi<QuizResponse>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/quiz`)
}

export async function deleteQuiz(spaceSlug: string, topicSlug: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/quiz`, {
    method: 'DELETE',
  })
}
