import { useState, useEffect, useRef, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { settingsApi, type Settings } from '@/api/settings'

interface LLMProvider {
  id: 'openrouter' | 'custom'
  name: string
  description: string
}

const PROVIDERS: LLMProvider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access multiple AI models through OpenRouter API',
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Use your own OpenAI-compatible API endpoint',
  },
]

function ModelSelector({
  apiKey,
  selectedModel,
  onSelect,
}: {
  apiKey: string
  selectedModel: string
  onSelect: (model: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const fetchedRef = useRef(false)

  const fetchModels = useCallback(async () => {
    if (!apiKey || fetchedRef.current) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }

      const data = await response.json()

      const modelList = (data.data || []).map((m: { id: string; name?: string }) => ({
        id: m.id,
        name: m.name || m.id,
      }))

      setModels(modelList)
      fetchedRef.current = true
    } catch (err) {
      setError('Failed to load models. Check your API key.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && apiKey && !fetchedRef.current) {
      fetchModels()
    }
  }, [isOpen, apiKey, fetchModels])

  const filteredModels = models.filter(
    (m) =>
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
      <button
        type="button"
        onClick={() => {
          if (apiKey) {
            setIsOpen(!isOpen)
            if (!isOpen) {
              fetchedRef.current = false
            }
          }
        }}
        disabled={!apiKey}
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between hover:border-gray-400 transition-colors ${
          !apiKey ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={selectedModel ? 'text-gray-900 truncate' : 'text-gray-400'}>
          {!apiKey ? 'Enter API key first' : selectedModel || 'Select a model'}
        </span>
        {apiKey && (
          <span className={`material-icons text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        )}
      </button>

      {isOpen && apiKey && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <span className="material-icons animate-spin">sync</span>
              <p className="mt-2 text-sm">Loading models...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <>
              <div className="p-2 border-b border-gray-100 bg-gray-50">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search models..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      onSelect(model.id)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary/5 focus:outline-none flex items-center justify-between group"
                  >
                    <span className="truncate text-gray-700 group-hover:text-primary">{model.name}</span>
                    {selectedModel === model.id && (
                      <span className="material-icons text-primary text-sm">check</span>
                    )}
                  </button>
                ))}
                {filteredModels.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No models found</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getSettings()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleProvider = async (providerId: 'openrouter' | 'custom') => {
    const current = settings[providerId] || { enabled: false, apiKey: '', model: '' }
    const newData = { ...current, enabled: !current.enabled }

    try {
      const updated = await settingsApi.updateProvider(providerId, newData)
      setSettings(updated)
    } catch (err) {
      console.error('Failed to update provider:', err)
    }
  }

  const updateApiKey = async (providerId: 'openrouter' | 'custom', apiKey: string) => {
    const current = settings[providerId] || { enabled: true, apiKey: '', model: '' }
    const newData = { ...current, apiKey }

    try {
      const updated = await settingsApi.updateProvider(providerId, newData)
      setSettings(updated)
    } catch (err) {
      console.error('Failed to update API key:', err)
    }
  }

  const selectModel = async (providerId: 'openrouter' | 'custom', model: string) => {
    const current = settings[providerId] || { enabled: true, apiKey: '', model: '' }
    const newData = { ...current, model }

    try {
      const updated = await settingsApi.updateProvider(providerId, newData)
      setSettings(updated)
    } catch (err) {
      console.error('Failed to update model:', err)
    }
  }

  const updateUrl = async (providerId: 'custom', url: string) => {
    const current = settings[providerId] || { enabled: true, url: '', apiKey: '', model: '' }
    const newData = { ...current, url }

    try {
      const updated = await settingsApi.updateProvider(providerId, newData)
      setSettings(updated)
    } catch (err) {
      console.error('Failed to update URL:', err)
    }
  }

  const updateModel = async (providerId: 'custom', model: string) => {
    const current = settings[providerId] || { enabled: true, url: '', apiKey: '', model: '' }
    const newData = { ...current, model }

    try {
      const updated = await settingsApi.updateProvider(providerId, newData)
      setSettings(updated)
    } catch (err) {
      console.error('Failed to update model:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar activeItem="settings" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <span className="material-icons animate-spin text-primary text-4xl">sync</span>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar 
        activeItem="settings" 
        isOpen={mobileNavOpen} 
        onToggle={() => setMobileNavOpen(!mobileNavOpen)}
        showHamburger
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">Settings</h1>

          <section className="mb-8 md:mb-10">
            <h2 className="text-base md:text-lg font-medium mb-4 flex items-center gap-2">
              <span className="material-icons text-gray-400">person</span>
              Account
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-gray-500 text-2xl md:text-3xl">account_circle</span>
              </div>
              <div>
                <p className="font-semibold text-base md:text-lg">User</p>
                <p className="text-gray-500 text-sm">user@example.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-medium mb-4 flex items-center gap-2">
              <span className="material-icons text-gray-400">hub</span>
              LLM Providers
            </h2>
            <div className="space-y-4 md:space-y-6">
              {PROVIDERS.map((provider) => {
                const providerSettings = settings[provider.id] || { enabled: false, apiKey: '', model: '', url: '' }
                const isCustom = provider.id === 'custom'
                return (
                  <div
                    key={provider.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 ${
                      providerSettings.enabled
                        ? 'border-primary/30 shadow-lg shadow-primary/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                          <h3 className="font-semibold text-base md:text-lg">{provider.name}</h3>
                          {providerSettings.enabled && providerSettings.model && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              {providerSettings.model.split('/').pop() || providerSettings.model}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{provider.description}</p>
                      </div>
                      <button
                        onClick={() => toggleProvider(provider.id)}
                        className={`relative inline-flex w-14 h-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          providerSettings.enabled ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            providerSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {providerSettings.enabled && (
                      <div className="px-4 md:px-5 pb-4 md:pb-6 border-t border-gray-100 pt-4 md:pt-5 space-y-4 md:space-y-5">
                        {isCustom && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              API URL
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={(providerSettings as { url?: string }).url || ''}
                                onChange={(e) => updateUrl(provider.id, e.target.value)}
                                placeholder="https://api.openai.com/v1/chat/completions"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 text-sm"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-gray-400 text-sm">
                                link
                              </span>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={providerSettings.apiKey}
                              onChange={(e) => updateApiKey(provider.id, e.target.value)}
                              placeholder={provider.id === 'openrouter' ? 'sk-or-v1-...' : 'sk-...'}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 font-mono text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-gray-400 text-sm">
                              key
                            </span>
                          </div>
                        </div>

                        {isCustom ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Model
                            </label>
                            <input
                              type="text"
                              value={(providerSettings as { model?: string }).model || ''}
                              onChange={(e) => updateModel(provider.id, e.target.value)}
                              placeholder="gpt-4o-mini"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                          </div>
                        ) : (
                          <ModelSelector
                            apiKey={providerSettings.apiKey}
                            selectedModel={providerSettings.model}
                            onSelect={(model) => selectModel(provider.id, model)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
