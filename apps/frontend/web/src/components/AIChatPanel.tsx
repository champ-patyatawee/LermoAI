import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { generateApi, type Message, type ContentOverview, type ContentType } from '@/api/generate'
import { settingsApi } from '@/api/settings'
import { api } from '@/api/spaces'
import { Sidebar } from '@/components/Sidebar'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { SpaceData } from '@/types/space'

interface TopicPreview {
  title: string
  description?: string
  contentOverview?: ContentOverview
  contentType?: ContentType
  editing?: boolean
}

const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  article: 'article',
  slide: 'slideshow',
  quiz: 'quiz',
  flashcard: 'style',
}

interface AIChatPanelProps {
  topic?: string
  onClose?: () => void
  onCreated?: (space: SpaceData) => void
}

function getStorageKey(topic: string): string {
  const slugified = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `create-space-chat-${slugified}`
}

function loadChatHistory(topic: string): Message[] {
  try {
    const key = getStorageKey(topic)
    const stored = localStorage.getItem(key)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((m: { role: string; content: string }): Message => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))
  } catch {
    return []
  }
}

function saveChatHistory(topic: string, messages: Message[]) {
  try {
    const key = getStorageKey(topic)
    localStorage.setItem(key, JSON.stringify(messages))
  } catch {
    // Ignore storage errors
  }
}

function clearChatHistory(topic: string) {
  try {
    const key = getStorageKey(topic)
    localStorage.removeItem(key)
  } catch {
    // Ignore storage errors
  }
}

