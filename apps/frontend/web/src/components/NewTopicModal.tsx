import { useState } from 'react'

interface NewTopicModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (title: string) => void
}

export function NewTopicModal({ isOpen, onClose, onCreate }: NewTopicModalProps) {
  const [title, setTitle] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onCreate(title.trim())
      setTitle('')
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <h2 className="text-xl font-semibold mb-1">Add New Topic</h2>
        <p className="text-gray-500 text-sm mb-4">What topic do you want to add?</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g., Introduction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            autoFocus
          />
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
