import React, { useState } from "react";

export type AddPersonnelProps = {
  onCancel: () => void;
};

const AddPersonnel: React.FC<AddPersonnelProps> = ({ onCancel }) => {
  const [form, setForm] = useState({
    personnelId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    personnelType: "Plantilla",
    status: "Active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <form className="space-y-6 font-[Poppins]">
      <div className="grid grid-cols-2 gap-4">
        {/* Personnel ID */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Personnel ID:</label>
          <input
            name="personnelId"
            placeholder="e.g. PERS-001"
            className={inputClass}
            onChange={handleChange}
          />
        </div>

        {/* First Name */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>First Name:</label>
          <input
            name="firstName"
            placeholder="First Name"
            className={inputClass}
            onChange={handleChange}
          />
        </div>

        {/* Middle Name */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Middle Name:</label>
          <input
            name="middleName"
            placeholder="Middle Name"
            className={inputClass}
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Last Name:</label>
          <input
            name="lastName"
            placeholder="Last Name"
            className={inputClass}
            onChange={handleChange}
          />
        </div>

        {/* Personnel Type */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Personnel Type:</label>
          <select
            name="personnelType"
            className={inputClass}
            onChange={handleChange}
          >
            <option>Plantilla</option>
            <option>Job Order</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Status:</label>
          <select
            name="status"
            className={inputClass}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Resigned</option>
            <option>Retired</option>
          </select>
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
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save Personnel
        </button>
      </div>
    </form>
  );
};

export default AddPersonnel;
