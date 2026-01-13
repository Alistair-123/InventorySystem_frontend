import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UseAuth";

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

  /* Auto-close profile menu when sidebar collapses */
  useEffect(() => {
    if (collapsed) setProfileOpen(false);
  }, [collapsed]);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleClick = () => {
    if (collapsed) {
      onExpandSidebar?.();
      return;
    }
    setProfileOpen((v) => !v);
  };
  return (
    <div className="relative border-t border-gray-200 px-3 py-2">
      {/* PROFILE BUTTON */}
      <button
        onClick={handleClick}
        className={`
    w-full flex items-center
    ${collapsed ? "justify-center" : "gap-3"}
    rounded-lg p-2
    transition-all duration-200
    hover:bg-gray-100
    active:scale-[0.98]
  `}
      >
        {/* AVATAR */}
        <div
          className={`
      flex-shrink-0
      rounded-full
      bg-gradient-to-br from-blue-600 to-blue-700
      text-white
      flex items-center justify-center
      font-semibold
      shadow-sm
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-10 h-10 text-sm" : "w-9 h-9 text-xs"}
    `}
        >
          {initials}
        </div>

        {!collapsed && (
          <div className="flex-1 text-left leading-tight">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        )}

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

      {/* PROFILE DROPDOWN */}
      <div
        className={`
    absolute bottom-16 left-3 right-3
    bg-white rounded-xl
    shadow-xl
    border border-gray-200
    p-4 space-y-4
    z-50
    transform transition-all duration-400 ease-in-out
    ${
      !collapsed && profileOpen
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 translate-y-2 scale-95 pointer-events-none"
    }
  `}
      >
        {/* USER INFO */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">{fullName}</div>

          <div className="text-xs text-gray-500">{user.personnelId}</div>

          <div className="text-xs text-gray-500">{user.designationName}</div>

          <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 w-fit">
            {user.role}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="border-t pt-3 space-y-1">
          <button className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Account
          </button>

          <button className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Logs
          </button>

          <button
            onClick={logout}
            className="w-full text-left text-sm px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
          >
            Log out
          </button>
        </div>
      </div>

      {/* OPTIONAL ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfileComponent;
