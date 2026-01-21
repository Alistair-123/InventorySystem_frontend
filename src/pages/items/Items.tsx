import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import axiosInstance from "@/utils/axiosInstance";
import { fetchReferenceData } from "./api/fetchedData";

import type { CategoryRef, BrandRef, UnitRef, MongoId } from "./types/types";

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
} from "@/components/ui/accordion";
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
  const [categories, setCategories] = useState<CategoryRef[]>([]);
  const [brands, setBrands] = useState<BrandRef[]>([]);
  const [units, setUnits] = useState<UnitRef[]>([]);

  const [category, setCategory] = useState<MongoId>("");
  const [brand, setBrand] = useState<MongoId>("");
  const [unit, setUnit] = useState<MongoId>("");

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const data = await fetchReferenceData();

        setCategories(data.categories);
        setBrands(data.brands);
        setUnits(data.units);
      } catch (error) {
        console.error("Failed to load reference data", error);
      }
    };

    loadReferenceData();
  }, []);

  return (
    <div className="font-poppins">
      <Dashboardheader title="Item Management" />
      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Search Items..."
          className="w-75 font-poppins"
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
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <Label>Item Image</Label>
              <Input type="file" className="w-30 h-30 rounded-full" name="ItemName" required />
            </div>
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

              <AccordionContent className="p-4 space-y-4">
                {/* CATEGORY */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4 ">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* BRAND */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label>Brand</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.brandName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* UNIT */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label>Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.unitName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
