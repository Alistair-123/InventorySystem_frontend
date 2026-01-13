import { useQuery } from "@tanstack/react-query"
import { getCategories } from './api'
import type { GetCategory } from "./type"
export function useCategories() {
  return useQuery<GetCategory[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  })
}
