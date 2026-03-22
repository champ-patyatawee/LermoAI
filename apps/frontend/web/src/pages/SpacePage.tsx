import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TopicList } from '@/components/TopicList'
import { NewTopicModal } from '@/components/NewTopicModal'
import { TopicChat } from '@/components/TopicChat'
import { TopicArticle } from '@/components/TopicArticle'
import { TopicSlide } from '@/components/TopicSlide'
import { TopicFlashcards } from '@/components/TopicFlashcards'
import { TopicQuiz } from '@/components/TopicQuiz'
import { useFileSystem } from '@/hooks/useFileSystem'
import type { Topic } from '@/types/space'

type ContentType = 'article' | 'slide' | 'flashcard' | 'quiz' | null

export function SpacePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { currentSpace, loading, loadSpace, createTopic } = useFileSystem()
  const [showNewTopicModal, setShowNewTopicModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [chatPanelOpen, setChatPanelOpen] = useState(false)

  const filteredTopics = currentSpace?.topics?.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  useEffect(() => {
    if (slug) {
      loadSpace(slug)
    }
  }, [slug, loadSpace])

  const handleCreateTopic = async (title: string) => {
    if (slug) {
      await createTopic(slug, title)
    }
  }

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic)
    if (topic.contents.article) {
      setSelectedContentType('article')
    } else if (topic.contents.slide) {
      setSelectedContentType('slide')
    } else if (topic.contents.flashcard) {
      setSelectedContentType('flashcard')
    } else if (topic.contents.quiz) {
      setSelectedContentType('quiz')
    } else {
      setSelectedContentType(null)
    }
  }

  const handleSelectArticle = (topic: Topic) => {
    setSelectedTopic(topic)
    setSelectedContentType('article')
  }

  const handleSelectSlide = (topic: Topic) => {
    setSelectedTopic(topic)
    setSelectedContentType('slide')
  }

  const handleSelectFlashcard = (topic: Topic) => {
    setSelectedTopic(topic)
    setSelectedContentType('flashcard')
  }

  const handleSelectQuiz = (topic: Topic) => {
    setSelectedTopic(topic)
    setSelectedContentType('quiz')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </main>
      </div>
    )
  }

  if (!currentSpace) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Space not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Topics Drawer - Desktop: Sticky sidebar, Mobile: Slide-out */}
      <aside className={`
        sticky top-0 z-40
        w-72 shrink-0
        h-screen
        bg-white
        border-r border-gray-200
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 md:p-5 border-b border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-medium text-sm flex items-center gap-1 mb-3 hover:opacity-80 transition"
          >
            <span className="material-icons text-sm">arrow_back</span>
            Back to Spaces
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold truncate pr-2">{currentSpace.title}</h2>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0">
              <span className="material-icons text-gray-400">more_vert</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TopicList 
            topics={filteredTopics}
            spaceSlug={slug || ''}
            onSelectTopic={handleSelectTopic}
            onSelectArticle={handleSelectArticle}
            onSelectSlide={handleSelectSlide}
            onSelectFlashcard={handleSelectFlashcard}
            onSelectQuiz={handleSelectQuiz}
            onRefreshSpace={() => slug && loadSpace(slug)}
          />
        </div>

        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <span className="material-icons text-gray-500">close</span>
        </button>
      </aside>

      {/* Hamburger Button - Mobile only */}
      {!mobileNavOpen && (
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <span className="material-icons text-gray-600">menu</span>
        </button>
      )}

      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {selectedContentType === 'article' && selectedTopic && currentSpace && (
            <TopicArticle space={currentSpace} topic={selectedTopic} />
          )}
          {selectedContentType === 'slide' && selectedTopic && currentSpace && (
            <TopicSlide space={currentSpace} topic={selectedTopic} />
          )}
          {selectedContentType === 'flashcard' && selectedTopic && currentSpace && (
            <TopicFlashcards space={currentSpace} topic={selectedTopic} />
          )}
          {selectedContentType === 'quiz' && selectedTopic && currentSpace && (
            <TopicQuiz space={currentSpace} topic={selectedTopic} />
          )}
          {!selectedContentType && (
            <div className="max-w-3xl mx-auto">
              {selectedTopic ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                  <div className="text-center text-gray-500">
                    <span className="material-icons text-4xl mb-4">edit_note</span>
                    <p>Select content to view</p>
                    <p className="text-sm mt-2">Click the buttons next to a topic to view Article, Slide, Flashcard, or Quiz</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                  <div className="text-center text-gray-500">
                    <span className="material-icons text-4xl mb-4">folder_open</span>
                    <p>Select a topic to view content</p>
                    <p className="text-sm mt-2">Or click "Add Topic" to create a new one</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Chat Panel - Desktop */}
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:shrink-0 w-80 h-screen bg-white border-l border-gray-200 flex-col">
        <TopicChat 
          space={currentSpace} 
          topic={selectedTopic} 
          contentType={selectedContentType}
        />
      </aside>

      {/* Chat FAB - Mobile */}
      <button
        onClick={() => setChatPanelOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition z-30"
      >
        <span className="material-icons">chat</span>
      </button>

      {/* Chat Panel Modal - Mobile */}
      {chatPanelOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold">AI Chat</h2>
            <button
              onClick={() => setChatPanelOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-icons text-gray-500">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <TopicChat 
              space={currentSpace} 
              topic={selectedTopic} 
              contentType={selectedContentType}
            />
          </div>
        </div>
      )}

      <NewTopicModal
        isOpen={showNewTopicModal}
        onClose={() => setShowNewTopicModal(false)}
        onCreate={handleCreateTopic}
      />
    </div>
  )
}
