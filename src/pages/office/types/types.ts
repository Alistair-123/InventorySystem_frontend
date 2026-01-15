export type OfficeStatus = "active" | "inactive"

export interface GetOffice {
    _id: string,
    officeId: string,
    officeName: string, 
    status: OfficeStatus
}

export interface CreateOffice {
    officeId: string,
    officeName: string, 
    status: OfficeStatus
}