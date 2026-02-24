// sidebarData.ts
import type { IconType } from "react-icons";
import { LuFolderTree, LuTag, LuRuler, LuBuilding2, LuShoppingCart, LuBox, LuClipboardList } from "react-icons/lu";
import { FaChartPie, FaListAlt, FaLayerGroup, FaFileAlt, FaUsers } from "react-icons/fa";

interface SidebarItem {
  label: string;
  url: string;
  icon?: IconType;
}

interface SidebarSection {
  label: string;
  items: Record<string, SidebarItem>;
}

export const sidebarData: Record<string, SidebarSection> = {
  dashboard: {
    label: "Dashboard",
    items: {
      dashboard: { label: "Dashboard", url: "/dashboard" },
    },
  },
  masterdata: {
    label: "Master Data",
    items: {
      category:        { label: "Categories",       url: "/categories",  icon: LuFolderTree  },
      brand:           { label: "Brands",            url: "/brands",       icon: LuTag         },
      unit:            { label: "Units",             url: "/units",        icon: LuRuler       },
      office:          { label: "Offices",           url: "/offices",      icon: LuBuilding2   },
      acquisitionType: { label: "Acquisition Types", url: "/acquisitions", icon: LuShoppingCart},
    },
  },
  transactions: {
    label: "Transactions",
    items: {
      items:      { label: "Items",      url: "/items",      icon: LuBox          },
      properties: { label: "Properties", url: "/properties", icon: LuClipboardList},
    },
  },
  reports: {
    label: "Reports",
    items: {
      inventory:              { label: "Inventory Summary",       url: "/reports/inventory-summary",          icon: FaChartPie  },
      propertystatus:         { label: "Property Status",         url: "/reports/property-status",            icon: FaListAlt   },
      propertiespercategory:  { label: "Properties per Category", url: "/reports/properties-per-category",    icon: FaLayerGroup},
      propertiesperitem:      { label: "Properties per Item",     url: "/reports/properties-per-item",        icon: FaFileAlt   },
      propertiesperpersonnel: { label: "Properties per Personnel",url: "/reports/properties-per-personnel",   icon: FaUsers     },
    },
  },
  adjustments: {
    label: "Adjustments",
    items: {
      adjustmentReports: { label: "Adjustment Reports", url: "/adjustment-reports" },
    },
  },
};