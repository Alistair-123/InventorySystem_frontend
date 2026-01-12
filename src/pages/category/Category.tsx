import React,{ useState } from 'react'
import { QueryClient, useQuery } from '@tanstack/react-query'
// import { fetchCategories } from './api'
import type { Category } from './type'
import Dashboardheader from '@/components/Dashboardheader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Modal from '@/components/ui/modal'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm, type SubmitHandler } from "react-hook-form";


function Category() {
  const [isOpen, setIsOpen] = useState(false);
  // const { isLoading, }
  // const { data, isLoading, isError } = useQuery<Category[]>({
  //   queryKey: ['categories'],
  //   queryFn: async () => {
  //     const res = await fetchCategories()
  //     return res
  //   }
  // })

  return (
    <div className='font-poppins'>
      <Dashboardheader title="Category Management" />

      <div className='flex items-center justify-between p-4'>
        <Input type="text" placeholder="Search Categories..." className="w-[300px] font-poppins" />
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Category</Button>
      </div>
      
      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-30'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {/* {data?.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      </div>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Category"
        className="max-w-none font-poppins"
      >
        <div className="space-y-5 p-8">
          <div className='flex'>
            <Label className='w-50'>Category ID</Label>
            <Input
              name="categoryId"
              // value={form.categoryId}
              // onChange={handleChange}
              required
            />
          </div>

          <div className='flex'>
            <Label className='w-50'>Category Name</Label>
            <Input
              name="categoryName"
              // value={form.categoryName}
              // onChange={handleChange}
              required
            />
          </div>

            <div className="flex">
              <Label className="w-50">Status</Label>

              <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                 <SelectContent>
                  <SelectItem value="active"><span className='w-2 h-2 rounded-full bg-green-500' />Active</SelectItem>
                  <SelectItem value="inactive"><span className='w-2 h-2 rounded-full bg-red-500' />In Active</SelectItem>
                </SelectContent>
              </Select>
              
            </div>



          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button >
              Save
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default Category
