export type PersonnelRole = "admin" | "user";

export type PersonnelType = "plantilla" | "jobOrder";

export type PersonnelStatus = "active" | "inactive";

export interface PersonnelProfile {
  _id: string;

  personnelImage?: string;

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
