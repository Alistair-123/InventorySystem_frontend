import Dashboardheader from "@/components/Dashboardheader";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PropertyStatus, PropertyFormOptions, Property } from "./types";
import {
  createProperty,
  fetchPropertyFormOptions,
  fetchProperties,
    updateProperty,   // ❗ missing
  deleteProperty,   // ❗ missing
} from "./fetchdata";
import ConfirmAction from "@/components/ActionMenu";
import { toast } from "react-toastify";

/* ============================
   FORM TYPE
============================ */
export interface CreatePropertyForm {
  propertyNo: string;
  item: string;
  acquisitionDate: string;
  acquisitionType: string;
  acquisitionValue: number;
  personnel: string;
  office: string;
  status: PropertyStatus;
}

function Property() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PropertyFormOptions | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);


  const handleEdit = async (property: Property) => {
  setEditingId(property._id);
  setIsOpen(true);

  reset({
    propertyNo: property.propertyNo,
    item: property.item._id,
    acquisitionDate: property.acquisitionDate.slice(0, 10),
    acquisitionType: property.acquisitionType._id,
    acquisitionValue: property.acquisitionValue,
    personnel: property.personnel._id,
    office: property.office._id,
    status: property.status,
  });
};

  const {
    register,
    handleSubmit,
    setValue,
    reset,
     watch,
    formState: { isSubmitting },
  } = useForm<CreatePropertyForm>({
    defaultValues: {
      status: "serviceable",
    },
  });



const watchedItem = watch("item");
const watchedAcquisitionType = watch("acquisitionType");
const watchedPersonnel = watch("personnel");
const watchedOffice = watch("office");
const watchedStatus = watch("status");

  /* ----------------------------
     LOAD SELECT OPTIONS
  ----------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    fetchPropertyFormOptions().then(setOptions).catch(console.error);
  }, [isOpen]);

  /* ----------------------------
     SUBMIT
  ----------------------------- */
 const onSubmit = async (data: CreatePropertyForm) => {
  try {
    if (editingId) {
      await updateProperty(editingId, data);
      toast.success("Property updated successfully");
    } else {
      await createProperty(data);
      toast.success("Property created successfully");
    }

    reset();
    setEditingId(null);
    setIsOpen(false);
    fetchData();
  } catch (error) {
    toast.error("Something went wrong");
  }
};



  const handleDeleteClick = (property: Property) => {
  setSelectedProperty(property);
  setIsDeleteOpen(true);
};

const confirmDelete = async () => {
  if (!selectedProperty) return;

  try {
    await deleteProperty(selectedProperty._id);
    toast.success("Property deleted");
    fetchData();
  } catch {
    toast.error("Failed to delete property");
  } finally {
    setIsDeleteOpen(false);
    setSelectedProperty(null);
  }
};



  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page when searching
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await fetchProperties({
        page,
        limit,
        search: debouncedSearch,
      });

      setProperties(res.data);
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
  }, [page, debouncedSearch]);

  useEffect(() => {
  if (!isOpen) {
    setOptions(null);
  }
}, [isOpen]);

  return (
    <div className="font-poppins">
      <Dashboardheader title="Property Management" />

      <div className="flex items-center justify-between p-8">
        <Input
          type="text"
          placeholder="Search Properties..."
          className="w-[300px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button onClick={() => setIsOpen(true)}>Add Property</Button>
      </div>

      {/* TABLE (data loading later) */}
      <div className="p-8">
        <Table className="p-4">
          <TableCaption>List of Properties</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">#</TableHead>
              <TableHead className="font-semibold">Property No.</TableHead>
              <TableHead className="font-semibold">Item Name</TableHead>
              <TableHead className="font-semibold">Acquisition Date</TableHead>
              <TableHead className="font-semibold">Acquisition Name</TableHead>
              <TableHead className="font-semibold">Acquisition Value</TableHead>
              <TableHead className="font-semibold">Personnel</TableHead>
              <TableHead className="font-semibold">Office</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Loading properties...
                </TableCell>
              </TableRow>
            )}

            {/* ERROR */}
            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-red-500">
                  Failed to load properties.
                  <Button variant="link" className="ml-2" onClick={fetchData}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {/* NO DATA */}
            {!isLoading && !isError && properties.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground"
                >
                  No properties found
                </TableCell>
              </TableRow>
            )}

            {/* DATA */}
            {!isLoading &&
              !isError &&
              properties.map((property, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={property._id}>
                    <TableCell className="text-muted-foreground">
                      {rowNumber}
                    </TableCell>

                    <TableCell>{property.propertyNo}</TableCell>

                    <TableCell>{property.item?.itemName}</TableCell>

                    <TableCell>
                      {new Date(property.acquisitionDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {property.acquisitionType?.acquisitionTypeName}
                    </TableCell>

                    <TableCell>
                      ₱{property.acquisitionValue.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {property.personnel?.lastName},{" "}
                      {property.personnel?.firstName}
                    </TableCell>

                    <TableCell>{property.office?.officeName}</TableCell>

                    <TableCell>
                      <span className="capitalize">{property.status}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleEdit(property)}>
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteClick(property)}
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
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* ============================
          CREATE MODAL
      ============================ */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? "Edit Property" : "Create Property"}
        className="max-w-none"
      >
        {!options ? null : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
            {/* Property No */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Property No.</Label>
              <Input {...register("propertyNo", { required: true })} />
            </div>

            {/* Item */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Item</Label>
              <Select  value={watchedItem} onValueChange={(v) => setValue("item", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {options.items.map((i) => (
                    <SelectItem key={i._id} value={i._id}>
                      {i.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Acquisition Date */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Acquisition Date</Label>
              <Input
                type="date"
                {...register("acquisitionDate", { required: true })}
              />
            </div>

            {/* Acquisition Type */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Acquisition Type</Label>
              <Select  value={watchedAcquisitionType} onValueChange={(v) => setValue("acquisitionType", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select acquisition type" />
                </SelectTrigger>
                <SelectContent>
                  {options.acquisitionTypes.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.acquisitionTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Acquisition Value */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Acquisition Value</Label>
              <Input
                type="number"
                {...register("acquisitionValue", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Personnel */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Personnel</Label>
              <Select   value={watchedPersonnel} onValueChange={(v) => setValue("personnel", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select personnel" />
                </SelectTrigger>
                <SelectContent>
                  {options.personnel.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.lastName}, {p.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Office */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Office</Label>
              <Select value={watchedOffice} onValueChange={(v) => setValue("office", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  {options.offices.map((o) => (
                    <SelectItem key={o._id} value={o._id}>
                      {o.officeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <Label className="w-40">Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(v) => setValue("status", v as PropertyStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serviceable">Serviceable</SelectItem>
                  <SelectItem value="unserviceable">Unserviceable</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

     <ConfirmAction
        open={isDeleteOpen}
          type="delete"
          title="Delete Property"
          description={
            <>
              Are you sure you want to delete property{" "}
              <strong>{selectedProperty?.propertyNo}</strong>?
            </>
          }
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />


    </div>
  );
}

export default Property;
