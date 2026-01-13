import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Dashboardheader from "@/components/Dashboardheader";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

import type { CreateCategoryPayload } from "./Types/type";

import { useGetCategories } from "./QueryHooks/useGetCategory";
import { useCreateCategories } from "./QueryHooks/useCreateCategory";
import { useDeleteCategory } from "./QueryHooks/useDeleteCategory";

function Category() {
  const [isOpen, setIsOpen] = useState(false);

  /** QUERY */
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetCategories();

  /** MUTATIONS */
  const createMutation = useCreateCategories();
  const deleteMutation = useDeleteCategory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateCategoryPayload>({
    defaultValues: { status: "active" },
  });

  const onSubmit = (data: CreateCategoryPayload) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        setError("root", {
          message:
            error?.response?.data?.message ||
            "Failed to create category",
        });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="font-poppins">
      <Dashboardheader title="Category Management" />

      <div className="flex items-center justify-between p-4">
        <Input placeholder="Search Categories..." className="w-75" />
        <Button onClick={() => setIsOpen(true)}>Add Category</Button>
      </div>

      <div className="p-8">
        <Table>
          <TableCaption>List of Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-10 text-start ">Category ID</TableHead>
              <TableHead className="text-start">Category Name</TableHead>
              <TableHead className="text-end">Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500">
                  Failed to load categories
                </TableCell>
              </TableRow>
            )}

            {!isLoading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}

            {categories.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell>{category.categoryId}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell className="text-end">
                  {category.status}
                </TableCell>
                <TableCell className="text-end">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                       onClick={() => handleDelete(category._id)}

                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Category"
        className="font-poppins"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          {errors.root && (
            <p className="text-red-500">{errors.root.message}</p>
          )}

          <div className="flex gap-4">
            <Label className="w-40">Category ID</Label>
            <Input {...register("categoryId", { required: true })} />
          </div>

          <div className="flex gap-4">
            <Label className="w-40">Category Name</Label>
            <Input {...register("categoryName", { required: true })} />
          </div>
          
          <div className="flex gap-4">
            <Label className="w-40">
              Status
            </Label>
          
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Category;
