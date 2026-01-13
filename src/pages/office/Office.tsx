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

function Offices() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='font-poppins'>
      <Dashboardheader title="Office Management" />
      <div className='flex items-center justify-between p-4'>
        <Input type="text" placeholder="Search Offices..." className="w-[300px] font-poppins" />
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Office</Button>
      </div>

      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Offices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Office ID</TableHead>
            <TableHead>Office Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-30'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {/* {data?.map((office) => (
            <TableRow key={office.id}>
              <TableCell className="font-medium">{office.id}</TableCell>
              <TableCell>{office.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Office"
        className="max-w-none font-poppins"
      >
        <div className="space-y-5 p-8">
          <div className='flex'>
            <Label className='w-50'>Office ID</Label>
            <Input
              name="UnitId"
              // value={form.officeId}
              // onChange={handleChange}
              required
            />
          </div>

          <div className='flex'>
            <Label className='w-50'>Office Name</Label>
            <Input
              name="OfficeName"
              // value={form.officeName}
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

export default Offices
