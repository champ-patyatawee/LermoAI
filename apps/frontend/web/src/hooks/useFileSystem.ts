import { useState, useEffect, useCallback } from 'react'
import type { Space, SpaceData, Topic, ContentType } from '@/types/space'
import { api } from '@/api/spaces'

export function useFileSystem() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [currentSpace, setCurrentSpace] = useState<SpaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  })

  const loadSpaces = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true)
      const data = await api.listSpaces(limit, offset)
      const mappedSpaces: Space[] = data.spaces.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        gradient: s.gradient,
        created_at: s.created_at,
      }))
      setSpaces(mappedSpaces)
      setPagination({
        total: data.total,
        limit: data.limit,
        offset: data.offset,
      })
      setError(null)
    } catch (err) {
      console.error('Failed to load spaces:', err)
      setError('Failed to load spaces')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSpace = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      const data = await api.getSpace(slug)
      setCurrentSpace(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load space:', err)
      setError('Failed to load space')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSpace = useCallback(async (title: string, description: string): Promise<Space | null> => {
    try {
      const space = await api.createSpace(title, description)
      await loadSpaces()
      return {
        id: space.id,
        title: space.title,
        slug: space.slug,
        description: space.description,
        icon: space.icon,
        gradient: space.gradient,
        created_at: space.created_at,
      }
    } catch (err) {
      console.error('Failed to create space:', err)
      setError('Failed to create space')
      return null
    }
  }, [loadSpaces])

  const createTopic = useCallback(async (spaceSlug: string, title: string, contentType?: ContentType): Promise<Topic | null> => {
    try {
      const topic = await api.createTopic(spaceSlug, title, contentType)
      await loadSpace(spaceSlug)
      await loadSpaces()
      return topic
    } catch (err) {
      console.error('Failed to create topic:', err)
      setError('Failed to create topic')
      return null
    }
  }, [loadSpace, loadSpaces])

  const deleteSpace = useCallback(async (slug: string) => {
    try {
      await api.deleteSpace(slug)
      await loadSpaces()
    } catch (err) {
      console.error('Failed to delete space:', err)
      setError('Failed to delete space')
    }
  }, [loadSpaces])

  useEffect(() => {
    loadSpaces()
  }, [loadSpaces])

  return {
    spaces,
    currentSpace,
    loading,
    error,
    pagination,
    needsSetup: false,
    isInitialized: true,
    folderName: 'API Storage',
    loadSpaces,
    loadSpace,
    createSpace,
    createTopic,
    deleteSpace,
    pickDirectory: async () => null,
  }
}
