import { useState, useEffect, useRef } from 'react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { Space, Topic } from '@/types/space'

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

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface TopicChatProps {
  space: Space
  topic: Topic | null
  contentType: 'article' | 'slide' | 'flashcard' | 'quiz' | null
}

export function TopicChat({ space, topic, contentType }: TopicChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const prevTopicSlugRef = useRef<string>('')

  useEffect(() => {
    if (!topic) {
      setMessages([])
      return
    }

    if (prevTopicSlugRef.current !== topic.slug) {
      prevTopicSlugRef.current = topic.slug
      loadChat()
    }
  }, [space.slug, topic?.slug])

  const loadChat = async () => {
    if (!topic) return
    try {
      const chat = await fetchApi<{ messages: Message[] }>(`/api/spaces/${space.slug}/topics/${topic.slug}/chat`)
      if (chat.messages) {
        setMessages(chat.messages)
      }
    } catch (err) {
      console.error('Failed to load chat:', err)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !topic) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await fetchApi<{ message: Message }>(`/api/spaces/${space.slug}/topics/${topic.slug}/chat/message`, {
        method: 'POST',
        body: JSON.stringify({ 
          message: input.trim(), 
          history,
          content_type: contentType,
        }),
      })

      const updatedMessages = [...newMessages, response.message]
      setMessages(updatedMessages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getWelcomeMessage = () => {
    if (!topic) {
      return "Select a topic from the left sidebar to start learning. I'm here to help you understand the content!"
    }
    if (contentType === 'article') {
      return `I'm your Q&A assistant for this article about **${topic.title}**. Ask me anything about the content!`
    }
    if (contentType === 'slide') {
      return `I'm your Q&A assistant for this presentation about **${topic.title}**. Ask me anything about the slides!`
    }
    if (contentType === 'flashcard') {
      return `I'm your Q&A assistant for these flashcards about **${topic.title}**. Ask me anything to test your understanding!`
    }
    if (contentType === 'quiz') {
      return `I'm your Q&A assistant for this quiz about **${topic.title}**. Ask me questions about the quiz topics!`
    }
    return `I'm here to help you learn about **${topic.title}**. Select a content type (Article, Slide, Flashcard, or Quiz) to start Q&A!`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="material-icons text-primary">smart_toy</span>
          Chat Helper
        </h3>
        {contentType && (
          <p className="text-xs text-gray-500 mt-1">
            Viewing: {contentType}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-icons text-primary text-sm">smart_toy</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <p className="whitespace-pre-wrap">
                {getWelcomeMessage()}
              </p>
            </div>
          </div>
        )}
        
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-icons text-primary text-sm">smart_toy</span>
              </div>
            )}
            <div className={`max-w-[80%] max-h-[60vh] overflow-y-auto rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-white border border-gray-200'
            }`}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <MarkdownRenderer content={msg.content} size="md" />
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <span className="material-icons text-gray-600 text-sm">person</span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-icons text-primary text-sm">smart_toy</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <span className="material-icons animate-spin text-gray-400">sync</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={topic ? "Ask a question about the content..." : "Select a topic first"}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            rows={2}
            disabled={loading || !topic}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || !topic}
            className="absolute right-2 bottom-2 p-2 bg-transparent text-[var(--color-primary)] rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
