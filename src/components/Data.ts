// sidebarData.ts
export const sidebarData = {
  dashboard: {
    label: "Dashboard",
    items: {
      dashboard: {
        label: "Dashboard",
        url: "/dashboard",
      },
    },
  },

  masterdata: {
    label: "Master Data",
    items: {
      category: { label: "Categories", url: "/categories" },
      brand: { label: "Brands", url: "/brands" },
      unit: { label: "Units", url: "/units" },
      office: { label: "Offices", url: "/offices" },
      acquisitionType: {
        label: "Acquisition Types",
        url: "/acquisitions",
      },
    },
  },

  transactions: {
    label: "Transactions",
    items: {
      items: { label: "Items", url: "/items" },
      properties: { label: "Properties", url: "/properties" },
    },
  },

  adjustments: {
    label: "Adjustments",
    items: {
      adjustmentsRecords: {
        label: "Adjustment Records",
        url: "/adjustment-records",
      },
    },
  },

  reports: {
    label: "Reports",
    items: {
      inventory: {
        label: "Inventory Summary",
        url: "/reports/inventory-summary",
      },
      propertystatus: {
        label: "Property Status",
        url: "/reports/property-status",
      },
      propertiespercategory: {
        label: "Properties per Category",
        url: "/reports/properties-per-category",
      },
      propertiesperitem: {
        label: "Properties per Item",
        url: "/reports/properties-per-item",
      },
      propertiesperpersonnel: {
        label: "Properties per Personnel",
        url: "/reports/properties-per-personnel",
      },
    },
  },
};
