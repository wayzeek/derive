import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-full bg-derive-cloud">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Additional routes will be added here */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App 