import React, { useState } from "react";
import { FiUsers, FiUserPlus, FiClipboard } from "react-icons/fi";

type AdminProps = {
  onClose: () => void;
};

const Admin: React.FC<AdminProps> = ({ onClose }) => {
  // Tabs with icons
  const tabs = [
    { label: "Manage Users", icon: <FiUsers size={18} /> },
    { label: "Add Users", icon: <FiUserPlus size={18} /> },
    { label: "Account Logs", icon: <FiClipboard size={18} /> },
  ];

  const [currentTab, setCurrentTab] = useState("Manage Users");

  const switchTab = (tab: string) => {
    setCurrentTab(tab);
    window.history.replaceState(
      null,
      "",
      `/admin/${tab.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-[1000px] max-w-[95%] h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 font-semibold text-lg border-b border-gray-200">
            Admin Panel
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
            {/* Manage Users */}
            {currentTab === "Manage Users" && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Manage your users below. You can edit or delete existing users.
                </p>

                <div className="overflow-y-auto max-h-[55vh] border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: "GC Evo", userid: "ADMIN-001", role: "Admin" },
                        { name: "Evo GC", userid: "USER-002", role: "User" },
                        { name: "Sir Aljay", userid: "USER-003", role: "User" },
                      ].map((user) => (
                        <tr key={user.userid} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.userid}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                          <td className="px-4 py-3 text-right flex justify-end gap-2">
                            <button className="px-3 py-1 border border-green-300 text-green-700 rounded-md text-xs font-medium hover:bg-green-700 hover:text-white transition">
                              Edit
                            </button>
                            <button className="px-3 py-1 border border-red-300 text-red-700 rounded-md text-xs font-medium hover:bg-red-700 hover:text-white transition">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Users */}
            {currentTab === "Add Users" && (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="GC Evo Unifast"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    placeholder="ADMIN-001"
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Add User
                  </button>
                </div>
              </form>
            )}

            {/* Account Logs */}
            {currentTab === "Account Logs" && (
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  Recent activities of all users:
                </p>
                <ul className="space-y-1 max-h-[55vh] overflow-y-auto border border-gray-200 rounded-md p-2">
                  <li className="text-sm">All user log contents here...</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
