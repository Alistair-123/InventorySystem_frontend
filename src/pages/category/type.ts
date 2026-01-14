export type CategoryStatus = 'active' | 'inactive';

export interface CreateCategoryPayload {
    categoryId: string;
    categoryName: string;
    status: CategoryStatus;
};
