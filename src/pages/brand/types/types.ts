export type BrandStatus = "active" | "inactive"

export interface GetBrand {
    _id: string,
    brandId: string,
    brandName: string, 
    status: BrandStatus
}

export interface CreateBrand {
    brandId: string,
    brandName: string, 
    status: BrandStatus
}