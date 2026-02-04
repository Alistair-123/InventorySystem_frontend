/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import { FiUser, FiShield, FiLogOut } from "react-icons/fi";
import { resolveImageUrl } from "@/utils/image";
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
  const navigate = useNavigate();
  const location = useLocation();

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

  // Modal-like navigation: change URL but stay on same page
  const openModalRoute = (path: string) => {
    navigate(path, { state: { background: location } }); // mark current page as background
    setProfileOpen(false); // close dropdown
  };
  console.log("IMAGE FROM API:", user?.image);

  return (
    <div
      ref={containerRef}
      className="relative border-t border-gray-200 px-3 py-2"
    >
      {/* PROFILE BUTTON */}
      <button
        onClick={handleProfileClick}
        className={`
          w-full flex items-center rounded-lg px-2 py-2
          transition-all duration-200
          hover:bg-gray-100
          active:scale-95
          ${collapsed ? "justify-center" : "gap-2"}
        `}
      >

        {/* AVATAR */}
          <img
            src={resolveImageUrl(user?.image)}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />

        {/* NAME + ROLE */}
        <div
          className={`
            flex-1 min-w-0 leading-tight text-left
            transition-all duration-300
            ${collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[160px]"}
          `}
        >
          <div className="text-sm font-medium text-gray-900 truncate">
            {fullName}
          </div>
          <div className="text-xs text-gray-500 truncate">{user.role}</div>
        </div>

        {/* CHEVRON */}
        {!collapsed && (
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
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

      {/* DROPDOWN — modal style */}
      <div
        className={`
          absolute bottom-20 right-0 w-60
          bg-white rounded-md border border-gray-200
          shadow-lg z-50 text-sm
          transition-all duration-200
          ${profileOpen && !collapsed ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"}
        `}
      >
        {/* USER INFO */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">

            <img
              src={resolveImageUrl(user?.image)}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />


          </div>

          <div className="min-w-0 leading-tight text-left">
            <div className="font-medium text-gray-900 truncate text-sm">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              @{user.username ?? user.personnelId}
            </div>
            <div className="text-xs text-gray-400">{user.role}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-1" />

        {/* ACCOUNT & ADMIN — modal route buttons */}
        <div className="space-y-0.5 px-1">
          <button
            onClick={() => openModalRoute("/account")}
            className="w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 hover:bg-gray-100 active:scale-[0.97]"
          >
            <FiUser size={16} className="text-gray-500" />
            Account
          </button>

          <button
            onClick={() => openModalRoute("/admin")}
            className="w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 hover:bg-gray-100 active:scale-[0.97]"
          >
            <FiShield size={16} className="text-gray-500" />
            Admin
          </button>
        </div>

        <div className="border-t border-gray-200 my-1" />

        {/* LOGOUT */}
        <div className="px-1 py-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition-all duration-150 active:scale-[0.97]"
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
