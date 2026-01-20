/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import { FiUser, FiLock, FiClock } from "react-icons/fi";

type AccountProps = {
  onClose: () => void;
};

type View = "info" | "password" | "logs";

const Account: React.FC<AccountProps> = ({ onClose }) => {
  const [view, setView] = useState<View>("info");

  const SidebarButton = ({
    active,
    icon,
    label,
    onClick,
  }: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 text-sm transition
        ${
          active
            ? "bg-white font-semibold border-r-4 border-blue-600 text-gray-900"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Poppins]">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-[900px] max-w-[95%] h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 font-semibold text-lg border-b border-gray-200">
            Account Settings
          </div>

          <SidebarButton
            active={view === "info"}
            icon={<FiUser size={18} />}
            label="Edit User Info"
            onClick={() => setView("info")}
          />

          <SidebarButton
            active={view === "password"}
            icon={<FiLock size={18} />}
            label="Change Password"
            onClick={() => setView("password")}
          />

          <SidebarButton
            active={view === "logs"}
            icon={<FiClock size={18} />}
            label="User Logs"
            onClick={() => setView("logs")}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {view === "info" && "Edit User Info"}
              {view === "password" && "Change Password"}
              {view === "logs" && "User Logs"}
            </h2>

            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* EDIT USER INFO */}
          {view === "info" && (
            <form className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID:
                </label>
                <input
                  type="text"
                  placeholder="USER-001"
                  className={inputClass}
                  disabled
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* CHANGE PASSWORD */}
          {view === "password" && (
            <form className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password:
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password:
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* USER LOGS */}
          {view === "logs" && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm text-gray-600">
                Your recent account activities:
              </p>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ul className="divide-y text-sm">
                  <li className="px-4 py-3 hover:bg-gray-50">
                    Logged in — Jan 20, 2026 · 10:32 AM
                  </li>
                  <li className="px-4 py-3 hover:bg-gray-50">
                    Changed password — Jan 18, 2026 · 4:12 PM
                  </li>
                  <li className="px-4 py-3 hover:bg-gray-50">
                    Updated profile — Jan 15, 2026 · 9:40 AM
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
