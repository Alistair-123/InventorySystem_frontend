import Dashboardheader from "@/components/Dashboardheader";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Item() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="font-poppins">
      <Dashboardheader title="Item Management" />
      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Search Items..."
          className="w-[300px] font-poppins"
        />
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Item
        </Button>
      </div>

      <div className="p-8">
        <Table className="p-4 ">
          <TableCaption>List of Items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-30">Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Item Description</TableHead>
              <TableHead>Category ID</TableHead>
              <TableHead>Brand ID</TableHead>
              <TableHead>Unit ID</TableHead>
              <TableHead className="w-30">Actions</TableHead>
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

      {/* -------------------------------------------- */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Item"
        className="max-w-none font-poppins"
      >
        <div className="p-8 space-y-6">
          <div className="flex gap-4">
            {/* Item Name */}
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <Label>Item Name</Label>
              <Input name="ItemName" required />
            </div>

            {/* Status */}
            <div className="flex items-center w-[40%] gap-4">
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Item Description */}
          <div className="grid grid-cols-[150px_1fr] gap-4">
            <Label className="pt-2">Item Description</Label>
            <Textarea name="ItemDescription" rows={4} required />
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="border-b border-b-gray-100 p-4 ">


                <span className="text-xl">Add Data</span>

              </AccordionTrigger>

              <AccordionContent className="p-4">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------- */}
    </div>
  );
}

export default Item;
