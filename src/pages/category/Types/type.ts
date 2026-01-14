// Types/type.ts

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export type CategoryStatus = "active" | "inactive"

export interface CreateCategory {
  categoryId: string
  categoryName: string
  status: CategoryStatus
}

export interface UpdateCategoryPayload {
  categoryName?: string
  status?: CategoryStatus
}

export interface GetCategory {
  _id: string
  categoryId: string
  categoryName: string
  status: CategoryStatus
  createdAt: string
}
