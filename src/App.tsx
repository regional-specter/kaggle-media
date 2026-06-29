import { Route, Routes } from 'react-router-dom'
import { AppPage } from './pages/AppPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  )
}

export default App
