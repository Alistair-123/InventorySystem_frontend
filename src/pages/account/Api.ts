import api from "@/utils/axiosInstance";
import type { PersonnelProfile } from "./Personnel";

/* ================================
   ✅ GET MY PROFILE
================================ */
export const fetchMyProfile = async (): Promise<PersonnelProfile> => {
  const res = await api.get("/profile/me");
  return res.data;
};

/* ================================
   ✅ UPDATE MY PROFILE
================================ */
export const updateMyProfile = async (
  payload: Partial<PersonnelProfile>
): Promise<PersonnelProfile> => {
  const res = await api.put("/profile/me", payload);
  return res.data.updatedProfile;
};

/* ================================
   ✅ UPDATE PASSWORD
================================ */
export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const updateMyPassword = async (
  payload: UpdatePasswordPayload
): Promise<{ message: string }> => {
  const res = await api.put("/profile/me/password", payload);
  return res.data;
};

/* ================================
   ✅ UPDATE PROFILE IMAGE
================================ */
export const updateProfileImage = async (
  file: File
): Promise<PersonnelProfile> => {
  const formData = new FormData();
  formData.append("personnelImage", file);

  const res = await api.put("/profile/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.updated;
};

/* ================================
   ✅ DELETE ACCOUNT
================================ */
export const deleteMyAccount = async (): Promise<{ message: string }> => {
  const res = await api.delete("/profile/me");
  return res.data;
};
