export type CategoryStatus = 'active' | 'inactive';

export interface Category {
    categoryId: string;
    categoryName: string;
    status: CategoryStatus;
};
