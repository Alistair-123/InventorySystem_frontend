import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory } from '../Api/api'
import { categoryKeys } from "./categoryKeys"

export function useCreateCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      })
    },
  })
}
