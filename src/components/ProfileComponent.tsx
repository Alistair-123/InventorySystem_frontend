import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/UseAuth";
import { FiUser, FiShield, FiLogOut } from "react-icons/fi";

type ProfileComponentProps = {
  collapsed: boolean;
  onExpandSidebar?: () => void;
};

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  collapsed,
  onExpandSidebar,
}) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close dropdown when sidebar collapses */
  useEffect(() => {
    if (collapsed) setProfileOpen(false);
  }, [collapsed]);

  /* Close dropdown on click outside */
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleProfileClick = () => {
    if (collapsed) {
      onExpandSidebar?.();
      return;
    }
    setProfileOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="relative border-t border-gray-200 px-3 py-2"
    >
      {/* PROFILE BUTTON */}
      <button
        onClick={handleProfileClick}
        className={`
          w-full flex items-center rounded-lg p-2
          hover:bg-gray-100 transition
          ${collapsed ? "justify-center" : "gap-2"}
        `}
      >
        {/* AVATAR */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>

        {/* NAME + ROLE (LEFT-ALIGNED FIX) */}
        <div
          className={`
            flex-1 min-w-0 leading-tight text-left
            transition-all duration-300
            ${
              collapsed
                ? "opacity-0 max-w-0"
                : "opacity-100 max-w-[160px]"
            }
          `}
        >
          <div className="text-sm font-medium text-gray-900 truncate">
            {fullName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {user.role}
          </div>
        </div>

        {/* CHEVRON */}
        {!collapsed && (
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* DROPDOWN */}
      <div
        className={`
          absolute bottom-20 left-3 right-3
          bg-white rounded-md border border-gray-200
          shadow-md z-50 text-sm
          transition-all duration-200
          ${
            profileOpen && !collapsed
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-1 pointer-events-none"
          }
        `}
      >
        {/* USER INFO */}
        <div className="flex items-center gap-2 p-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>

          <div className="min-w-0 leading-tight text-left">
            <div className="font-medium text-gray-900 truncate">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              @{user.username ?? user.personnelId}
            </div>
            <div className="text-xs text-gray-400">
              {user.role}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* ACTIONS */}
        <div className="p-1 space-y-0.5">
          <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
            <FiUser size={16} className="text-gray-500" />
            Account
          </button>

          <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
            <FiShield size={16} className="text-gray-500" />
            Admin
          </button>
        </div>

        <div className="border-t border-gray-200" />

        {/* LOGOUT */}
        <div className="p-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
