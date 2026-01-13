import type { IconType } from "react-icons";
import {
  LuFolderTree,
  LuTag,
  LuRuler,
  LuBuilding2,
  LuShoppingCart,
  LuBox,
  LuClipboardList
} from "react-icons/lu";
import { 
  // FaClipboardList,
  // FaBoxOpen,
  // FaBuilding,
  // FaTags,
  // FaUser,
  FaChartPie,
  FaListAlt,
  FaLayerGroup,
  FaFileAlt,
  FaUsers 
} from "react-icons/fa";

interface SidebarItemConfig {
  label: string;
  url: string;
  icon?: IconType;
}

// Master Data
export const masterdataConfig: Record<string, SidebarItemConfig> = {
  category: { label: "Categories", url: "/categories", icon: LuFolderTree },
  brand: { label: "Brands", url: "/brands", icon: LuTag },
  unit: { label: "Units", url: "/units", icon: LuRuler },
  office: { label: "Offices", url: "/offices", icon: LuBuilding2 },
  acquisitionType: { label: "Acquisition Types", url: "/acquisitions", icon: LuShoppingCart },
};

// Transactions
export const transactionsConfig: Record<string, SidebarItemConfig> = {
  items: { label: "Items", url: "/items", icon: LuBox },
  properties: { label: "Properties", url: "/properties", icon: LuClipboardList },
};

// Reports
export const reportsConfig: Record<string, SidebarItemConfig> = {
  InventorySummary: { label: "Inventory Summary", url: "/reports/inventory-summary", icon: FaChartPie },
  PropertyStatus: { label: "Property Status", url: "/reports/property-status", icon: FaListAlt },
  PropertiesPerCategory: { label: "Properties per Category", url: "/reports/properties-per-category", icon: FaLayerGroup },
  PropertiesPerItem: { label: "Properties per Item", url: "/reports/properties-per-item", icon: FaFileAlt },
  PropertiesPerPersonnel: { label: "Properties per Personnel", url: "/reports/properties-per-personnel", icon: FaUsers },
}