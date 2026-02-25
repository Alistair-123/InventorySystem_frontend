import api from "@/utils/axiosInstance";
import type { PersonnelProfile, UpdatePasswordPayload } from "./Personnel";
// ProfileService.ts

export const fetchMyProfile = async (): Promise<PersonnelProfile> => {
  const res = await api.get("/profileroute/me");
  return res.data;
};

export const updateMyProfile = async (
  payload: Partial<PersonnelProfile>
): Promise<PersonnelProfile> => {
  const res = await api.put("/profileroute/me", payload);
  return res.data.updatedProfile;
};

export const updateMyPassword = async (
  payload: UpdatePasswordPayload
): Promise<{ message: string }> => {
  const res = await api.put("/profileroute/me/password", payload);
  return res.data;
};

export const updateProfileImage = async (file: File): Promise<PersonnelProfile> => {
  const formData = new FormData();
  formData.append("personnelImage", file);
  const res = await api.put("/profileroute/me/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.updated;
};

export const deleteMyAccount = async (): Promise<{ message: string }> => {
  const res = await api.delete("/profileroute/me");
  return res.data;
};