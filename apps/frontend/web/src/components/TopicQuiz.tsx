import { useState, useEffect } from 'react'
import type { Space, Topic } from '@/types/space'
import { getQuiz, type QuizQuestion } from '@/api/quiz'

interface TopicQuizProps {
  space: Space
  topic: Topic
}

export function TopicQuiz({ space, topic }: TopicQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true)
        const result = await getQuiz(space.slug, topic.slug)
        setQuestions(result.questions)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [space.slug, topic.slug])

  const handleSelectAnswer = (choiceId: string) => {
    if (showResult) return
    setSelectedAnswer(choiceId)
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl animate-spin text-primary">sync</span>
          <p className="mt-2 text-gray-500">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl text-gray-300">quiz</span>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl text-gray-300">quiz</span>
          <p className="mt-2 text-gray-500">No quiz found</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <span className="text-sm text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.choices.map((choice) => {
              let bgClass = 'bg-white hover:bg-gray-50 border-gray-200'
              
              if (showResult) {
                if (choice.id === currentQuestion.correctAnswer) {
                  bgClass = 'bg-green-100 border-green-300'
                } else if (choice.id === selectedAnswer && !isCorrect) {
                  bgClass = 'bg-red-100 border-red-300'
                }
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectAnswer(choice.id)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${bgClass} ${
                    !showResult ? 'hover:border-primary cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium mr-3">
                    {choice.id.toUpperCase()}
                  </span>
                  <span className="text-gray-700">{choice.text}</span>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect. The correct answer is ' + currentQuestion.correctAnswer.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-icons">chevron_left</span>
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
