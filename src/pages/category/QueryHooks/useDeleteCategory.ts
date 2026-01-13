// QueryHooks/useDeleteCategory.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCategory } from  '../Api/api'
import { categoryKeys } from "./categoryKeys"

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      })

      queryClient.removeQueries({
        queryKey: categoryKeys.detail(categoryId),
      })
    },
  })
}
