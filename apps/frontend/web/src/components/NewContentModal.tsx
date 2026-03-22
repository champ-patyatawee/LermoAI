import type { Topic } from '@/types/space'

interface NewContentModalProps {
  topic: Topic
  onSelectChat: () => void
  onSelectArticle: () => void
  onClose: () => void
}

export function NewContentModal({ topic, onSelectChat, onSelectArticle, onClose }: NewContentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Content to "{topic.title}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onSelectChat}
            className="w-full p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <p className="text-sm text-gray-500">AI-powered conversation to help you learn</p>
            </div>
          </button>
          
          <button
            onClick={onSelectArticle}
            className="w-full p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="material-icons text-2xl">article</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Article</h3>
              <p className="text-sm text-gray-500">AI-generated learning content</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
