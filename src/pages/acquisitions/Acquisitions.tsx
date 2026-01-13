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

function Acquisitions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='font-poppins'>
      <Dashboardheader title="Acquisition Management" />
      <div className='flex items-center justify-between p-4'>
        <Input type="text" placeholder="Search Acquisition..." className="w-[300px] font-poppins" />
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Acquisition</Button>
      </div>

      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Acquisition</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Acquisition ID</TableHead>
            <TableHead>Acquisition Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-30'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {/* {data?.map((acquisition) => (
            <TableRow key={acquisition.id}>
              <TableCell className="font-medium">{acquisition.id}</TableCell>
              <TableCell>{acquisition.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Acquisition"
        className="max-w-none font-poppins"
      >
        <div className="space-y-5 p-8">
          <div className='flex'>
            <Label className='w-50'>Acquisition ID</Label>
            <Input
              name="UnitId"
              // value={form.acquisitionId}
              // onChange={handleChange}
              required
            />
          </div>

          <div className='flex'>
            <Label className='w-50'>Acquisition Name</Label>
            <Input
              name="AcquisitionName"
              // value={form.acquisitionName}
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

export default Acquisitions
