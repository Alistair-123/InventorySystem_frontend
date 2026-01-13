export interface ApiResponse<T> {
  success: boolean
  data: T
}
export type CategoryStatus = 'active' | 'inactive';

export interface CreateCategoryPayload {
    categoryId: string;
    categoryName: string;
    status: CategoryStatus;
};

export interface GetCategory {
  categoryId: string
  categoryName: string
  status: "active" | "inactive"
  createdAt: string
}
