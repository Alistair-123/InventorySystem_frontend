import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import { fetchReferenceData, createItem } from "./api/fetchedData";
import type {
  CategoryRef,
  BrandRef,
  UnitRef,
  MongoId,
  CreateItemPayload,
} from "./types/types";
import { useForm, Controller } from "react-hook-form";

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
  const [preview, setPreview] = useState<string | null>(null);
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

  const {
    register,
    handleSubmit,
    control,
    reset,
     setValue,
    formState: { errors },
  } = useForm<CreateItemPayload>({
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (values: CreateItemPayload) => {
    const formData = new FormData();

    formData.append("itemName", values.itemName);
    formData.append("itemDescription", values.itemDescription ?? "");
    formData.append("category", values.category);
    formData.append("brand", values.brand);
    formData.append("unit", values.unit);
    formData.append("uploadType", "itemsimage");


    if (values.itemImage && values.itemImage.length > 0) {
  formData.append("itemImage", (values.itemImage as FileList)[0]);
}

    await createItem(formData);

    reset();
    setIsOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) {
    setPreview(URL.createObjectURL(file));
    setValue("itemImage", e.target.files as FileList, {
      shouldValidate: true,
    });
  }
};


  return (
    <div className="font-poppins">
      <Dashboardheader title="Item Management" />
      <div className="flex items-center justify-between p-8 ">
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
        className="max-w-none font-poppins h-[80%]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          {/* ITEM IMAGE */}
          <div className="flex gap-4">
            <Label className="pr-17">Item Image</Label>
                <Controller
                name="itemImage"
                control={control}
                render={({ field }) => (
                  <label className="cursor-pointer">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-30 h-30 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-30 h-30 rounded-full border flex items-center justify-center">
                        Select Image
                      </div>
                    )}

                    <Input
                    name="itemImage" 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        field.onChange(files);
                        setPreview(URL.createObjectURL(files[0]));
                      }}
                    />
                  </label>
                )}
              />
</div>

          <div className="flex gap-4">
            {/* ITEM NAME */}
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <Label>Item Name</Label>
              <Input
                {...register("itemName", { required: "Item name is required" })}
              />
            </div>

            {/* STATUS */}
            <div className="flex items-center w-[40%] gap-4">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active"><span className="h-2 w-2 rounded-full bg-green-500"></span>Active</SelectItem>
                      <SelectItem value="inactive"><span className="h-2 w-2 rounded-full bg-red-500" />Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-[150px_1fr] gap-4">
            <Label className="pt-2">Item Description</Label>
            <Textarea rows={4} {...register("itemDescription")} />
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="border-b border-b-gray-100 p-4">
                <span className="text-xl">Add Data</span>
              </AccordionTrigger>

              <AccordionContent className="p-4 space-y-4">
                {/* CATEGORY */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label>Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    )}
                  />
                </div>

                {/* BRAND */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label>Brand</Label>
                  <Controller
                    control={control}
                    name="brand"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    )}
                  />
                </div>

                {/* UNIT */}
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label>Unit</Label>
                  <Controller
                    control={control}
                    name="unit"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------- */}
    </div>
  );
}

export default Item;
