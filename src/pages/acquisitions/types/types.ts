export type AcquisitionStatus = "active" | "inactive"

export interface GetAcquisition {
    _id: string,
   acquisitionTypeId: string,
   acquisitionTypeName: string, 
    status: AcquisitionStatus
}

export interface CreateAcquisition {
   acquisitionTypeId: string,
   acquisitionTypeName: string, 
    status: AcquisitionStatus
}