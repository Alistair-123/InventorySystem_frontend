import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect, useCallback } from "react";
import ConfirmAction from "@/components/ActionMenu";
import { useForm, Controller } from "react-hook-form";
import { MoreHorizontal } from "lucide-react";
import StatusDot from "@/components/StatusDot";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axiosInstance";
import type { CreateBrand, GetBrand } from "./types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toastSuccess, toastError } from "@/utils/toast";

function Brand() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [brands, setBrands] = useState<GetBrand[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pendingEditData, setPendingEditData] =
    useState<CreateBrand | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] =
    useState<"delete" | "edit">("delete");
  const [selectedBrand, setSelectedBrand] =
    useState<GetBrand | null>(null);

  /* =========================
     FETCH BRANDS
  ========================= */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await axiosInstance.get("/brand/getbrand", {
        params: { page, limit, search },
      });

      setBrands(res.data.data ?? []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      setIsError(true);
      toastError("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     FORM
  ========================= */
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateBrand>({
    defaultValues: {
      brandName: "",
      status: "active",
    },
  });

  /* =========================
     CREATE / EDIT SUBMIT
  ========================= */
  const onSubmit = async (data: CreateBrand) => {
    if (mode === "edit") {
      setPendingEditData(data);
      setConfirmType("edit");
      setConfirmOpen(true);
      return;
    }

    try {
      await axiosInstance.post("/brand/createbrand", data);
      toastSuccess("Brand created successfully");
      reset();
      setIsOpen(false);
      fetchData();
    } catch {
      toastError("Failed to create brand");
    }
  };

  /* =========================
     EDIT
  ========================= */
  const handleEdit = (brand: GetBrand) => {
    setMode("edit");
    setSelectedBrand(brand);

    reset({
      brandName: brand.brandName,
      status: brand.status,
    });

    setIsOpen(true);
  };

  /* =========================
     DELETE
  ========================= */
  const handleDeleteClick = (brand: GetBrand) => {
    setSelectedBrand(brand);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBrand) return;

    try {
      setIsProcessing(true);
      await axiosInstance.delete(
        `/brand/deletebrand/${selectedBrand._id}`
      );
      toastSuccess("Brand deleted successfully");
      fetchData();
    } catch {
      toastError("Failed to delete brand");
    } finally {
      setIsProcessing(false);
      setConfirmOpen(false);
      setSelectedBrand(null);
    }
  };

  /* =========================
     CONFIRM EDIT
  ========================= */
  const confirmEdit = async () => {
    if (!selectedBrand || !pendingEditData) return;

    try {
      setIsProcessing(true);
      await axiosInstance.put(
        `/brand/updatebrand/${selectedBrand._id}`,
        pendingEditData
      );

      toastSuccess("Brand updated successfully");

      setConfirmOpen(false);
      setIsOpen(false);
      setPendingEditData(null);
      setSelectedBrand(null);
      reset();
      setMode("create");

      fetchData();
    } catch {
      toastError("Failed to update brand");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="font-poppins">
      <Dashboardheader title="Brand Management" />

      {/* SEARCH + ADD */}
      <div className="flex items-center justify-between p-8">
        <Input
          type="text"
          placeholder="Search Brands..."
          className="w-75"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Button onClick={() => setIsOpen(true)}>Add Brand</Button>
      </div>

      {/* TABLE */}
      <div className="p-8">
        <Table>
          <TableCaption>List of Brands</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12
              font-semibold">#</TableHead>
              <TableHead className="w-30 font-semibold">Brand ID</TableHead>
              <TableHead className="font-semibold">Brand Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-30 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading brands...
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500">
                  Failed to load brands
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              brands.map((brand, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={brand._id}>
                    <TableCell>{rowNumber}</TableCell>
                    <TableCell>{brand.brandId}</TableCell>
                    <TableCell>{brand.brandName}</TableCell>
                    <TableCell>
                      <StatusDot status={brand.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(brand)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() =>
                              handleDeleteClick(brand)
                            }
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

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 p-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={mode === "edit" ? "Edit Brand" : "Create Brand"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-8"
        >
          <div className="flex">
            <Label className="w-50">Brand Name</Label>
            <Input {...register("brandName", { required: true })} />
          </div>

          <div className="flex">
            <Label className="w-50">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "edit" ? "Save Changes" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM ACTION */}
      <ConfirmAction
        open={confirmOpen}
        type={confirmType}
        title={
          confirmType === "delete"
            ? "Confirm Deletion"
            : "Confirm Changes"
        }
        description={
          confirmType === "delete"
            ? `Delete ${selectedBrand?.brandName}?`
            : `Save changes to ${selectedBrand?.brandName}?`
        }
        confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
        isLoading={isProcessing}
        onConfirm={
          confirmType === "delete"
            ? handleConfirmDelete
            : confirmEdit
        }
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedBrand(null);
        }}
      />
    </div>
  );
}

export default Brand;
