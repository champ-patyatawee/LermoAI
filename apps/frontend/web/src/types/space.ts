export interface ContentOverview {
  learningObjectives: string[]
  keyConcepts: string[]
}

export type ContentType = 'article' | 'slide' | 'quiz' | 'flashcard'

export interface Topic {
  id: string
  title: string
  slug: string
  order: number
  contents: {
    article: boolean
    slide: boolean
    flashcard: boolean
    quiz: boolean
  }
  contentOverview?: ContentOverview
  contentType?: ContentType
}

export interface Space {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  gradient: string
  created_at: string
  topics?: Topic[]
}

export interface SpaceData {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  gradient: string
  created_at: string
  topics: Topic[]
}
