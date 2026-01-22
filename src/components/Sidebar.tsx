import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarData } from "./Data";
import {
  masterdataConfig,
  transactionsConfig,
  reportsConfig,
} from "./sidebarData";

import DictLongLogo from "../assets/DictLongLogo.png";
import SmallLogo from "../assets/logos.png";

import DashboardIcon from "../assets/icons/icons_dashboard.svg";
import MasterDataIcon from "../assets/icons/icons_masterdata.svg";
import TransactionsIcon from "../assets/icons/icons_inventorymanagement.svg";
import AdjustmentsIcon from "../assets/icons/icons_adjust.svg";
import ReportsIcon from "../assets/icons/icons_reports.svg";
import ProfileComponent from "./ProfileComponent";

type SidebarItem = {
  label: string;
  url: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
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
  const [logoVisible, setLogoVisible] = useState(false);

  /* LOGO FADE-IN */
  useEffect(() => {
    const t = setTimeout(() => setLogoVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const getSectionChildren = (sectionLabel: string): SidebarItem[] => {
    if (sectionLabel === "Master Data") return Object.values(masterdataConfig);
    if (sectionLabel === "Transactions")
      return Object.values(transactionsConfig);
    if (sectionLabel === "Reports") return Object.values(reportsConfig);
    return [];
  };

  const isChildActive = (items: SidebarItem[]) =>
    items.some((item) => location.pathname === item.url);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    Object.entries(sidebarData).forEach(([key, section]) => {
      const children = getSectionChildren(section.label);
      next[key] = children.length > 0 && isChildActive(children);
    });
    setOpenSections(next);
  }, [location.pathname]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      if (collapsed) {
        setCollapsed(false);
        return { [key]: true };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <aside
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out
      ${collapsed ? "w-14" : "w-64"}
      bg-gray-100 border-r border-gray-300`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* EDGE TOGGLE */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize hover:bg-blue-200/40"
      />

      {/* LOGO */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-20 flex items-center justify-center border-b border-gray-300 cursor-pointer group"
      >
        <img
          src={collapsed ? SmallLogo : DictLongLogo}
          className={`
            transition-all duration-500 ease-out
            ${collapsed ? "h-10" : "h-16"}
            ${logoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            group-hover:scale-105
            drop-shadow-sm
          `}
        />
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {Object.entries(sidebarData).map(([key, section]) => {
          const children = getSectionChildren(section.label);
          const iconSrc = iconMap[section.label];
          const isAccordion = children.length > 0;
          const isOpen = openSections[key];

          /* SINGLE ITEM */
          if (!isAccordion) {
            const item = Object.values(section.items)[0] as SidebarItem;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={({ isActive }) =>
                  `${baseNav} ${
                    isActive
                      ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
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
                  isOpen
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {iconSrc && (
                    <img src={iconSrc} className="w-5 h-5 opacity-80" />
                  )}
                  {!collapsed && section.label}
                </div>

                {!collapsed && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* CHILDREN WITH ICONS RESTORED */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 ml-6 border-l border-gray-300 pl-3 space-y-1">
                  {children.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.url}
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `${baseNav} ${
                            isActive
                              ? "bg-blue-100 text-blue-800 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                          }`
                        }
                      >
                        {Icon && !collapsed && (
                          <Icon size={16} className="opacity-80 mr-2" />
                        )}
                        {!collapsed && item.label}
                      </NavLink>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      <ProfileComponent
        collapsed={collapsed}
        onExpandSidebar={() => setCollapsed(false)}
      />
    </aside>
  );
}

export default Sidebar;
