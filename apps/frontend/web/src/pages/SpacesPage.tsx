import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { SpaceCard } from '@/components/SpaceCard'
import { useFileSystem } from '@/hooks/useFileSystem'

export function SpacesPage() {
  const navigate = useNavigate()
  const { spaces, loading, pagination, loadSpaces } = useFileSystem()
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const limit = 10
  const totalPages = Math.ceil(pagination.total / limit)

  useEffect(() => {
    const offset = (currentPage - 1) * limit
    loadSpaces(limit, offset)
  }, [currentPage, loadSpaces])

  const handleSpaceClick = (slug: string) => {
    navigate(`/space/${slug}`)
  }

  const handleNewSpace = () => {
    navigate('/create-space')
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hours ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return `${Math.floor(days / 7)} weeks ago`
  }

  if (loading && spaces.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="text-gray-500">Loading spaces...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar 
        activeItem="dashboard" 
        isOpen={mobileNavOpen} 
        onToggle={() => setMobileNavOpen(!mobileNavOpen)}
        showHamburger
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          <SpaceCard isNew onClick={handleNewSpace} />
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              title={space.title}
              description={space.description}
              icon={space.icon}
              gradient={space.gradient}
              timestamp={formatTimestamp(space.created_at)}
              onClick={() => handleSpaceClick(space.slug)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-full shadow-lg px-4 md:px-6 py-2 md:py-3 flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons text-gray-600 text-sm">chevron_left</span>
              </button>

              <div className="flex items-center gap-1">
                {currentPage > 3 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-sm"
                  >
                    1
                  </button>
                )}

                {currentPage > 4 && (
                  <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
                )}

                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 1 + i
                  if (page > totalPages) return null
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-sm ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                {currentPage < totalPages - 3 && (
                  <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
                )}

                {currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-sm"
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons text-gray-600 text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
