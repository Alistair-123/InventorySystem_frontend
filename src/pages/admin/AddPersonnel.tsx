/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiUser, FiCamera, FiEye, FiEyeOff } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createPersonnel } from "./api/fetchData";
import { toast } from "react-toastify";
import type { CreatePersonnelPayload } from "./types/types";


export type AddPersonnelProps = {
  onCancel: () => void;
  onAddPersonnel: (data: any) => void;
};

type FormValues = {
  personnelId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  personnelType: "plantilla" | "jobOrder";
  status: "active" | "inactive";
  designationName: string;
  role: "admin" | "user";
  password: string;
  confirmPassword: string;
  personnelImage?: File | null;
};

const AddPersonnel: React.FC<AddPersonnelProps> = ({
  onCancel,
  onAddPersonnel,
}) => {

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      personnelType: "plantilla",
      status: "active",
      role: "user",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const personnelId = watch("personnelId");
  const designationName = watch("designationName");

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setValue("personnelImage", file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);

    const toastId = toast.loading("Creating personnel...");

    try {
      const { confirmPassword, ...payload } = data;

      const response = await createPersonnel(payload as CreatePersonnelPayload);

      toast.update(toastId, {
        render: "Personnel created successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Pass the personnel data from the response
      onAddPersonnel(response.personnel || response);
    } catch (error: any) {
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message;

      // Handle specific error cases
      if (status === 409) {
        // Duplicate Personnel ID
        toast.update(toastId, {
          render: errorMessage || "Personnel ID already exists",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
        setError("personnelId", {
          type: "manual",
          message: "This Personnel ID is already taken",
        });
      } else if (status === 400) {
        // Validation error
        toast.update(toastId, {
          render: errorMessage || "Invalid input data",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } else {
        // Generic error
        toast.update(toastId, {
          render: errorMessage || "Failed to create personnel. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;
  const hasPasswordMismatch = confirmPassword && !passwordsMatch;

  // Check if all required fields are filled
  const isFormValid = 
    firstName &&
    lastName &&
    personnelId &&
    designationName &&
    password &&
    password.length >= 8 &&
    confirmPassword &&
    passwordsMatch;

  const inputClass =
    "w-full px-4 py-2 rounded-md border focus:border-black bg-white text-sm focus:outline-none focus:ring-3 border-1 focus:ring-gray-300 transition";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form
      className="space-y-6 font-[Poppins]"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Profile Picture */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <button
            type="button"
            className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiCamera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("firstName", { required: true })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Middle Name</label>
          <input {...register("middleName")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("lastName", { required: true })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <Label className={labelClass}>Personnel Type</Label>
          <Controller
            name="personnelType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plantilla">Plantilla</SelectItem>
                  <SelectItem value="jobOrder">Job Order</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label className={labelClass}>Personnel Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Designation & ID */}
      <div className="flex flex-col">
        <Label className={labelClass}>
          Designation <span className="text-red-500">*</span>
        </Label>
        <input
          {...register("designationName", { required: true })}
          placeholder="Designation"
          className={inputClass}
        />
      </div>

      <span className=" flex w-full border-b"> Create Personnel Account</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={labelClass}>
            Personnel ID <span className="text-red-500">*</span>
          </Label>
          <input
            {...register("personnelId", { required: true })}
            placeholder="Personnel ID"
            className={`${inputClass} ${
              errors.personnelId ? "border-red-500 focus:border-red-500 focus:ring-red-300" : ""
            }`}
          />
          {errors.personnelId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.personnelId.message}
            </p>
          )}
        </div>

        <div>
          <Label className={labelClass}>Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={labelClass}>
            Create Password <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true, minLength: 8 })}
              placeholder="Password"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        <div>
          <Label className={labelClass}>
            Confirm Password <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (value) => value === password,
              })}
              placeholder="Confirm Password"
              className={`${inputClass} pr-10 ${
                hasPasswordMismatch ? "border-red-500 focus:border-red-500 focus:ring-red-300" : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>
          {hasPasswordMismatch && (
            <p className="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="px-5 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Personnel"}
        </button>

      </div>
    </form>
  );
};

export default AddPersonnel;