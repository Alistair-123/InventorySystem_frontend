import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoadPage from './pages/loadpage/LoadPage'
import LogInPage from './pages/login/LogInPage'
import Dashboard from './pages/dashboard/Dashboard'
import Test from './pages/test/Test'
import Layout from './layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoadPage />} />
        <Route path="/login" element={<LogInPage />} />

        {/* Protected / App layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
