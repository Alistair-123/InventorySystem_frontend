import React, { useState } from "react"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"

import Dashboardheader from "@/components/Dashboardheader"
import Modal from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { CreateCategoryPayload } from "./type"
import { createCategory } from "./api"

function Category() {
  const [isOpen, setIsOpen] = useState(false)

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
  })

  const onSubmit: SubmitHandler<CreateCategoryPayload> = async (data) => {
    try {
      await createCategory(data)
      setIsOpen(false)
    } catch (error: any) {
      setError("root", {
        message:
          error?.response?.data?.message ||
          "Failed to create category",
      })
    }
  }

  return (
    <div className="font-poppins">
      <Dashboardheader title="Category Management" />

      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Search Categories..."
          className="w-[300px]"
        />
        <Button onClick={() => setIsOpen(true)}>
          Add Category
        </Button>
      </div>

      <div className="p-8">
        <Table>
          <TableCaption>List of Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody />
        </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Category"
        className="max-w-none"
      >
        <form
          className="space-y-5 p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.root && (
            <p className="text-sm text-red-500">
              {errors.root.message}
            </p>
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
  )
}

export default Category
