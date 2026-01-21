import axiosInstance from "../../../utils/axiosInstance";
import type { ReferenceDataResponse } from "../types/types";

export const fetchReferenceData = async () => {
  const { data } = await axiosInstance.get<ReferenceDataResponse>(
    "/items/reference-data"
  );
  return data;
};
