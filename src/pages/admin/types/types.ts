export type PersonnelType = "plantilla" | "jobOrder";
export type PersonnelStatus = "active" | "inactive";
export type PersonnelRole = "admin" | "user";

export interface Personnel {
  _id: string;
  personnelImage?: string | null;
  personnelId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  personnelType: PersonnelType;
  designationName: string;
  status: PersonnelStatus;
  role: PersonnelRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload when creating personnel
 * (image is optional)
 */
export interface CreatePersonnelPayload {
  personnelImage?: File | null;
  personnelId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  personnelType: PersonnelType;
  designationName: string;
  status: PersonnelStatus;
  password: string;
  role?: PersonnelRole;
}

/**
 * Payload when updating personnel
 */
export interface UpdatePersonnelPayload {
  personnelImage?: File | null;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  personnelType?: PersonnelType;
  designationName?: string;
  status?: PersonnelStatus;
  role?: PersonnelRole;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
