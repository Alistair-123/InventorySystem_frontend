import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { Toaster } from 'react-hot-toast'
import LoadPage from './pages/loadpage/LoadPage'
import LogInPage from './pages/login/LogInPage'
import Dashboard from './pages/dashboard/Dashboard'
import Test from './pages/test/Test'
import Layout from './layout/Layout'
import DashboardRedirect from './context/DashboardRedirect'


import Category from './pages/category/Category'
import Brand from './pages/brand/Brand'
import Units from './pages/unit/Units'
import Office from './pages/office/Office'
import Acquisitions from './pages/acquisitions/Acquisitions'
import Items from './pages/items/Items'
function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoadPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/test" element={<Test />} />
           <Route  path="*" element={<div>404 Not Found</div>} />
          {/* Protected / App layout */}
          <Route  element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                // <DashboardRedirect>
                  <Dashboard />
                // </DashboardRedirect>
              }
            />
            
            <Route path="/categories" element={<Category />} />
            <Route path='/brands' element={<Brand />} />
            <Route path='/units' element={<Units />} />
            <Route path='/offices' element={<Office />} />
            <Route path='/acquisitions' element={<Acquisitions />} />

            <Route path="/items" element={<Items />} />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App;
