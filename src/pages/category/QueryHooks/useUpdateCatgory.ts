// QueryHooks/useUpdateCategory.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCategory } from '../Api/api'
import { categoryKeys } from "./categoryKeys"
import type { UpdateCategoryPayload } from '../Types/type'

interface UpdateArgs {
  categoryId: string
  payload: UpdateCategoryPayload
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, payload }: UpdateArgs) =>
      updateCategory(categoryId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      })
    },
  })
}
