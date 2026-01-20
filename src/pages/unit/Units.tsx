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
import type { CreateUnit, GetUnit } from "./types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Units() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [unit, setUnit] = useState<GetUnit[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pendingEditData, setPendingEditData] = useState<CreateUnit | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit">("delete");
  const [selectedUnit, setSelectedUnit] = useState<GetUnit | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await axiosInstance.get("/unit/getunit", {
        params: {
          page,
          limit,
          search,
        },
      });

      setUnit(res.data.data ?? []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setUnit([]);
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
    formState: { isSubmitting },
  } = useForm<CreateUnit>({
    defaultValues: {
      unitId: "",
      unitName: "",
      status: "active",
    },
  });

  const onSubmit = async (data: CreateUnit) => {
    if (mode === "edit") {
      setPendingEditData(data);
      setConfirmType("edit");
      setConfirmOpen(true);
      return;
    }

    await axiosInstance.post("/unit/createunit", data);
    reset();
    setIsOpen(false);
    fetchData();
  };

  const handleEdit = (unit: GetUnit) => {
    setMode("edit");
    setSelectedUnit(unit);

    reset({
      unitId: unit.unitId,
      unitName: unit.unitName,
      status: unit.status,
    });

    setIsOpen(true);
  };

  const handleDeleteClick = (unit: GetUnit) => {
    setSelectedUnit(unit);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUnit) return;

    try {
      setIsProcessing(true);

      if (confirmType === "delete") {
        await axiosInstance.delete(`/unit/deleteunit/${selectedUnit._id}`);
        fetchData();
      }

      setConfirmOpen(false);
      setSelectedUnit(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmEdit = async () => {
    if (!selectedUnit || !pendingEditData) return;

    try {
      setIsProcessing(true);

      await axiosInstance.put(
        `/unit/updateunit/${selectedUnit._id}`,
        pendingEditData
      );

      setConfirmOpen(false);
      setIsOpen(false);
      setPendingEditData(null);
      setSelectedUnit(null);
      reset();
      setMode("create");

      fetchData();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="font-poppins">
      <Dashboardheader title="Unit Management" />
      <div className="flex items-center justify-between p-8">
        <Input
          type="text"
          placeholder="Search Units..."
          className="w-75 font-poppins"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset pagination on new search
          }}
        />
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Unit
        </Button>
      </div>

      <div className="p-8">
        <Table className="p-4 ">
          <TableCaption>List of Units</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-30">Unit ID</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-30">Actions</TableHead>
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
                  Failed to load Units.
                  <Button variant="link" className="ml-2" onClick={fetchData}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && unit.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-400">
                  No Units found
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              unit.map((unit, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={unit._id}>
                    <TableCell className="w-12 text-muted-foreground">
                      {rowNumber}
                    </TableCell>

                    <TableCell>{unit.unitId}</TableCell>
                    <TableCell>{unit.unitName}</TableCell>
                    <TableCell>
                      <StatusDot status={unit.status} />
                    </TableCell>

                    <TableCell className="text-right pr-15">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(unit)}>
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteClick(unit)}
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
        title={mode === "edit" ? "Edit Unit" : "Create Unit"}
        className="max-w-none font-poppins"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          {/* <div className="flex">
            <Label className="w-50">Unit ID</Label>
            <Input
              {...register("unitId", {
                required: "Unit ID is required",
              })}
            />
          </div> */}

          <div className="flex">
            <Label className="w-50">Unit Name</Label>
            <Input
              {...register("unitName", {
                required: "Unit name is required",
              })}
            />
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
        title={
          confirmType === "delete" ? "Confirm Deletion" : "Confirm Changes"
        }
        description={
          confirmType === "delete" ? (
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {selectedUnit?.unitName}
              </span>
              ? This action cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to save changes to{" "}
              <span className="font-semibold">{selectedUnit?.unitName}</span>?
            </>
          )
        }
        confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
        isLoading={isProcessing}
        onConfirm={confirmType === "delete" ? handleConfirm : confirmEdit}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedUnit(null);
        }}
      />
    </div>
  );
}

export default Units;
