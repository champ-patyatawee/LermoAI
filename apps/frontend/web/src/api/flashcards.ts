const API_BASE = 'http://localhost:8000'

export interface FlashcardContent {
  html: string
}

export interface Flashcard {
  id: number
  front: FlashcardContent
  back: FlashcardContent
}

export interface FlashcardsResponse {
  flashcards: Flashcard[]
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

export async function generateFlashcards(spaceSlug: string, topicSlug: string): Promise<FlashcardsResponse> {
  return fetchApi<FlashcardsResponse>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/flashcards`, {
    method: 'POST',
  })
}

export async function getFlashcards(spaceSlug: string, topicSlug: string): Promise<FlashcardsResponse> {
  return fetchApi<FlashcardsResponse>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/flashcards`)
}

export async function deleteFlashcards(spaceSlug: string, topicSlug: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/api/spaces/${spaceSlug}/topics/${topicSlug}/flashcards`, {
    method: 'DELETE',
  })
}
