/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import { FiUsers, FiUserPlus, FiClipboard } from "react-icons/fi";
import AddPersonnel from "./AddPersonnel";

type ManageUsersProps = {
  onClose: () => void;
};

type View = "manage" | "add" | "logs";

const ManageUsers: React.FC<ManageUsersProps> = ({ onClose }) => {
  const [view, setView] = useState<View>("manage");

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
      className={`flex items-center gap-3 px-6 py-3 text-sm transition-all
        ${
          active
            ? "bg-white font-semibold border-r-4 border-blue-600 text-gray-900"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Poppins]">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-[1000px] max-w-[95%] h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
          <div className="p-6 font-semibold text-lg border-b">
            Admin Panel
          </div>

          <SidebarButton
            active={view === "manage"}
            icon={<FiUsers size={18} />}
            label="Manage Personnel"
            onClick={() => setView("manage")}
          />

          <SidebarButton
            active={view === "add"}
            icon={<FiUserPlus size={18} />}
            label="Add Personnel"
            onClick={() => setView("add")}
          />

          <SidebarButton
            active={view === "logs"}
            icon={<FiClipboard size={18} />}
            label="Account Logs"
            onClick={() => setView("logs")}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {view === "manage" && "Manage Personnel"}
              {view === "add" && "Add Personnel"}
              {view === "logs" && "Account Logs"}
            </h2>

            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>

          {/* MANAGE USERS — UNTOUCHED LOGIC, BETTER UI */}
          {view === "manage" && (
            <div>
              <p className="text-sm text-gray-600">
                Manage your personnels below. You can edit or delete existing personnels.
              </p>

              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">User ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: "GC Evo", userid: "ADMIN-001", role: "Admin" },
                      { name: "Evo GC", userid: "USER-002", role: "User" },
                    ].map((user) => (
                      <tr key={user.userid} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.userid}</td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button className="px-3 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-600 hover:text-white transition">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-600 hover:text-white transition">
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

          {/* ADD PERSONNEL */}
          {view === "add" && (
            <div>
              <AddPersonnel onCancel={() => setView("manage")} />
            </div>
          )}

          {/* LOGS */}
          {view === "logs" && (
            <div>
              Logs content here…
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
