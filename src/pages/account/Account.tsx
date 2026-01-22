import React, { useState, useRef } from "react";
import { FiUser, FiLock, FiClock, FiCamera } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AccountProps = {
  onClose: () => void;
};

type View = "info" | "password" | "logs";

const Account: React.FC<AccountProps> = ({ onClose }) => {
  const [view, setView] = useState<View>("info");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
        <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
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
            <form className="space-y-6">
              {/* Profile Picture Section - Full Width */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div 
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewUrl('')}
                      />
                    ) : (
                      <div className="text-gray-400">
                        <FiUser className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:scale-110"
                    title="Change profile picture"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 5MB</p>
                </div>
              </div>

              {/* Name Fields - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name:
                  </label>
                  <input
                    type="text"
                    placeholder="M."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Dela Cruz"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Personnel Type and Status - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personnel Type:
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plantilla">Plantilla</SelectItem>
                      <SelectItem value="job-order">Job Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status:
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2 inline-block" />
                        Active
                      </SelectItem>
                      <SelectItem value="resigned">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2 inline-block" />
                        Resigned
                      </SelectItem>
                      <SelectItem value="retired">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2 inline-block" />
                        Retired
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Designation and User ID - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Administrative Officer II"
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
                  />
                </div>
              </div>

              {/* Save Button */}
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

              {/* MOCK DATA */}
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