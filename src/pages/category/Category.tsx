import React, { useState, useEffect, useCallback } from "react";
import ConfirmAction from "@/components/ActionMenu";
import Dashboardheader from "@/components/Dashboardheader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/utils/toast";

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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axiosInstance";
import type { GetCategory, CreateCategory } from "./Types/type";
import { MoreHorizontal } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import StatusDot from "@/components/StatusDot";

function Category() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [categories, setCategories] = useState<GetCategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<GetCategory | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit">("delete");
  const [isProcessing, setIsProcessing] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pendingEditData, setPendingEditData] =
    useState<CreateCategory | null>(null);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await axiosInstance.get("/category/getcategories", {
        params: { page, limit, search },
      });

      setCategories(res.data.data ?? []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      setIsError(true);
      toastError("Failed to load categories");
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
  } = useForm<CreateCategory>({
    defaultValues: {
      categoryName: "",
      status: "active",
    },
  });

  /* =========================
     CREATE / EDIT SUBMIT
  ========================= */
  const onSubmit = async (data: CreateCategory) => {
    if (mode === "edit") {
      setPendingEditData(data);
      setConfirmType("edit");
      setConfirmOpen(true);
      return;
    }

    try {
      await axiosInstance.post("/category/createcategory", data);
      toastSuccess("Category created successfully");
      reset();
      setIsOpen(false);
      fetchData();
    } catch {
      toastError("Failed to create category");
    }
  };

  /* =========================
     EDIT
  ========================= */
  const handleEdit = (category: GetCategory) => {
    setMode("edit");
    setSelectedCategory(category);

    reset({
      categoryName: category.categoryName,
      status: category.status,
    });

    setIsOpen(true);
  };

  /* =========================
     DELETE
  ========================= */
  const handleDeleteClick = (category: GetCategory) => {
    setSelectedCategory(category);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      setIsProcessing(true);
      await axiosInstance.delete(
        `/category/deletecategory/${selectedCategory._id}`
      );
      toastSuccess("Category deleted successfully");
      fetchData();
    } catch {
      toastError("Failed to delete category");
    } finally {
      setIsProcessing(false);
      setConfirmOpen(false);
      setSelectedCategory(null);
    }
  };

  /* =========================
     CONFIRM EDIT
  ========================= */
  const confirmEdit = async () => {
    if (!selectedCategory || !pendingEditData) return;

    try {
      setIsProcessing(true);
      await axiosInstance.put(
        `/category/updatecategory/${selectedCategory._id}`,
        pendingEditData
      );

      toastSuccess("Category updated successfully");

      setConfirmOpen(false);
      setIsOpen(false);
      setPendingEditData(null);
      setSelectedCategory(null);
      reset();
      setMode("create");

      fetchData();
    } catch {
      toastError("Failed to update category");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="font-poppins">
      <Dashboardheader title="Category Management" />

      {/* SEARCH + ADD */}
      <div className="flex items-center justify-between p-8">
        <Input
          type="text"
          placeholder="Search Categories..."
          className="w-[300px]"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Button onClick={() => setIsOpen(true)}>Add Category</Button>
      </div>

      {/* TABLE */}
      <div className="p-8">
        <Table>
          <TableCaption>List of Categories</TableCaption>
          <TableHeader>
  <TableRow>
    <TableHead className="w-12 font-semibold">#</TableHead>
    <TableHead className="w-30 font-semibold">Category ID</TableHead>
    <TableHead className="font-semibold">Category Name</TableHead>
    <TableHead className="font-semibold">Status</TableHead>
    <TableHead className="w-30 font-semibold">Actions</TableHead>
  </TableRow>
</TableHeader>


          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading categories...
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500">
                  Failed to load categories
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              categories.map((category, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={category._id}>
  <TableCell className="w-12 text-muted-foreground">
    {rowNumber}
  </TableCell>

  <TableCell>{category.categoryId}</TableCell>

  <TableCell>{category.categoryName}</TableCell>

  {/* Status with dot */}
  <TableCell>
    <StatusDot status={category.status} />
  </TableCell>

  {/* Actions aligned right */}
  <TableCell className="text-right pr-12.5">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(category)}>
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-500"
          onClick={() => handleDeleteClick(category)}
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
        title={mode === "edit" ? "Edit Category" : "Create Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          {mode === "edit" && selectedCategory && (
            <div className="flex">
              <Label className="w-40">Category ID</Label>
              <Input value={selectedCategory.categoryId} disabled />
            </div>
          )}

          <div className="flex">
            <Label className="w-40">Category Name</Label>
            <Input {...register("categoryName", { required: true })} />
          </div>

          <div className="flex">
                      <Label className="w-50">Status</Label>
          
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                {" "}
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                Active
                              </SelectItem>
                              <SelectItem value="inactive">
                                {" "}
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                Inactive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
          confirmType === "delete" ? "Confirm Deletion" : "Confirm Changes"
        }
        description={
          confirmType === "delete"
            ? `Delete ${selectedCategory?.categoryName}?`
            : `Save changes to ${selectedCategory?.categoryName}?`
        }
        confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
        isLoading={isProcessing}
        onConfirm={
          confirmType === "delete" ? handleConfirmDelete : confirmEdit
        }
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}

export default Category;
