import React, { useEffect, useRef, useState } from "react";
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          w-full flex items-center
          rounded-xl p-2
          transition-colors duration-200
          hover:bg-gray-100
          active:scale-[0.98]
          ${collapsed ? "justify-center" : "gap-3"}
        `}
      >
        {/* AVATAR */}
        <div
          className="
            w-10 h-10 flex-shrink-0
            rounded-full
            bg-gradient-to-br from-blue-600 to-blue-700
            text-white
            flex items-center justify-center
            font-semibold text-sm
            shadow-sm
          "
        >
          {initials}
        </div>

        {/* NAME + ROLE */}
        <div
          className={`
            flex-1 overflow-hidden text-left leading-tight
            transition-all duration-300 ease-out
            ${
              collapsed
                ? "opacity-0 translate-x-[-6px] max-w-0"
                : "opacity-100 translate-x-0 max-w-[180px] delay-200"
            }
          `}
        >
          <div className="text-sm font-semibold text-gray-900 truncate">
            {fullName}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {user.role}
          </div>
        </div>

        {/* CHEVRON */}
        <svg
          className={`
            w-4 h-4 text-gray-400
            transition-all duration-300 ease-out
            ${
              collapsed
                ? "opacity-0 translate-x-[-4px]"
                : "opacity-100 translate-x-0 delay-200"
            }
            ${profileOpen ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* PROFILE DROPDOWN */}
      <div
        className={`
          absolute bottom-16 left-3 right-3
          bg-white rounded-xl
          shadow-2xl
          border border-gray-200
          p-4 space-y-4
          z-50
          transition-all duration-300 ease-out
          ${
            !collapsed && profileOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* USER INFO */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {fullName}
          </div>
          <div className="text-xs text-gray-500">
            {user.personnelId}
          </div>
          <div className="text-xs text-gray-500">
            {user.designationName}
          </div>
          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            {user.role}
          </span>
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
    </div>
  );
};

export default ProfileComponent;
