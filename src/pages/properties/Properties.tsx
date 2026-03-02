import Dashboardheader from "@/components/Dashboardheader";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Hash, Package, CalendarDays, ClipboardList, DollarSign, UserRound, Building2, ShieldCheck } from "lucide-react";
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
import StatusDot from "@/components/StatusDot";
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
const [pendingEdit, setPendingEdit] = useState<Property | null>(null);


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

  const handleEdit = (property: Property) => {
  setEditingId(property._id);
  setPendingEdit(property);
  setIsOpen(true);
};


  useEffect(() => {
  if (!options || !pendingEdit) return;

  reset({
  propertyNo: pendingEdit.propertyNo,
  item: pendingEdit.item?._id ?? "",
  acquisitionDate: pendingEdit.acquisitionDate.slice(0, 10),
  acquisitionType: pendingEdit.acquisitionType?._id ?? "",
  acquisitionValue: pendingEdit.acquisitionValue,
  personnel: pendingEdit.personnel?._id ?? "",
  office: pendingEdit.office?._id ?? "",
  status: pendingEdit.status,
});


  setPendingEdit(null);
}, [options, pendingEdit, reset]);






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

      <div className="flex items-center justify-between p-4 pb-0">
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
      <div className="p-4">
        <Table className="border">
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
                      <StatusDot status={property.status} />
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
  className="max-w-2xl"
>
  {!options ? null : (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">

      {/* ── Section 1: Identity ─────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-1 rounded-full bg-zinc-800" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Property Info</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Property No */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              <Hash size={11} /> Property No.
            </label>
            <Input
              {...register("propertyNo", { required: true })}
              placeholder="e.g. PROP-0001"
              className="font-mono"
            />
          </div>

          {/* Item */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              <Package size={11} /> Item
            </label>
            <Select value={watchedItem} onValueChange={(v) => setValue("item", v)}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>
                {options.items.map((i) => (
                  <SelectItem key={i._id} value={i._id}>{i.itemName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status — full width, pill buttons */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              <ShieldCheck size={11} /> Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "serviceable",   label: "Serviceable",   ring: "ring-emerald-300 bg-emerald-50 text-emerald-700",   dot: "bg-emerald-500" },
                { value: "unserviceable", label: "Unserviceable", ring: "ring-amber-300 bg-amber-50 text-amber-700",         dot: "bg-amber-400"   },
                { value: "disposed",      label: "Disposed",      ring: "ring-zinc-300 bg-zinc-100 text-zinc-600",            dot: "bg-zinc-400"    },
                { value: "lost",          label: "Lost",          ring: "ring-red-300 bg-red-50 text-red-600",                dot: "bg-red-400"     },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setValue("status", s.value as PropertyStatus)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${
                    watchedStatus === s.value
                      ? `ring-2 ${s.ring} border-transparent`
                      : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${watchedStatus === s.value ? s.dot : "bg-zinc-300"}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="relative my-6 flex items-center">
        <div className="flex-1 border-t border-zinc-100" />
        <span className="mx-3 text-[10px] uppercase tracking-widest text-zinc-300">Acquisition</span>
        <div className="flex-1 border-t border-zinc-100" />
      </div>

      {/* ── Section 2: Acquisition ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Acquisition Date */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <CalendarDays size={11} /> Date
          </label>
          <Input type="date" {...register("acquisitionDate", { required: true })} />
        </div>

        {/* Acquisition Value */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <DollarSign size={11} /> Value
          </label>
          <Input
            type="number"
            placeholder="0.00"
            {...register("acquisitionValue", { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Acquisition Type */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <ClipboardList size={11} /> Type
          </label>
          <Select value={watchedAcquisitionType} onValueChange={(v) => setValue("acquisitionType", v)}>
            <SelectTrigger><SelectValue placeholder="Select acquisition type" /></SelectTrigger>
            <SelectContent>
              {options.acquisitionTypes.map((a) => (
                <SelectItem key={a._id} value={a._id}>{a.acquisitionTypeName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="relative my-6 flex items-center">
        <div className="flex-1 border-t border-zinc-100" />
        <span className="mx-3 text-[10px] uppercase tracking-widest text-zinc-300">Assignment</span>
        <div className="flex-1 border-t border-zinc-100" />
      </div>

      {/* ── Section 3: Assignment ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Personnel */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <UserRound size={11} /> Personnel
          </label>
          <Select value={watchedPersonnel} onValueChange={(v) => setValue("personnel", v)}>
            <SelectTrigger><SelectValue placeholder="Select personnel" /></SelectTrigger>
            <SelectContent>
              {options.personnel.map((p) => (
                <SelectItem key={p._id} value={p._id}>{p.lastName}, {p.firstName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Office */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <Building2 size={11} /> Office
          </label>
          <Select value={watchedOffice} onValueChange={(v) => setValue("office", v)}>
            <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
            <SelectContent>
              {options.offices.map((o) => (
                <SelectItem key={o._id} value={o._id}>{o.officeName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
        <p className="text-xs text-zinc-400">
          {editingId ? "Editing existing record" : "All fields are required"}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Property"}
          </Button>
        </div>
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
