import { useState, useEffect, useCallback } from 'react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { Space, Topic } from '@/types/space'

const API_BASE = 'http://localhost:8000'

interface TopicArticleProps {
  space: Space
  topic: Topic
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

export function TopicArticle({ space, topic }: TopicArticleProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadArticle = useCallback(async () => {
    setContent('')
    setLoading(true)
    setError('')
    try {
      const result = await fetchApi<{ content: string }>(`/api/spaces/${space.slug}/topics/${topic.slug}/article`)
      if (result.content) {
        setContent(result.content)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load article'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [space.slug, topic.slug])

  useEffect(() => {
    loadArticle()
  }, [loadArticle])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2 text-gray-500">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <span className="material-icons text-4xl">error_outline</span>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <span className="material-icons text-4xl">article</span>
          <p className="mt-2">No article found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <MarkdownRenderer content={content} size="lg" />
      </div>
    </div>
  )
}
