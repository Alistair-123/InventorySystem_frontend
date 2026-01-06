import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogInPage from './pages/login/LogInPage'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInPage />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
