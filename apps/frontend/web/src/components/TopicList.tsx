import { useState } from 'react'
import type { Topic } from '@/types/space'

const API_BASE = 'http://localhost:8000'

interface TopicListProps {
  topics: Topic[]
  spaceSlug: string
  onSelectTopic: (topic: Topic) => void
  onSelectArticle: (topic: Topic) => void
  onSelectSlide: (topic: Topic) => void
  onSelectFlashcard: (topic: Topic) => void
  onSelectQuiz: (topic: Topic) => void
  onRefreshSpace?: () => void
}

export function TopicList({ topics, spaceSlug, onSelectTopic: _onSelectTopic, onSelectArticle, onSelectSlide, onSelectFlashcard, onSelectQuiz, onRefreshSpace }: TopicListProps) {
  const [autoGenerating, setAutoGenerating] = useState<string | null>(null)

  const autoGenerateContent = async (topic: Topic): Promise<void> => {
    const contentType = topic.contentType || 'article'
    
    setAutoGenerating(topic.id)
    
    try {
      let response: Response | null = null
      
      if (contentType === 'article') {
        response = await fetch(`${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/article`, { method: 'POST' })
        if (response.ok) {
          await onRefreshSpace?.()
          onSelectArticle(topic)
        }
      } else if (contentType === 'slide') {
        response = await fetch(`${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/slide`, { method: 'POST' })
        if (response.ok) {
          await onRefreshSpace?.()
          onSelectSlide(topic)
        }
      } else if (contentType === 'flashcard') {
        response = await fetch(`${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/flashcards`, { method: 'POST' })
        if (response.ok) {
          await onRefreshSpace?.()
          onSelectFlashcard(topic)
        }
      } else if (contentType === 'quiz') {
        response = await fetch(`${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/quiz`, { method: 'POST' })
        if (response.ok) {
          await onRefreshSpace?.()
          onSelectQuiz(topic)
        }
      }
    } catch (err) {
      console.error(`Failed to generate ${contentType}:`, err)
    } finally {
      setAutoGenerating(null)
    }
  }

  const handleTopicClick = async (topic: Topic) => {
    const contentType = topic.contentType || 'article'
    
    console.log('handleTopicClick:', topic.title, 'contentType:', contentType)
    
    // Always try to fetch content first
    try {
      let endpoint = ''
      if (contentType === 'article') endpoint = `${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/article`
      else if (contentType === 'slide') endpoint = `${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/slide`
      else if (contentType === 'flashcard') endpoint = `${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/flashcards`
      else if (contentType === 'quiz') endpoint = `${API_BASE}/api/spaces/${spaceSlug}/topics/${encodeURIComponent(topic.slug)}/quiz`
      
      console.log('Fetching:', endpoint)
      const response = await fetch(endpoint)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        
        // Check if content exists based on response format
        let hasContent = false
        if (contentType === 'article' || contentType === 'slide') {
          hasContent = !!(data.content && data.content.trim())
        } else if (contentType === 'flashcard') {
          hasContent = !!(data.flashcards && data.flashcards.length > 0)
        } else if (contentType === 'quiz') {
          hasContent = !!(data.questions && data.questions.length > 0)
        }
        
        console.log('hasContent:', hasContent)
        
        if (hasContent) {
          if (contentType === 'article') onSelectArticle(topic)
          else if (contentType === 'slide') onSelectSlide(topic)
          else if (contentType === 'flashcard') onSelectFlashcard(topic)
          else if (contentType === 'quiz') onSelectQuiz(topic)
          return
        }
      }
    } catch (err) {
      console.error('Error checking content:', err)
    }
    
    console.log('Calling autoGenerateContent')
    // Content doesn't exist, generate it
    await autoGenerateContent(topic)
  }

  return (
    <div className="p-3">
      {topics.map((topic) => (
        <div key={topic.id} className="mb-1">
          <div 
            className="topic-header relative flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
            onClick={() => handleTopicClick(topic)}
          >
            <span className="font-medium text-sm flex-1 text-gray-700">{topic.title}</span>
            <div className="relative flex items-center gap-1">
              {autoGenerating === topic.id ? (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-sm animate-spin text-primary">sync</span>
                </div>
              ) : (
                <div className="relative flex items-center gap-1" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
