import React, { useState, useRef } from "react";
import { FiUser, FiCamera, FiEye, FiEyeOff } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AddPersonnelProps = {
  onCancel: () => void;
  onAddPersonnel: (data: any) => void;
};

const AddPersonnel: React.FC<AddPersonnelProps> = ({ onCancel, onAddPersonnel }) => {
  const [form, setForm] = useState({
    personnelId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    personnelType: "plantilla",
    status: "active",
    designation: "",
    profilePicture: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setForm(prev => ({ ...prev, profilePicture: result }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onAddPersonnel(form);
  };

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form className="space-y-6 font-[Poppins]" onSubmit={handleSubmit}>
      {/* Profile Picture Section */}
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
          <label className={labelClass}>First Name:</label>
          <input
            name="firstName"
            type="text"
            placeholder="Juan"
            className={inputClass}
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Middle Name:</label>
          <input
            name="middleName"
            type="text"
            placeholder="M."
            className={inputClass}
            value={form.middleName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className={labelClass}>Last Name:</label>
          <input
            name="lastName"
            type="text"
            placeholder="Dela Cruz"
            className={inputClass}
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Personnel Type and Status - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Personnel Type:</label>
          <Select
            name="personnelType"
            value={form.personnelType}
            onValueChange={(value) => setForm({...form, personnelType: value})}
          >
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
          <label className={labelClass}>Status:</label>
          <Select
            name="status"
            value={form.status}
            onValueChange={(value) => setForm({...form, status: value})}
          >
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

      {/* Designation and Personnel ID - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Designation:</label>
          <input
            name="designation"
            type="text"
            placeholder="e.g., Administrative Officer II"
            className={inputClass}
            value={form.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Personnel ID:</label>
          <input
            name="personnelId"
            type="text"
            placeholder="e.g. PERS-001"
            className={inputClass}
            value={form.personnelId}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Password Fields - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Password:</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={`${inputClass} pr-10`}
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>
        <div>
          <label className={labelClass}>Confirm Password:</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className={`${inputClass} pr-10`}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-5 py-2 rounded-md text-white transition ${
            form.password === form.confirmPassword
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={form.password !== form.confirmPassword}
        >
          Save Personnel
        </button>
      </div>
    </form>
  );
};

export default AddPersonnel;