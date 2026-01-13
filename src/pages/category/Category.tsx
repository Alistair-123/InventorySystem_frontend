import React, { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
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

import type { CreateCategoryPayload } from "./type";
import { createCategory } from "./api";
import { useCategories } from "./useQuery";
function Category() {
  const [isOpen, setIsOpen] = useState(false);

  // for submittin data
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateCategoryPayload>({
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit: SubmitHandler<CreateCategoryPayload> = async (data) => {
    try {
      await createCategory(data);
      setIsOpen(false);
    } catch (error: any) {
      setError("root", {
        message: error?.response?.data?.message || "Failed to create category",
      });
    }
  };
  // for rendering data
  const { data: categories, isLoading, isError, error } = useCategories();

  const handleEdit = () => {};

  const handleDelete = () => {};
  return (
    <div className="font-poppins ">
      <Dashboardheader title="Category Management" />

      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Search Categories..."
          className="w-75"
        />
        <Button onClick={() => setIsOpen(true)}>Add Category</Button>
      </div>

      <div className="p-8 overflow-visible">
        <Table>
          <TableCaption>List of Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-10 text-start ">ID</TableHead>
              <TableHead className="text-start">Name</TableHead>
              <TableHead className="text-end">Status</TableHead>
              <TableHead className="pr-20 text-end">Actions</TableHead>
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

            {!isLoading && categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}

            {categories?.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell className="pl-10 text-start ">
                  {category.categoryId}
                </TableCell>
                <TableCell className="text-start">
                  {category.categoryName}
                </TableCell>
                <TableCell className="text-end">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      category.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-20 relative overflow-visible">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button className=" rotate-90  hover:bg-gray-300" variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4 hover:bg-gray-300 " />
                      </Button>
                    </DropdownMenuTrigger>
                    {/* onClick={() => handleEdit(category)} */}
                    <DropdownMenuContent 
                      align="end"
                      sideOffset={6}
                      className="z-50"
                    >
                      <DropdownMenuItem className="font-poppins">Edit</DropdownMenuItem>
                      {/*   onClick={() => handleDelete(category.categoryId)} */}
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 font-poppins">
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
        className="max-w-none"
      >
        <form className="space-y-5 p-8" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}

          <div className="flex gap-4">
            <Label className="w-40">Category ID</Label>
            <Input
              {...register("categoryId", {
                required: "Category ID is required",
              })}
            />
          </div>

          <div className="flex gap-4">
            <Label className="w-40">Category Name</Label>
            <Input
              {...register("categoryName", {
                required: "Category name is required",
              })}
            />
          </div>

          <div className="flex gap-4">
            <Label className="w-40">Status</Label>

            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Category;
