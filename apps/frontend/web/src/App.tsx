import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpacesPage } from '@/pages/SpacesPage'
import { SpacePage } from '@/pages/SpacePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AIChatPanel } from '@/components/AIChatPanel'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpacesPage />} />
        <Route path="/space/:slug" element={<SpacePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/create-space" element={<AIChatPanel />} />
        <Route path="/create-space/:topic" element={<AIChatPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
