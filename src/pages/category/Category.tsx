import React from 'react'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { fetchCategories } from './api'
import type { Category } from './type'

function Category() {

  // const { data, isLoading, isError } = useQuery<Category[]>({
  //   queryKey: ['categories'],
  //   queryFn: async () => {
  //     const res = await fetchCategories()
  //     return res
  //   }
  // })

  return (
    <div>
      <h1>Category List</h1>
      
    </div>
  )
}

export default Category
