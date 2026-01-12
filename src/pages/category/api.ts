import axiosInstance from "@/utils/axiosInstance";
import type { Category } from './type';

export async function createcategory(): Promise<Category[]> {
  const {data} = await axiosInstance.get<Category[]>("/category/createcategory");
  return data
}