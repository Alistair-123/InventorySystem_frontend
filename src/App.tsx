import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoadPage from './pages/loadpage/LoadPage'
import LogInPage from './pages/login/LogInPage'
import Dashboard from './pages/dashboard/Dashboard'
import Test from './pages/test/Test'
import Layout from './layout/Layout'
import DashboardRedirect from './context/DashboardRedirect'

function App() {
  return (
    
      <BrowserRouter>
         
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoadPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/test" element={<Test />} />
          {/* Protected / App layout */}
          <Route  element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <DashboardRedirect>
                  <Dashboard />
                </DashboardRedirect>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App;
