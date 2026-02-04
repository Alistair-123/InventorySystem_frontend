import { Routes, Route, useLocation } from "react-router-dom";
import LoadPage from "./pages/loadpage/LoadPage";
import LogInPage from "./pages/login/LogInPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./layout/Layout";

// Pages
import Category from "./pages/category/Category";
import Brand from "./pages/brand/Brand";
import Units from "./pages/unit/Units";
import Office from "./pages/office/Office";
import Acquisitions from "./pages/acquisitions/Acquisitions";
import Items from "./pages/items/Items";
import Properties from "./pages/properties/Properties";
import AdjustmentReports from "./pages/adjustment reports/AdjustmentReports";
import InventorySummary from "./pages/inventory summary/InventorySummary";
import PropertyStatus from "./pages/property status/PropertyStatus";
import PropertiesPerPersonnel from "./pages/properties per personnel/PropertiesPerPersonnel";
import PropertiesPerCategory from "./pages/properties per category/PropertiesPerCategory";
import PropertiesPerItem from "./pages/properties per item/PropertiesPerItem";
import AddPersonnel from "./pages/admin/AddPersonnel";

// Modals
import Account from "./pages/account/Account";
import Manage from "./pages/admin/ManageUsers";

function AppWrapper() {
  const location = useLocation();
  const background = location.state?.background || null;

  return (
    <>
      {/* Main routes */}
      <Routes location={background || location}>
        {/* Public */}
        <Route path="/" element={<LoadPage />} />
        <Route path="/login" element={<LogInPage />} />

        {/* Protected / Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/brands" element={<Brand />} />
          <Route path="/units" element={<Units />} />
          <Route path="/offices" element={<Office />} />
          <Route path="/acquisitions" element={<Acquisitions />} />
          <Route path="/items" element={<Items />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/adjustment-reports" element={<AdjustmentReports />} />
          <Route path="/admin/add-personnel" element={<AddPersonnel onCancel={() => window.history.back()} />} />
          {/* Reports */}
          <Route path="/reports/inventory-summary" element={<InventorySummary />} />
          <Route path="/reports/property-status" element={<PropertyStatus />} />
          <Route path="/reports/properties-per-category" element={<PropertiesPerCategory />} />
          <Route path="/reports/properties-per-item" element={<PropertiesPerItem />} />
          <Route path="/reports/properties-per-personnel" element={<PropertiesPerPersonnel />} />
        </Route>
      </Routes>

      {/* Modals */}
      {background && (
        <Routes>
          <Route
            path="/account/*"
            element={<Account onClose={() => window.history.back()} />}
          />
          <Route
            path="/admin/*"
            element={<Manage onClose={() => window.history.back()} />}
          />
        </Routes>
      )}
    </>
  );
}

export default AppWrapper;
