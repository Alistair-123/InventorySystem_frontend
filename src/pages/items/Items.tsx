import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import {
  fetchReferenceData,
  createItem,
  fetchItems,
  updateItem,
  deleteItem,
} from "./api/fetchedData";
import { MoreHorizontal } from "lucide-react";
import type { Item } from "./types/types";
import ConfirmAction from "@/components/ActionMenu";
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
  const [categories, setCategories] = useState<CategoryRef[]>([]);
  const [brands, setBrands] = useState<BrandRef[]>([]);
  const [units, setUnits] = useState<UnitRef[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Edit / confirm state
  const [editingId, setEditingId] = useState<MongoId | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

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
    // Build FormData
    const formData = new FormData();
    formData.append("itemName", values.itemName);
    formData.append("itemDescription", values.itemDescription ?? "");
    formData.append("category", values.category);
    formData.append("brand", values.brand);
    formData.append("unit", values.unit);
    formData.append("uploadType", "itemsimage");

    if (values.itemImage && (values.itemImage as FileList).length > 0) {
      formData.append("itemImage", (values.itemImage as FileList)[0]);
    }

    if (editingId) {
      // Edit flow: show confirm modal first, store FormData
      setPendingFormData(formData);
      setConfirmType("edit");
      setConfirmOpen(true);
      setSelectedItem(items.find((i) => i._id === editingId) ?? null);
      return;
    }

    // Create new item immediately
    try {
      setIsProcessing(true);
      await createItem(formData);
      // refresh
      await fetchData();
      reset();
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setIsProcessing(false);
    }
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
        search: search.trim() || undefined,
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

  /* ------------------ Edit / Delete handlers ------------------ */

  const handleEdit = (item: Item) => {
    // Populate form with item data
    setEditingId(item._id);
    setSelectedItem(item);
    setPreview(resolveImageUrl(item.itemImage) || null);

    // set all fields
    setValue("itemName", item.itemName);
    setValue("itemDescription", item.itemDescription ?? "");
    setValue("status", item.status ?? "active");
    setValue("category", item.category?._id ?? "");
    setValue("brand", item.brand?._id ?? "");
    setValue("unit", item.unit?._id ?? "");
    // Do NOT set file input value programmatically (browsers block). Leave itemImage blank unless user selects a new file.

    setIsOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  // Called when confirming deletion
  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      setIsProcessing(true);
      await deleteItem(selectedItem._id);
      setConfirmOpen(false);
      setSelectedItem(null);
      // If currently editing this item, clear edit state
      if (editingId === selectedItem._id) {
        setEditingId(null);
        reset();
        setPreview(null);
        setIsOpen(false);
      }
      await fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Called when confirming edit/save
  const confirmEdit = async () => {
    if (!editingId || !pendingFormData) return;

    try {
      setIsProcessing(true);
      await updateItem(editingId, pendingFormData);
      setConfirmOpen(false);
      setPendingFormData(null);
      setEditingId(null);
      setSelectedItem(null);
      reset();
      setPreview(null);
      setIsOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel handlers for confirm
  const cancelConfirm = () => {
    setConfirmOpen(false);
    setConfirmType(null);
    setPendingFormData(null);
    // If user cancelled delete, keep selectedItem untouched for now; we clear it for safety:
    setSelectedItem(null);
  };

  // If user clicks Cancel on form, clear editing state and form
  const handleCancelForm = () => {
    reset();
    setPreview(null);
    setIsOpen(false);
    setEditingId(null);
    setSelectedItem(null);
    setPendingFormData(null);
  };

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
        <Button
          className="cursor-pointer"
          onClick={() => {
            // open create modal
            reset({ status: "active" });
            setEditingId(null);
            setPreview(null);
            setIsOpen(true);
          }}
        >
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
                        src={resolveImageUrl(item.itemImage) || "/image.png"}
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
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCancelForm}
        title={editingId ? "Edit Item" : "Create Item"}
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((u) => (
                            <SelectItem key={u._1d} value={u._id}>
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
            <Button type="button" variant="outline" onClick={handleCancelForm}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      {/* ConfirmAction for Delete / Edit */}
      <ConfirmAction
        open={confirmOpen}
        type={confirmType ?? undefined}
        title={confirmType === "delete" ? "Confirm Deletion" : "Confirm Changes"}
        description={
          confirmType === "delete" ? (
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {selectedItem?.itemName}
              </span>
              ? This action cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to save changes to{" "}
              <span className="font-semibold">{selectedItem?.itemName}</span>?
            </>
          )
        }
        confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
        isLoading={isProcessing}
        onConfirm={confirmType === "delete" ? handleConfirm : confirmEdit}
        onCancel={cancelConfirm}
      />
    </div>
  );
}

export default Item;
