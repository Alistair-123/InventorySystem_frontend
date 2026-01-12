import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sidebarData } from "./Data";

import DictLongLogo from "../assets/DictLongLogo.png";
import SmallLogo from "../assets/logos.png";

import DashboardIcon from "../assets/icons/icons_dashboard.svg";
import MasterDataIcon from "../assets/icons/icons_masterdata.svg";
import TransactionsIcon from "../assets/icons/icons_inventorymanagement.svg";
import AdjustmentsIcon from "../assets/icons/icons_adjust.svg";
import ReportsIcon from "../assets/icons/icons_reports.svg";

type SidebarItem = {
  label: string;
  url: string;
};

const iconMap: Record<string, string> = {
  Dashboard: DashboardIcon,
  "Master Data": MasterDataIcon,
  Transactions: TransactionsIcon,
  Adjustments: AdjustmentsIcon,
  Reports: ReportsIcon,
};

function Sidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside
      className={`relative h-screen bg-white border-r border-gray-200 flex flex-col
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-14" : "w-64"}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* EDGE TOGGLE ZONE */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize
        hover:bg-blue-100/40 transition"
        title="Toggle sidebar"
      />

      {/* HEADER / LOGO (CLICK TO TOGGLE) */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-20 flex items-center justify-center border-b border-gray-200
        cursor-pointer select-none group"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <img
          src={collapsed ? SmallLogo : DictLongLogo}
          alt="DICT Logo"
          className={`transition-all duration-300
          ${collapsed ? "h-10" : "h-16"}
          group-hover:scale-105`}
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {Object.entries(sidebarData).map(([key, section]) => {
          const items = Object.values(section.items) as SidebarItem[];
          const isAccordion = items.length > 1;
          const isOpen = openSections[key];
          const iconSrc = iconMap[section.label];

          /* SINGLE ITEM */
          if (!isAccordion) {
            const item = items[0];
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                   transition-all duration-200 ease-out
                   ${
                     isActive
                       ? "bg-gray-100 text-gray-900 border-l-4 border-blue-600"
                       : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                   }`
                }
              >
                {iconSrc && (
                  <img src={iconSrc} className="w-5 h-5 opacity-80" />
                )}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          }

          /* ACCORDION SECTION */
          return (
            <div key={key}>
              <button
                onClick={() => toggleSection(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md
                text-sm font-semibold transition-all duration-200
                ${
                  isOpen
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {iconSrc && (
                    <img src={iconSrc} className="w-5 h-5 opacity-80" />
                  )}
                  {!collapsed && <span>{section.label}</span>}
                </div>

                {!collapsed && (
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300
                    ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* SMOOTH ACCORDION */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
                ${!collapsed && isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <ul className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-3">
                  {items.map((item) => (
                    <li key={item.url}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm
                           transition-all duration-200 ease-out
                           ${
                             isActive
                               ? "bg-blue-50 text-blue-700 font-medium"
                               : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                           }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
