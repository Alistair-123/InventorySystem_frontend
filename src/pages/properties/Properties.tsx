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

function Property() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='font-poppins'>
      <Dashboardheader title="Property Management" />
      <div className='flex items-center justify-between p-4'>
        <Input type="text" placeholder="Search Properties..." className="w-[300px] font-poppins" />
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Property</Button>
      </div>

      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Properties</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Property No.</TableHead>
            <TableHead>Item ID</TableHead>
            <TableHead>Acquisition Date</TableHead>
            <TableHead>Acquisition ID</TableHead>
            <TableHead>Acquisition Value</TableHead>
            <TableHead>Personnel ID</TableHead>
            <TableHead>Office ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-30'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {/* {data?.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.id}</TableCell>
              <TableCell>{property.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Property"
        className="max-w-none font-poppins"
      >
        <div className="space-y-5 p-8">
          <div className='flex'>
            <Label className='w-50'>Property ID</Label>
            <Input
              name="PropertyId"
              // value={form.propertyId}
              // onChange={handleChange}
              required
            />
          </div>

          <div className='flex'>
            <Label className='w-50'>Property Name</Label>
            <Input
              name="PropertyName"
              // value={form.propertyName}
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
                  <SelectItem value="active"><span className='w-2 h-2 rounded-full bg-green-500' />Serviceable</SelectItem>
                  <SelectItem value="inactive"><span className='w-2 h-2 rounded-full bg-red-500' />Unserviceable</SelectItem>
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

export default Property
