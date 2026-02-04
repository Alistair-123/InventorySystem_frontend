// api/personnel.ts
import axiosInstance from "@/utils/axiosInstance";
import type {
  Personnel,
  CreatePersonnelPayload,
  UpdatePersonnelPayload,
  ApiResponse
} from '../types/types';

/**
 * GET all personnel
 */
export const fetchPersonnel = async (): Promise<Personnel[]> => {
  const response = await axiosInstance.get<ApiResponse<Personnel[]>>(
    "/personnel/getpersonnel"
  );

  return response.data.data;
};

/**
 * CREATE personnel (with image)
 */
export const createPersonnel = async (
  payload: CreatePersonnelPayload
): Promise<Personnel> => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as Blob | string);
    }
  });

  const { data } = await axiosInstance.post(
    "/personnel/create",
    formData
  );

  return data;
};

/**
 * UPDATE personnel (optional image replace)
 */
export const updatePersonnel = async (
  id: string,
  payload: UpdatePersonnelPayload
): Promise<Personnel> => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as Blob | string);
    }
  });

  const { data } = await axiosInstance.put(
    `/personnel/updatepersonnel/${id}`,
    formData
  );

  return data;
};

/**
 * DELETE personnel
 */
export const deletePersonnel = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/personnel/deletepersonnel/${id}`);
};