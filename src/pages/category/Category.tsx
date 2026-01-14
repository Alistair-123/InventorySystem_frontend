import React, { useState, useEffect, useCallback } from "react";
import ConfirmAction from "@/components/ActionMenu";
import Dashboardheader from "@/components/Dashboardheader";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GetCategory | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit">("delete");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pendingEditData, setPendingEditData] =
  useState<CreateCategory | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await axiosInstance.get("/category/getcategories", {
        params: {
          page,
          limit,
          search,
        },
      });

      setCategories(res.data.data ?? []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategory>({
    defaultValues: {
      categoryId: "",
      categoryName: "",
      status: "active",
    },
  });

 const onSubmit = async (data: CreateCategory) => {
  if (mode === "edit") {
    setPendingEditData(data);   // ✅ store snapshot
    setConfirmType("edit");
    setConfirmOpen(true);
    return;
  }

  await axiosInstance.post("/category/createcategory", data);
  reset();
  setIsOpen(false);
  fetchData();
};
 
  const handleEdit = (category: GetCategory) => {
  setMode("edit");
  setSelectedCategory(category);

  reset({
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    status: category.status,
  });

  setIsOpen(true);
};


  const handleDeleteClick = (category: GetCategory) => {
    setSelectedCategory(category);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedCategory) return;

    try {
      setIsProcessing(true);

      if (confirmType === "delete") {
        await axiosInstance.delete(
          `/category/deletecategory/${selectedCategory._id}`
        );
        fetchData();
      }

      setConfirmOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

 const confirmEdit = async () => {
  if (!selectedCategory || !pendingEditData) return;

  try {
    setIsProcessing(true);

    await axiosInstance.put(
      `/category/updatecategory/${selectedCategory._id}`,
      pendingEditData
    );

    setConfirmOpen(false);
    setIsOpen(false);
    setPendingEditData(null);
    setSelectedCategory(null);
    reset();
    setMode("create");

    fetchData();
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="font-poppins">
      <Dashboardheader title="Category Management" />
      <div className="flex items-center justify-between p-8">
        <Input
          type="text"
          placeholder="Search Brands..."
          className="w-[300px] font-poppins"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset pagination on new search
          }}
        />
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Category
        </Button>
      </div>

      <div className="p-8">
        <Table className="p-4">
          <TableCaption>List of Brands</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-30">Category ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-30">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 1. Loading */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading categories...
                </TableCell>
              </TableRow>
            )}

            {/* 2. Error */}
            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500">
                  Failed to load categories.
                  <Button variant="link" className="ml-2" onClick={fetchData}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {/* 3. Empty */}
            {!isLoading && !isError && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}

            {/* 4. Success */}
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
                    <TableCell>
                      <StatusDot status={category.status} />
                    </TableCell>

                    <TableCell className="text-right pr-15">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
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

        <div className="flex items-center justify-center gap-4 p-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={mode === "edit" ? "Edit Category" : "Create Category"}
        className="max-w-none font-poppins"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          {/* Category ID */}
          <div className="flex">
            <Label className="w-50">Category ID</Label>
            <Input
              {...register("categoryId", {
                required: "Category ID is required",
              })}
            />
          </div>

          {/* Category Name */}
          <div className="flex">
            <Label className="w-50">Category Name</Label>
            <Input
              {...register("categoryName", {
                required: "Category name is required",
              })}
            />
          </div>

          {/* Status */}
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

          {/* Actions */}
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

       <ConfirmAction
  open={confirmOpen}
  type={confirmType}
  title={confirmType === "delete" ? "Confirm Deletion" : "Confirm Changes"}
  description={
    confirmType === "delete" ? (
      <>
        Are you sure you want to delete{" "}
        <span className="font-semibold text-red-500">
          {selectedCategory?.categoryName}
        </span>
        ? This action cannot be undone.
      </>
    ) : (
      <>
        Are you sure you want to save changes to{" "}
        <span className="font-semibold">
          {selectedCategory?.categoryName}
        </span>
        ?
      </>
    )
  }
  confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
  isLoading={isProcessing}
  onConfirm={confirmType === "delete" ? handleConfirm : confirmEdit}
  onCancel={() => {
    setConfirmOpen(false);
    setSelectedCategory(null);
  }}
/>
       

    </div>
  );
}

export default Category;