export function AIChatPanel({ topic: propTopic }: AIChatPanelProps) {
  const params = useParams<{ topic: string }>()
  const navigate = useNavigate()
  const topic = propTopic ?? (params.topic ? decodeURIComponent(params.topic) : '')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState<TopicPreview[]>([])
  const [spaceTitle, setSpaceTitle] = useState('')
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null)
  const [editingTopicValue, setEditingTopicValue] = useState('')
  const [hasLLM, setHasLLM] = useState(true)
  const [creating, setCreating] = useState(false)
  const [waitingForContentType, setWaitingForContentType] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const init = async () => {
      await checkSettings()
      const history = loadChatHistory(topic)
      if (history.length > 0) {
        setMessages(history)
      } else {
        const topicIntro = topic ? ` I'll help you create a learning path for **${topic}**.` : ''
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm **LermoAI**, your personalized learning assistant.${topicIntro} What would you like to learn today?`
        }])
      }
    }
    init()
  }, [topic])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkSettings = async () => {
    try {
      const settings = await settingsApi.getSettings()
      const hasProvider = 
        (settings.openrouter?.enabled && settings.openrouter?.apiKey) ||
        (settings.custom?.enabled && settings.custom?.apiKey)
      
      if (!hasProvider) {
        setHasLLM(false)
        setMessages([{
          role: 'assistant',
          content: 'No LLM provider configured. Please enable OpenRouter or Custom Provider in Settings first.'
        }])
      }
    } catch {
      setHasLLM(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !hasLLM) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const userInput = input.trim().toLowerCase()
    const isCreateSpace = userInput.includes('generate topics') || userInput.includes('create topics')

    if (isCreateSpace) {
      setWaitingForContentType(true)
      setLoading(false)
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'What content type would you prefer? (article, slide, quiz, or flashcard)'
      }
      const messagesWithResponse = [...newMessages, assistantMessage]
      setMessages(messagesWithResponse)
      saveChatHistory(topic, messagesWithResponse)
      setInput('')
      inputRef.current?.focus()
      return
    }

    try {
      const response = await generateApi.chatMessage({
        message: input.trim(),
        phase: 'chat',
        topic: topic || undefined,
        goal: undefined,
        topics: topics.length > 0 ? topics.map(t => ({
          title: t.title,
          contentOverview: t.contentOverview,
          contentType: t.contentType
        })) : undefined,
        messages: newMessages
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response
      }
      const messagesWithResponse = [...newMessages, assistantMessage]
      setMessages(messagesWithResponse)
      saveChatHistory(topic, messagesWithResponse)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}. Please try again.` 
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleTopicEdit = (index: number, newTitle: string) => {
    const updated = [...topics]
    updated[index] = { 
      title: newTitle,
      contentOverview: updated[index].contentOverview,
      contentType: updated[index].contentType || 'article'
    }
    setTopics(updated)
    setEditingTopicIndex(null)
  }

  const startEditingTopic = (index: number, currentTitle: string) => {
    setEditingTopicIndex(index)
    setEditingTopicValue(currentTitle)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleTopicEdit(index, editingTopicValue)
    } else if (e.key === 'Escape') {
      setEditingTopicIndex(null)
    }
  }

  const handleTopicRemove = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index))
  }

  const handleContentTypeSelect = async (contentType: ContentType) => {
    setWaitingForContentType(false)
    setLoading(true)

    const chatMessagesBeforeCreateSpace = messages.filter(m => {
      const lowerContent = m.content.toLowerCase()
      return !lowerContent.includes('generate topics') && 
             !lowerContent.includes('create topics') &&
             !lowerContent.includes('what content type')
    })

    try {
      const result = await generateApi.generateTopicsFromChat(chatMessagesBeforeCreateSpace, contentType)
      
      setSpaceTitle(result.title)
      setTopics(result.topics.map(t => ({
        title: t.title,
        description: t.contentOverview?.learningObjectives?.[0] || '',
        contentOverview: t.contentOverview,
        contentType: t.contentType || contentType
      })))

      const topicsMarkdown = result.topics.map((t, i) => 
        `${i + 1}. **${t.title}**\n   - ${t.contentOverview?.learningObjectives?.[0] || ''}`
      ).join('\n\n')

      const topicListMessage = `I've generated ${result.topics.length} topics for your learning space:\n\n${topicsMarkdown}\n\nYou can review them in the sidebar and click "Create Space" when ready!`

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: topicListMessage
      }])
      saveChatHistory(topic, [...messages, {
        role: 'assistant',
        content: topicListMessage
      }])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate topics'
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}. Please try again.` 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSpace = async () => {
    if (topics.length === 0) return
    
    setCreating(true)
    try {
      const validTopics = topics.filter(t => t.title.trim()).map(t => ({
        title: t.title,
        contentOverview: t.contentOverview,
        contentType: t.contentType || 'article'
      }))
      const titleToUse = spaceTitle || topic
      const space = await api.createSpaceWithTopics(titleToUse, validTopics)
      clearChatHistory(topic)
      navigate(`/space/${space.slug}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create space'
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error creating space: ${errorMessage}` 
      }])
    } finally {
      setCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!hasLLM) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <span className="material-icons text-red-500 text-5xl">error_outline</span>
          <h2 className="text-xl font-semibold mt-4 mb-2">LLM Not Configured</h2>
          <p className="text-gray-500 mb-6">Please enable OpenRouter or Custom Provider in Settings to use AI features.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto pl-4">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-icons text-primary text-sm">smart_toy</span>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
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
          {waitingForContentType ? (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleContentTypeSelect('article')}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-icons">article</span> Article
              </button>
              <button
                onClick={() => handleContentTypeSelect('slide')}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-icons">slideshow</span> Slide
              </button>
              <button
                onClick={() => handleContentTypeSelect('quiz')}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-icons">quiz</span> Quiz
              </button>
              <button
                onClick={() => handleContentTypeSelect('flashcard')}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-icons">style</span> Flashcard
              </button>
            </div>
          ) : (
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 bottom-2 p-2 bg-transparent text-[var(--color-primary)] rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons">send</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <span className="material-icons text-primary">list_alt</span>
              Learning Topics
            </h2>
            <p className="text-sm text-gray-500 mt-1">{topics.length} topics</p>
          </div>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {topics.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Start chatting to generate topics...
            </p>
          ) : (
            topics.map((t, i) => (
              <div key={i} className="group p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {editingTopicIndex === i ? (
                    <input
                      type="text"
                      value={editingTopicValue}
                      onChange={(e) => setEditingTopicValue(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, i)}
                      onBlur={() => handleTopicEdit(i, editingTopicValue)}
                      className="flex-1 text-sm border border-primary rounded px-2 py-1 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => startEditingTopic(i, t.title)}
                      className="flex-1 text-sm text-left hover:text-primary truncate"
                    >
                      {t.title}
                    </button>
                  )}
                  <button
                    onClick={() => handleTopicRemove(i)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition"
                  >
                    <span className="material-icons text-gray-400 text-sm">close</span>
                  </button>
                </div>
                {t.description && (
                  <p className="text-xs text-gray-500 mt-1 ml-8 line-clamp-2">{t.description}</p>
                )}
              </div>
            ))
          )}
        </div>

        {topics.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCreateSpace}
              disabled={creating}
              className="w-full py-3 bg-primary text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <span className="material-icons animate-spin">sync</span>
                  Creating Space...
                </>
              ) : (
                <>
                  <span className="material-icons">add</span>
                  Create Space with {topics.length} Topics
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
