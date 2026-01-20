export type AcquisitionStatus = "active" | "inactive"

export interface GetAcquisition {
    _id: string,
   acquisitionTypeId: string,
   acquisitionTypeName: string, 
    status: AcquisitionStatus
}

export interface CreateAcquisition {
   acquisitionTypeName: string, 
    status: AcquisitionStatus
}