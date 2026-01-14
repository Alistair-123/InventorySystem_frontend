import Dashboardheader from '@/components/Dashboardheader'
import React, {useState} from 'react'
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

function Item() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='font-poppins'>
      <Dashboardheader title="Item Management" />
      <div className='flex items-center justify-between p-4'>
        <Input type="text" placeholder="Search Items..." className="w-[300px] font-poppins" />
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Item</Button>
      </div>

      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Item ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Item Description</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Brand ID</TableHead>
            <TableHead>Unit ID</TableHead>
            <TableHead className='w-30'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {/* {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Item"
        className="max-w-none font-poppins"
      >
        <div className="space-y-5 p-8">
          <div className='flex'>
            <Label className='w-50'>Item ID</Label>
            <Input
              name="ItemId"
              // value={form.itemId}
              // onChange={handleChange}
              required
            />
          </div>

          <div className='flex'>
            <Label className='w-50'>Item Name</Label>
            <Input
              name="ItemName"
              // value={form.itemName}
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

export default Item
