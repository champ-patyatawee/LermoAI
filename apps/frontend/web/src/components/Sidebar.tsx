import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  activeItem?: 'dashboard' | 'spaces' | 'settings'
  isOpen?: boolean
  onToggle?: () => void
  showHamburger?: boolean
}

export function Sidebar({ activeItem = 'dashboard', isOpen, onToggle, showHamburger }: SidebarProps) {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    onToggle?.()
  }

  return (
    <>
      {showHamburger && !isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <span className="material-icons text-gray-600">menu</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`
        fixed lg:relative z-50 lg:z-auto
        w-64 lg:w-20
        h-full lg:h-screen
        bg-white lg:bg-transparent
        flex flex-col justify-between         border-r border-gray-200
        py-6 px-4 lg:p-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col items-center lg:items-center space-y-8">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <img
              alt="Logo"
              className="h-10 w-10 mt-4 lg:mt-4"
              src="/logo.svg"
            />
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-icons text-gray-500">close</span>
            </button>
          </div>
          <nav className="flex flex-col items-center lg:items-center space-y-4 w-full">
            <button
              onClick={() => handleNavigate('/')}
              className={`flex items-center gap-3 w-full lg:justify-center px-4 lg:px-0 py-3 lg:py-2 rounded-xl transition ${
                activeItem === 'dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons text-2xl">dashboard</span>
              <span className="lg:hidden font-medium">Dashboard</span>
            </button>
          </nav>
        </div>
        <div className="flex flex-col items-center lg:items-center gap-4 pt-4 w-full">
          <button
            onClick={() => handleNavigate('/settings')}
            className={`flex items-center gap-3 w-full lg:justify-center px-4 lg:px-0 py-3 lg:py-2 rounded-xl transition ${
              activeItem === 'settings'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-icons">settings</span>
            <span className="lg:hidden font-medium">Settings</span>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
            <span className="material-icons text-gray-600">account_circle</span>
          </button>
        </div>
      </aside>
    </>
  )
}
