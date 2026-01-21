export type MongoId = string;

export interface CategoryRef {
  _id: MongoId;
  categoryName: string;
}

export interface BrandRef {
  _id: MongoId;
  brandName: string;
}

export interface UnitRef {
  _id: MongoId;
  unitName: string;
}

export interface ReferenceDataResponse {
  categories: CategoryRef[];
  brands: BrandRef[];
  units: UnitRef[];
}

export interface CreateItemPayload {
  itemName: string;
  itemDescription?: string;
  category: MongoId;
  brand: MongoId;
  unit: MongoId;
}


export interface Item {
  _id: MongoId;
  itemId: string;
  itemName: string;
  itemDescription?: string;

  category: CategoryRef;
  brand: BrandRef;
  unit: UnitRef;

  createdAt: string;
  updatedAt: string;
}
