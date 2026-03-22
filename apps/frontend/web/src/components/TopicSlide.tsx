import { useState, useEffect, useCallback } from 'react'
import type { Space, Topic } from '@/types/space'

const API_BASE = 'http://localhost:8000'

interface TopicSlideProps {
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

export function TopicSlide({ space, topic }: TopicSlideProps) {
  const [slideUrl, setSlideUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const loadSlide = useCallback(async () => {
    setSlideUrl('')
    setLoading(true)
    setError('')
    setNotFound(false)
    try {
      const result = await fetchApi<{ content: string }>(`/api/spaces/${space.slug}/topics/${topic.slug}/slide`)
      if (result.content) {
        const urlResult = await fetchApi<{ url: string }>(`/api/spaces/${space.slug}/topics/${topic.slug}/slide/url`)
        if (urlResult.url) {
          setSlideUrl(urlResult.url)
        } else {
          setNotFound(true)
        }
      } else {
        setNotFound(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load slide'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [space.slug, topic.slug])

  useEffect(() => {
    loadSlide()
  }, [loadSlide])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center text-gray-300">
          <span className="material-icons animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2">Starting slide server...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center text-red-400">
          <span className="material-icons text-4xl">error_outline</span>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (notFound || !slideUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center text-gray-400">
          <span className="material-icons text-4xl">slideshow</span>
          <p className="mt-2">No slide found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 overflow-auto">
      <div className="flex items-center justify-between px-6 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="text-sm text-gray-300 truncate">
          / {space.title} / {topic.title} / Slide
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <iframe
          src={slideUrl}
          className="w-full min-h-full border-0"
          title="Slide Presentation"
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    </div>
  )
}
