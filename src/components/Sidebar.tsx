import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sidebarData } from "./Data";
import logos from "../assets/logos.png";
import DictLongLogo from "../assets/DictLongLogo.png";

type SidebarItem = {
  label: string;
  url: string;
};

function Sidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside className="w-[256px] bg-gray-50 border h-screen p-4 space-y-2 overflow-y-auto">
      <img src={DictLongLogo} alt="Logo" className="w-40 mb-6 mx-auto" />

      {Object.entries(sidebarData).map(([key, section]) => {
        const items = Object.values(section.items) as SidebarItem[];
        const isAccordion = items.length > 1;
        const isOpen = openSections[key];

        // 🔹 SINGLE ITEM → DIRECT LINK
        if (!isAccordion) {
          const item = items[0];
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className="block px-3 py-2 rounded font-medium hover:bg-gray-200"
            >
              {item.label}
            </NavLink>
          );
        }

        // 🔹 MULTIPLE ITEMS → ACCORDION
        return (
          <div key={key} className="">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-3 py-2 font-semibold rounded hover:bg-gray-100"
            >
              <span>{section.label}</span>
              <span className="text-sm">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <ul className="mt-1 space-y-1 pl-4">
                {items.map((item) => (
                  <li key={item.url}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded text-sm ${
                          isActive
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "hover:bg-gray-200"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;
