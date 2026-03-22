import { useState, useEffect } from 'react'
import { FlashcardArray } from 'react-quizlet-flashcard'
import 'react-quizlet-flashcard/dist/index.css'
import type { Space, Topic } from '@/types/space'
import { getFlashcards } from '@/api/flashcards'

const flashcardStyles = `
  .flashcard__front, .flashcard__back {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .flashcard__front > div, .flashcard__back > div {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    width: 100% !important;
  }
`

interface TopicFlashcardsProps {
  space: Space
  topic: Topic
}

interface FlashcardData {
  id: number
  front: { html: string }
  back: { html: string }
}

function parseHtmlToElement(html: string): JSX.Element {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export function TopicFlashcards({ space, topic }: TopicFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFlashcards() {
      try {
        setLoading(true)
        const result = await getFlashcards(space.slug, topic.slug)
        setFlashcards(result.flashcards)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load flashcards'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadFlashcards()
  }, [space.slug, topic.slug])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl animate-spin text-primary">sync</span>
          <p className="mt-2 text-gray-500">Loading flashcards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl text-gray-300">style</span>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-4xl text-gray-300">style</span>
          <p className="mt-2 text-gray-500">No flashcards found</p>
        </div>
      </div>
    )
  }

  const deck = flashcards.map(card => ({
    id: card.id,
    front: { html: parseHtmlToElement(card.front.html) },
    back: { html: parseHtmlToElement(card.back.html) },
  }))

  return (
    <>
      <style>{flashcardStyles}</style>
      <div className="flex-1 flex items-center justify-center h-full overflow-hidden">
        <div className="w-full max-w-2xl">
          <FlashcardArray deck={deck} />
        </div>
      </div>
    </>
  )
}
