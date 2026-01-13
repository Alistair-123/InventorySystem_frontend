import { useQuery } from "@tanstack/react-query"
import { getCategories } from '../Api/api'
import type { GetCategory } from '../Types/type'
export function useGetCategories() {
  return useQuery<GetCategory[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  })
}
