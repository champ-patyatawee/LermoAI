import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface NewSpaceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewSpaceModal({ isOpen, onClose }: NewSpaceModalProps) {
  const [topic, setTopic] = useState('')
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      navigate(`/create-space/${encodeURIComponent(topic.trim())}`)
      setTopic('')
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <h2 className="text-xl font-semibold mb-1">Create New Space</h2>
        <p className="text-gray-500 text-sm mb-4">What do you want to learn? AI will help you create a learning path.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g., Learning Python"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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
              disabled={!topic.trim()}
              className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Start
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
