import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import { fetchReferenceData, createItem, fetchItems } from "./api/fetchedData";
import { MoreHorizontal } from "lucide-react";
import type { Item } from "./types/types";
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
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import { resolveImageUrl } from "../../utils/image";
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
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  
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

  const fetchData = async () => {
  try {
    setIsLoading(true);
    setIsError(false);

    const res = await fetchItems({
      page,
      limit,
      search: search.trim() || undefined
    });

    setItems(res.data);
    setTotalPages(res.pagination.totalPages);
  } catch (error) {
    console.error(error);
    setIsError(true);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
  fetchData();
}, [page, limit, search]);

useEffect(() => {
  const timeout = setTimeout(() => {
    setPage(1);
    fetchData();
  }, 400);

  return () => clearTimeout(timeout);
}, [search]);


  const handleEdit = () => {};

  const handleDeleteClick = () => {};
  return (
    <div className="font-poppins">
      <Dashboardheader title="Item Management" />
      <div className="flex items-center justify-between p-8 ">
        <Input
          type="text"
          placeholder="Search Items..."
          className="w-75 font-poppins"
           onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset pagination on new search
          }}
        />
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Item
        </Button>
      </div>

      <div className="p-8">
        <Table className="p-4">
          <TableCaption>List of Items</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Item Image</TableHead>
              <TableHead className="w-30">Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Item Description</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead className="w-30">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading items...
                </TableCell>
              </TableRow>
            )}

            {/* Error */}
            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-red-500">
                  Failed to load items.
                  <Button variant="link" className="ml-2" onClick={fetchData}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {/* Empty */}
            {!isLoading && !isError && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-red-400">
                  No items found
                </TableCell>
              </TableRow>
            )}

            {/* Data */}
            {!isLoading &&
              !isError &&
              items.map((item, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={item._id}>
                    <TableCell className="text-muted-foreground">
                      {rowNumber}
                    </TableCell>

                    {/* Item Image */}
                    <TableCell>
                      <img
                        src={
                          resolveImageUrl(item.itemImage) || "/image.png"
                        }
                        alt={item.itemName}
                        className="w-15 h-15 rounded-md object-cover border"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/image.png";
                        }}
                      />
                    </TableCell>

                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.itemDescription || "—"}
                    </TableCell>

                    <TableCell>{item.category?.categoryName}</TableCell>
                    <TableCell>{item.brand?.brandName}</TableCell>
                    <TableCell>{item.unit?.unitName}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-15">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteClick(item)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

              <div className="flex items-center justify-between px-8 py-4">
  <span className="text-sm text-muted-foreground">
    Page {page} of {totalPages}
  </span>

  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 1}
      onClick={() => setPage((p) => Math.max(1, p - 1))}
    >
      Previous
    </Button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(p =>
        p === 1 ||
        p === totalPages ||
        Math.abs(p - page) <= 1
      )
      .map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "default" : "outline"}
          onClick={() => setPage(p)}
        >
          {p}
        </Button>
      ))}

    <Button
      variant="outline"
      size="sm"
      disabled={page === totalPages}
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    >
      Next
    </Button>
  </div>
</div>

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
                      <SelectItem value="active">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Active
                      </SelectItem>
                      <SelectItem value="inactive">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-[150px_1fr] gap-4">
            <Label className="pt-2">Item Description</Label>

            <Controller
              name="itemDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Textarea
                  rows={4}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
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
