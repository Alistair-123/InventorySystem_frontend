export type UnitStatus = "active" | "inactive"

export interface GetUnit {
    _id: string,
    unitId: string,
    unitName: string, 
    status: UnitStatus
}

export interface CreateUnit {
    unitId: string,
    unitName: string, 
    status: UnitStatus
}