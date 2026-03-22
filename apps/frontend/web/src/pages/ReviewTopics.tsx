import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api, type TopicInput } from '@/api/spaces'
import type { SpaceData } from '@/types/space'

interface LocationState {
  topics: string[]
  topic: string
  goal: string
}

export function ReviewTopics() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const [topics, setTopics] = useState<string[]>(state?.topics || [])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  if (!state || !state.topics || !state.topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No topics found. Please start over.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const { topic, goal } = state

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics]
    newTopics[index] = value
    setTopics(newTopics)
  }

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index))
  }

  const handleAddTopic = () => {
    setTopics([...topics, ''])
  }

  const handleCreate = async () => {
    const validTopics = topics.filter(t => t.trim())
    if (validTopics.length === 0) {
      setError('Please add at least one topic')
      return
    }

    setCreating(true)
    setError('')

    try {
      const topicInputs: TopicInput[] = validTopics.map(t => ({
        title: t,
        contentType: 'article'
      }))
      const space: SpaceData = await api.createSpaceWithTopics(topic, goal, topicInputs)
      navigate(`/space/${space.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create space')
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(`/create-space/${encodeURIComponent(topic)}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div>
            <h1 className="font-semibold text-lg">Review Topics</h1>
            <p className="text-sm text-gray-500">Topic: {topic}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-green-600">check_circle</span>
              </div>
              <div>
                <h2 className="font-semibold">Your Learning Path</h2>
                <p className="text-sm text-gray-500">Review and edit the generated topics</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Goal:</span> {goal}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {topics.map((t, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={t}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  className="flex-1 border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Topic title..."
                />
                <button
                  onClick={() => handleRemoveTopic(index)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="material-icons text-gray-400 text-sm">close</span>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddTopic}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition mb-6 flex items-center justify-center gap-2"
          >
            <span className="material-icons">add</span>
            Add Topic
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/create-space/${encodeURIComponent(topic)}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Go Back
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || topics.filter(t => t.trim()).length === 0}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <span className="material-icons animate-spin">sync</span>
                  Creating...
                </>
              ) : (
                <>
                  Create Space
                  <span className="material-icons">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
