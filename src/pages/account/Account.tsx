import React, { useState } from "react";
import { FiUser, FiLock, FiClock } from "react-icons/fi"; // Import icons

type AccountProps = {
  onClose: () => void;
};

const Account: React.FC<AccountProps> = ({ onClose }) => {
  // Each tab has a label and an icon component
  const tabs = [
    { label: "Edit User Info", icon: <FiUser size={18} /> },
    { label: "Change Password", icon: <FiLock size={18} /> },
    { label: "User Logs", icon: <FiClock size={18} /> },
  ];

  const [currentTab, setCurrentTab] = useState("Edit User Info");

  const switchTab = (tab: string) => {
    setCurrentTab(tab);
    window.history.replaceState(
      null,
      "",
      `/account/${tab.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-[900px] max-w-[95%] h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 font-semibold text-lg border-b border-gray-200">
            Account Settings
          </div>
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => switchTab(tab.label)}
                className={`flex items-center gap-2 text-left px-6 py-3 transition-colors ${
                  currentTab === tab.label
                    ? "bg-white font-semibold border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{currentTab}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Edit User Info */}
            {currentTab === "Edit User Info" && (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="GC Evo"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    placeholder="USER-001"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Change Password */}
            {currentTab === "Change Password" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Update Password
                </button>
              </div>
            )}

            {/* User Logs */}
            {currentTab === "User Logs" && (
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">Your recent activities:</p>
                <ul className="space-y-1 max-h-[50vh] overflow-y-auto border border-gray-200 rounded-md p-2">
                  <li className="text-sm">Personal log contents here...</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
