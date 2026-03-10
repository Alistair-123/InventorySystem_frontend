export interface PropertyDepreciation {
  propertyNo: string
  itemName: string | null
  acquisitionDate: string
  acquisitionName: string | null
  acquisitionValue: number

  currentValue: number
  depreciated: number
  remainingLife: number
}

export interface PropertyResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  data: PropertyDepreciation[]
}