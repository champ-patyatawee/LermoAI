import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { generateApi } from '@/api/generate'
import { settingsApi } from '@/api/settings'

type Step = 'ASKING_TOPIC' | 'ASKING_GOAL' | 'GENERATING' | 'ERROR'

export function CreateSpaceChat() {
  const { topic } = useParams<{ topic: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('ASKING_TOPIC')
  const [topicInput, setTopicInput] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')

  const decodedTopic = topic ? decodeURIComponent(topic) : ''

  useEffect(() => {
    if (decodedTopic) {
      setStep('ASKING_GOAL')
      checkSettings()
    }
  }, [decodedTopic])

  const checkSettings = async () => {
    try {
      const settings = await settingsApi.getSettings()
      const hasProvider = 
        (settings.openrouter?.enabled && settings.openrouter?.apiKey) ||
        (settings.custom?.enabled && settings.custom?.apiKey)
      
      if (!hasProvider) {
        setError('No LLM provider configured. Please enable OpenRouter or Custom Provider in Settings.')
        setStep('ERROR')
      }
    } catch {
      setError('Failed to load settings. Please configure your LLM provider.')
      setStep('ERROR')
    }
  }

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topicInput.trim()) {
      navigate(`/create-space/${encodeURIComponent(topicInput.trim())}`)
    }
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim() || !decodedTopic) return

    setStep('GENERATING')
    setError('')

    try {
      const response = await generateApi.generateTopics(decodedTopic, goal.trim())
      navigate(`/create-space/${topic}/review`, {
        state: { topics: response.topics, topic: decodedTopic, goal: goal.trim() }
      })
    } catch {
      setError('Failed to generate topics')
      setStep('ERROR')
    }
  }

  const handleRetry = () => {
    setStep(decodedTopic ? 'ASKING_GOAL' : 'ASKING_TOPIC')
    setError('')
  }

  const handleGoToSettings = () => {
    navigate('/settings')
  }

  if (step === 'GENERATING') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <span className="material-icons text-primary text-6xl animate-pulse">auto_awesome</span>
          <h2 className="text-xl font-semibold mt-4 mb-2">Generating Your Learning Path</h2>
          <p className="text-gray-500">Creating personalized topics for {decodedTopic}...</p>
        </div>
      </div>
    )
  }

  if (step === 'ERROR') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <span className="material-icons text-red-500 text-5xl">error_outline</span>
          <h2 className="text-xl font-semibold mt-4 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          
          {error.includes('LLM provider') || error.includes('Settings') ? (
            <button
              onClick={handleGoToSettings}
              className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition"
            >
              Go to Settings
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'ASKING_TOPIC') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <div>
              <h1 className="font-semibold text-lg">Create Learning Space</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-2">What do you want to learn?</h2>
              <p className="text-gray-500 text-sm mb-6">AI will help you create a personalized learning path.</p>
              
              <form onSubmit={handleTopicSubmit}>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Learning Python, Machine Learning, Web Development..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  autoFocus
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!topicInput.trim()}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue
                    <span className="material-icons">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/create-space')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div>
            <h1 className="font-semibold text-lg">Create Learning Space</h1>
            <p className="text-sm text-gray-500">Topic: {decodedTopic}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-icons text-primary">smart_toy</span>
              </div>
              <div>
                <p className="text-gray-900 text-lg">
                  What do you want to achieve by learning {decodedTopic}?
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  This helps me create a personalized learning path for you.
                </p>
              </div>
            </div>

            <form onSubmit={handleGoalSubmit}>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Get a job in machine learning, Build my own AI app, Understand how LLMs work..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                rows={3}
                autoFocus
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!goal.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Generate Topics
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
