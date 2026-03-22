interface SpaceCardProps {
  title?: string
  description?: string
  icon?: string
  gradient?: string
  timestamp?: string
  isNew?: boolean
  onClick?: () => void
}

export function SpaceCard({
  title,
  description,
  icon,
  gradient,
  timestamp,
  isNew = false,
  onClick,
}: SpaceCardProps) {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-primary/5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:shadow-lg transition p-5 cursor-pointer group h-52"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <span className="material-icons text-3xl text-primary">add</span>
          </div>
          <h3 className="font-semibold text-lg text-primary">New Space</h3>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 cursor-pointer border border-gray-100 h-52"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      <p className="text-xs text-gray-400 mt-auto">{timestamp}</p>
    </div>
  )
}
