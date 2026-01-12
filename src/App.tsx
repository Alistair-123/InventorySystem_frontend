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
import Properties from './pages/properties/Properties'
import AdjustmentRecords from './pages/adjustment records/AdjustmentRecords'
import InventorySummary from './pages/inventory summary/InventorySummary'
import PropertyStatus from './pages/property status/PropertyStatus'
import PropertiesPerPersonnel from './pages/properties per personnel/PropertiesPerPersonnel'
import PropertiesPerCategory from './pages/properties per category/PropertiesPerCategory'
import PropertiesPerItem from './pages/properties per item/PropertiesPerItem'

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
                //  <DashboardRedirect>
                  <Dashboard />
                //  </DashboardRedirect>
              }
            />
            
            <Route path="/categories" element={<Category />} />
            <Route path='/brands' element={<Brand />} />
            <Route path='/units' element={<Units />} />
            <Route path='/offices' element={<Office />} />
            <Route path='/acquisitions' element={<Acquisitions />} />
            <Route path="/items" element={<Items />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/adjustment-records" element={<AdjustmentRecords />} />
            <Route path="/reports/inventory-summary" element={<InventorySummary />} />
            <Route path="/reports/property-status" element={<PropertyStatus />} />
            <Route path="/reports/properties-per-category" element={<PropertiesPerCategory />} />
            <Route path="reports/properties-per-item" element={<PropertiesPerItem />} />
            <Route path="/reports/properties-per-personnel" element={<PropertiesPerPersonnel />} />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App;
