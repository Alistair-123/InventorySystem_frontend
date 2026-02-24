import React, { useState, useRef, useContext, useEffect } from "react";
import { FiUser, FiLock, FiCamera, FiX, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AuthContext } from '@/context/auth/authContext'; // adjust path
import {
  updateMyProfile,
  updateMyPassword,
  updateProfileImage,
} from "./Api"; // adjust path
import { resolveImageUrl } from '@/utils/image'; // adjust path
type AccountProps = {
  onClose: () => void;
};

type View = "info" | "password";

const Account: React.FC<AccountProps> = ({ onClose }) => {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [view, setView] = useState<View>("info");
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [flash, setFlash] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [previewUrl, setPreviewUrl] = useState(resolveImageUrl(user?.image));

  // Editable info
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [middleName, setMiddleName] = useState(user?.middleName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sync if user loads late (e.g. context hydrates after mount)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setMiddleName(user.middleName ?? "");
      setLastName(user.lastName);
     setPreviewUrl(resolveImageUrl(user.image));
    }
  }, [user]);

  const showFlash = (msg: string, type: "success" | "error" = "success") => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 3500);
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showFlash("First and last name are required.", "error");
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile({ firstName, middleName, lastName });
      // Mutate the context user object so the rest of the app reflects the change
      if (auth?.user) {
        auth.user.firstName = firstName;
        auth.user.middleName = middleName;
        auth.user.lastName = lastName;
      }
      showFlash("Profile updated successfully.");
    } catch {
      showFlash("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showFlash("Image must be under 5MB.", "error");
      return;
    }
    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      const updated = await updateProfileImage(file);
     if (updated.personnelImage) {
      const fullUrl = resolveImageUrl(updated.personnelImage);
      setPreviewUrl(fullUrl);
      if (auth?.user) auth.user.image = updated.personnelImage; // ✅ use .image
    }
      showFlash("Profile photo updated.");
    } catch {
      showFlash("Failed to upload image.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showFlash("All password fields are required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showFlash("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      showFlash("New password must be at least 8 characters.", "error");
      return;
    }
    setSaving(true);
    try {
      await updateMyPassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showFlash("Password changed successfully.");
    } catch {
      showFlash("Incorrect current password or server error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () =>
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

  const SidebarBtn = ({ id, icon, label }: { id: View; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm rounded-lg transition ${
        view === id
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className={view === id ? "text-blue-500" : "text-gray-400"}>{icon}</span>
      {label}
    </button>
  );

  const PasswordField = ({
    label,
    value,
    onChange,
    show,
    onToggle,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={`${inputClass} pr-10`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );

  // Password strength calculation (0–4)
  const passwordStrength = (pw: string) =>
    Math.min(
      Math.floor(pw.length / 3) +
        (/[A-Z]/.test(pw) ? 1 : 0) +
        (/[0-9]/.test(pw) ? 1 : 0) +
        (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0),
      4
    );

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-[Poppins]">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-[860px] max-w-[95%] h-[82vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-52 bg-gray-50 border-r border-gray-100 flex flex-col py-6 px-3 shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">
            Settings
          </p>
          <div className="flex flex-col gap-1">
            <SidebarBtn id="info" icon={<FiUser size={15} />} label="Profile Info" />
            <SidebarBtn id="password" icon={<FiLock size={15} />} label="Change Password" />
          </div>

          {/* User badge at bottom */}
          {user && (
            <div className="mt-auto px-1">
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img src={resolveImageUrl(user.image)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-semibold text-gray-800">
              {view === "info" ? "Profile Information" : "Change Password"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX size={17} />
            </button>
          </div>

          {/* Flash */}
          {flash && (
            <div
              className={`mx-8 mt-4 px-4 py-2.5 rounded-lg text-sm font-medium border ${
                flash.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {flash.msg}
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* ── INFO VIEW ── */}
            {view === "info" && (
              <div className="flex gap-10">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-blue-50 border-2 border-gray-200 flex items-center justify-center overflow-hidden text-2xl font-bold text-blue-400">
                      {previewUrl ? (
                        <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials()
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-full flex items-center justify-center shadow transition"
                    >
                      {imageUploading ? (
                        <ImSpinner8 size={12} className="animate-spin" />
                      ) : (
                        <FiCamera size={13} />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    Click to change photo
                    <br />
                    Max 5MB
                  </p>
                </div>

                {/* Fields */}
                <div className="flex-1 flex flex-col gap-5">
                  {/* Read-only */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Personnel ID", value: user?.personnelId },
                      { label: "Designation", value: user?.designationName },
                      { label: "Role", value: user?.role },
                      { label: "Type", value: user?.personnelType },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                        <input
                          className={`${inputClass} cursor-not-allowed capitalize`}
                          value={value ?? "—"}
                          readOnly
                          tabIndex={-1}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Editable name */}
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Edit Name
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          First Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={inputClass}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Middle Name
                        </label>
                        <input
                          className={inputClass}
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          placeholder="Middle name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Last Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={inputClass}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
                    >
                      {saving ? <ImSpinner8 size={13} className="animate-spin" /> : <FiSave size={13} />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PASSWORD VIEW ── */}
            {view === "password" && (
              <div className="max-w-md flex flex-col gap-5">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Use a strong password with at least{" "}
                  <span className="font-medium text-gray-700">8 characters</span>.
                </p>

                <PasswordField
                  label="Current Password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  show={showOld}
                  onToggle={() => setShowOld((v) => !v)}
                />
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                />

                {/* Strength bar */}
                {newPassword && (
                  <div className="flex gap-1.5 items-center -mt-2">
                    {[1, 2, 3, 4].map((i) => {
                      const s = passwordStrength(newPassword);
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= s ? strengthColor[s - 1] : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                    <span className="text-[11px] text-gray-400 ml-1 w-10">
                      {strengthLabel[passwordStrength(newPassword) - 1] ?? ""}
                    </span>
                  </div>
                )}

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
                  >
                    {saving ? <ImSpinner8 size={13} className="animate-spin" /> : <FiLock size={13} />}
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;