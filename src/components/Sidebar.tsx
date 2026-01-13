import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarData } from "./Data";
import { masterdataConfig, transactionsConfig, reportsConfig } from "./sidebarData"; // <-- added reportsConfig

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

const baseNav =
  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isChildActive = (items: SidebarItem[]) =>
    items.some((item) => location.pathname === item.url);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    Object.entries(sidebarData).forEach(([key, section]) => {
      const items = Object.values(section.items) as SidebarItem[];
      next[key] = items.length > 1 && isChildActive(items);
    });
    setOpenSections(next);
  }, [location.pathname]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[key];
      if (collapsed) {
        setCollapsed(false);
        return { [key]: true };
      }
      if (isCurrentlyOpen) return {};
      return { [key]: true };
    });
  };

  return (
    <aside
      className={`relative h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-14" : "w-64"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* EDGE TOGGLE */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize hover:bg-blue-100/40"
      />

      {/* LOGO TOGGLE */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-20 flex items-center justify-center border-b border-gray-200 cursor-pointer group"
      >
        <img
          src={collapsed ? SmallLogo : DictLongLogo}
          className={`transition-all duration-300 ${collapsed ? "h-10" : "h-16"} group-hover:scale-105`}
        />
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {Object.entries(sidebarData).map(([key, section]) => {
          const items = Object.values(section.items) as SidebarItem[];
          const iconSrc = iconMap[section.label];
          const isAccordion = items.length > 1;
          const isOpen = openSections[key];

          /* SINGLE ITEM */
          if (!isAccordion) {
            const item = items[0];
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={({ isActive }) =>
                  `${baseNav} ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                  }`
                }
              >
                {iconSrc && <img src={iconSrc} className="w-5 h-5 opacity-80" />}
                {!collapsed && item.label}
              </NavLink>
            );
          }

          /* ACCORDION */
          return (
            <div key={key}>
              <button
                onClick={() => toggleSection(key)}
                className={`${baseNav} w-full justify-between ${
                  isOpen ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {iconSrc && <img src={iconSrc} className="w-5 h-5 opacity-80" />}
                  {!collapsed && section.label}
                </div>
                {!collapsed && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* CHILDREN */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 ml-6 border-l border-gray-200 pl-3 space-y-1">
                  {section.label === "Master Data"
                    ? Object.values(masterdataConfig).map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.url}
                            to={item.url}
                            end
                            className={({ isActive }) =>
                              `${baseNav} ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                              }`
                            }
                          >
                            {Icon && <Icon size={16} className="opacity-80 mr-2" />}
                            {!collapsed && item.label}
                          </NavLink>
                        );
                      })
                    : section.label === "Transactions"
                    ? Object.values(transactionsConfig).map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.url}
                            to={item.url}
                            end
                            className={({ isActive }) =>
                              `${baseNav} ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                              }`
                            }
                          >
                            {Icon && <Icon size={16} className="opacity-80 mr-2" />}
                            {!collapsed && item.label}
                          </NavLink>
                        );
                      })
                    : section.label === "Reports"
                    ? Object.values(reportsConfig).map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.url}
                            to={item.url}
                            end
                            className={({ isActive }) =>
                              `${baseNav} ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                              }`
                            }
                          >
                            {Icon && <Icon size={16} className="opacity-80 mr-2" />}
                            {!collapsed && item.label}
                          </NavLink>
                        );
                      })
                    : items.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            `${baseNav} ${
                              isActive
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                            }`
                          }
                        >
                          {!collapsed && item.label}
                        </NavLink>
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
